import React from 'react';
import { useHub } from '../../context/HubContext';
import { PlusIcon } from '../common/Icons';
import { FDAYS, FMONS, money, cdown, ago, D } from '../../utils/formatters';
import { rankBids } from '../../utils/bidRanking';
export const AdminDashboard = () => {
    const { projects, payments, designers, now, go, openProject, setPf, } = useHub();
    const tnow = new Date(now);
    const todayText = `${FDAYS[tnow.getDay()]} ${tnow.getDate()} ${FMONS[tnow.getMonth()]}`;
    const cnt = (statuses) => projects.filter((p) => statuses.includes(p.status)).length;
    const soonOpen = projects.filter((p) => p.status === 'open' && cdown(p.closes, now).soon);
    const monthPaid = payments
        .filter((x) => x.status === 'paid' && x.at && x.at > now - 30 * D)
        .reduce((a, x) => a + x.amount, 0);
    const duePay = payments.filter((x) => x.status === 'due');
    const dueSum = duePay.reduce((a, x) => a + x.amount, 0);
    const filterGo = (status) => () => {
        setPf({ q: '', status, cat: 'all' });
        go('a-projects');
    };
    const tiles = [
        {
            label: 'Open projects',
            value: String(cnt(['open'])),
            vcls: 'tile-v',
            sub: soonOpen.length ? soonOpen.length + ' closing within the hour' : 'Taking sealed bids',
            go: filterGo('open'),
        },
        {
            label: 'Awaiting award',
            value: String(cnt(['closed'])),
            vcls: 'tile-v',
            sub: 'Bidding has closed',
            go: filterGo('closed'),
        },
        {
            label: 'In progress',
            value: String(cnt(['awarded', 'progress', 'review'])),
            vcls: 'tile-v',
            sub: cnt(['review']) + ' waiting for your review',
            go: filterGo('all'),
        },
        {
            label: 'Completed',
            value: String(cnt(['completed'])),
            vcls: 'tile-v',
            sub: 'This year',
            go: filterGo('completed'),
        },
        {
            label: 'Payouts · 30 days',
            value: money(monthPaid),
            vcls: 'tile-v tile-vs',
            sub: money(dueSum) + ' due',
            go: () => go('a-payments'),
        },
    ];
    const needs = [];
    projects
        .filter((p) => p.status === 'closed')
        .forEach((p) => {
        const r = rankBids(p, designers, 'live');
        needs.push({
            title: `Award “${p.title}”`,
            sub: p.bids.length +
                ' bids · ' +
                (r.tie
                    ? 'tie at the lowest eligible amount'
                    : r.lowest
                        ? 'lowest eligible ' + money(r.lowest.amount)
                        : 'no eligible bids'),
            cta: 'Review bids',
            go: () => openProject(p.id, 'bids'),
        });
    });
    projects
        .filter((p) => p.status === 'review')
        .forEach((p) => {
        const v = p.deliveries[p.deliveries.length - 1];
        if (v) {
            needs.push({
                title: `Review “${p.title}”`,
                sub: 'Version ' + v.v + ' submitted ' + ago(v.at, now).toLowerCase(),
                cta: 'Review',
                go: () => openProject(p.id, 'delivery'),
            });
        }
    });
    soonOpen.forEach((p) => needs.push({
        title: `“${p.title}” closes soon`,
        sub: 'Closes in ' + cdown(p.closes, now).text,
        cta: 'View',
        go: () => openProject(p.id, 'overview'),
    }));
    duePay.slice(0, 2).forEach((x) => {
        const pp = x.p ? projects.find((p) => p.id === x.p) : null;
        const d = designers.find((des) => des.id === x.d);
        needs.push({
            title: 'Pay ' + (d ? d.name : 'Designer'),
            sub: x.type + ' · ' + money(x.amount) + ' · ' + (pp ? pp.title : x.pt || ''),
            cta: 'Payments',
            go: () => go('a-payments', { payF: 'due' }),
        });
    });
    const recent = [];
    projects.forEach((p) => p.activity.forEach((a) => recent.push({ at: a.at, title: p.title, code: p.code.slice(-2), text: a.text })));
    recent.sort((a, b) => b.at - a.at);
    return (<>
      <header className="row between top">
        <div className="col gap8">
          <span className="eyebrow">{todayText}</span>
          <h1 className="h1">Good morning, team.</h1>
        </div>
        <button type="button" className="btn btn-p" onClick={() => go('a-create', { editingId: null })}>
          <PlusIcon size={18}/>
          New project
        </button>
      </header>

      <div className="g g5">
        {tiles.map((t) => (<button key={t.label} type="button" className="tile" onClick={t.go}>
            <span className="eyebrow">{t.label}</span>
            <span className={t.vcls}>{t.value}</span>
            <span className="help">{t.sub}</span>
          </button>))}
      </div>

      <div className="split2">
        <section className="card col">
          <div className="sec-h" style={{ paddingBottom: '12px' }}>
            <h2 className="h3">Needs your action</h2>
            <span className="help">
              {needs.length ? needs.length + (needs.length === 1 ? ' item' : ' items') : ''}
            </span>
          </div>
          {needs.slice(0, 5).map((n, i) => (<div key={i} className="li">
              <div className="col gap4 grow">
                <span className="w600">{n.title}</span>
                <span className="help">{n.sub}</span>
              </div>
              <button type="button" className="btn btn-s" onClick={n.go}>
                {n.cta}
              </button>
            </div>))}
          {needs.length === 0 && (<div className="li">
              <span className="help">You're all caught up. Nothing needs you right now.</span>
            </div>)}
        </section>

        <section className="card col">
          <div className="sec-h" style={{ paddingBottom: '12px' }}>
            <h2 className="h3">Recent activity</h2>
          </div>
          {recent.slice(0, 6).map((a, i) => (<div key={i} className="li top" style={{ justifyContent: 'flex-start' }}>
              <span className="av av-s av-o">{a.code}</span>
              <div className="col gap4 grow">
                <span style={{ fontSize: '14px' }}>
                  <b>{a.title}</b> · {a.text}
                </span>
                <span className="help">{ago(a.at, now)}</span>
              </div>
            </div>))}
        </section>
      </div>
    </>);
};

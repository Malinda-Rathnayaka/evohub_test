import React from 'react';
import { useHub } from '../../context/HubContext';
import { LockIcon, ClockIcon } from '../common/Icons';
import { FDAYS, FMONS, money, cdown, fdate, first, ST, D } from '../../utils/formatters';
export const DesignerHome = () => {
    const { projects, payments, designers, meId, now, openBrief, openWork, go, } = useHub();
    const me = designers.find((d) => d.id === meId) || designers[0];
    const meFirst = first(me.name);
    const tnow = new Date(now);
    const hour = tnow.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const todayText = `${FDAYS[tnow.getDay()]} ${tnow.getDate()} ${FMONS[tnow.getMonth()]}`;
    const myPays = payments.filter((x) => x.d === meId);
    const receivedF = money(myPays.filter((x) => x.status === 'paid').reduce((a, x) => a + x.amount, 0));
    const dueF = money(myPays.filter((x) => x.status === 'due').reduce((a, x) => a + x.amount, 0));
    const visible = (pp) => pp.visibility === 'All designers' || (pp.visibleTo || []).includes(meId);
    const openList = projects
        .filter((pp) => pp.status === 'open' && visible(pp))
        .sort((a, b) => a.closes - b.closes);
    const openCards = openList.map((pp) => {
        const c = cdown(pp.closes, now);
        const hasBid = pp.bids.some((b) => b.d === meId);
        return {
            id: pp.id,
            title: pp.title,
            category: pp.category,
            maxF: money(pp.max),
            days: pp.days + ' days',
            cd: c.text,
            soon: c.soon,
            cdLabel: c.soon ? 'Closing soon' : 'Closes in',
            cdCls: c.soon ? 'cdbox cdbox-soon' : 'cdbox',
            hasBid: hasBid,
            cta: hasBid ? 'View your bid' : 'View brief and bid',
        };
    });
    const mine = projects.filter((pp) => pp.awardedTo === meId);
    const dueOf = (pp) => (pp.award ? pp.award.at + pp.days * D : now);
    const myActive = mine
        .filter((pp) => ['awarded', 'progress', 'review'].includes(pp.status))
        .map((pp) => ({
        id: pp.id,
        title: pp.title,
        code: pp.code,
        statusLabel: ST[pp.status][0],
        statusCls: ST[pp.status][1],
        dueF: fdate(dueOf(pp)),
    }));
    return (<>
      <header className="col gap8">
        <span className="eyebrow">{todayText}</span>
        <h1 className="h1">
          {greeting}, {meFirst}.
        </h1>
        <p className="help row gap8">
          <LockIcon size={16}/>
          Every bid is sealed. Only EVO ART sees your amount.
        </p>
      </header>

      <div className="g g3">
        <button type="button" className="tile" onClick={() => go('d-earnings')}>
          <span className="eyebrow">Received</span>
          <span className="tile-v tile-vs">{receivedF}</span>
          <span className="help">All time</span>
        </button>
        <button type="button" className="tile" onClick={() => go('d-earnings')}>
          <span className="eyebrow">Balance due</span>
          <span className="tile-v tile-vs">{dueF}</span>
          <span className="help">Paid after approval</span>
        </button>
        <button type="button" className="tile" onClick={() => go('d-projects')}>
          <span className="eyebrow">Active projects</span>
          <span className="tile-v">{myActive.length}</span>
          <span className="help">Limit {me.limit} at a time</span>
        </button>
      </div>

      <section className="col gap16">
        <div className="sec-h">
          <h2 className="h2">Open for bidding</h2>
          <span className="help">Closest deadline first</span>
        </div>

        {openCards.length > 0 ? (<div className="g g3">
            {openCards.map((c) => (<article key={c.id} className="ocard">
                <div className="row between">
                  <span className="eyebrow">{c.category}</span>
                  {c.hasBid && (<span className="bdg b-out">
                      <LockIcon size={12}/>
                      Bid placed
                    </span>)}
                </div>
                <h3 className="h3">{c.title}</h3>
                <dl className="dl">
                  <div>
                    <dt>Maximum bid</dt>
                    <dd className="num">{c.maxF}</dd>
                  </div>
                  <div>
                    <dt>Delivery</dt>
                    <dd>{c.days}</dd>
                  </div>
                </dl>
                <div className={c.cdCls}>
                  <span className="cd-l">
                    {c.soon && <span className="blink"/>}
                    {c.cdLabel}
                  </span>
                  <span className="cd-t">{c.cd}</span>
                </div>
                <button type="button" className="btn btn-block" onClick={() => openBrief(c.id)}>
                  {c.cta}
                </button>
              </article>))}
          </div>) : (<div className="empty">
            <div className="empty-ic">
              <ClockIcon size={24}/>
            </div>
            <h2 className="h3">No projects open right now</h2>
            <p className="help">We'll email you when EVO ART posts a new project.</p>
          </div>)}
      </section>

      <section className="col gap16">
        <div className="sec-h">
          <h2 className="h2">My active projects</h2>
          <button type="button" className="link" onClick={() => go('d-projects')}>
            See all
          </button>
        </div>

        {myActive.length > 0 ? (<div className="col gap12">
            {myActive.map((a) => (<div key={a.id} className="mcard" style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}>
                <div className="col gap4">
                  <div className="row gap8">
                    <span className={a.statusCls}>{a.statusLabel}</span>
                    <span className="help">{a.code}</span>
                  </div>
                  <span className="h3">{a.title}</span>
                  <span className="help">Due {a.dueF}</span>
                </div>
                <button type="button" className="btn" onClick={() => openWork(a.id)}>
                  Open workspace
                </button>
              </div>))}
          </div>) : (<div className="panel help">No active projects yet. Projects you win appear here.</div>)}
      </section>
    </>);
};

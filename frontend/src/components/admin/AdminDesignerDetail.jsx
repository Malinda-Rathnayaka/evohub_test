import React from 'react';
import { useHub } from '../../context/HubContext';
import { ChevronLeftIcon, PlusIcon, MinusIcon } from '../common/Icons';
import { money, fdate } from '../../utils/formatters';
export const AdminDesignerDetail = () => {
    const { did, designers, projects, toggleDesignerActive, adjustDesignerLimit, resetDesignerPw, go, } = useHub();
    const dx = designers.find((d) => d.id === did) || designers[0];
    const history = [];
    projects.forEach((pp) => pp.bids.forEach((b) => {
        if (b.d === dx.id) {
            const won = pp.awardedTo === dx.id;
            const res = won
                ? ['Won', 'bdg b-fill']
                : pp.status === 'open'
                    ? ['Sealed', 'bdg b-out']
                    : pp.status === 'closed'
                        ? ['Pending', 'bdg b-grey']
                        : ['Not selected', 'bdg b-dash'];
            history.push({
                title: pp.title,
                atF: fdate(b.at),
                amountF: money(b.amount),
                result: res[0],
                cls: res[1],
                at: b.at,
            });
        }
    }));
    history.sort((a, b) => b.at - a.at);
    return (<>
      <button type="button" className="back" onClick={() => go('a-designers')}>
        <ChevronLeftIcon size={18}/>
        All designers
      </button>

      <header className="row between top">
        <div className="who gap16">
          <span className="av av-l">{dx.ini}</span>
          <div className="col gap6">
            <div className="row gap8">
              <h1 className="h1">{dx.name}</h1>
              <span className={dx.active ? 'bdg b-out' : 'bdg b-dash'}>
                {dx.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <span className="help">
              {dx.email} · {dx.phone} · Joined {dx.joined}
            </span>
          </div>
        </div>
        <button type="button" className="btn" onClick={() => toggleDesignerActive(dx.id)}>
          {dx.active ? 'Deactivate' : 'Reactivate'}
        </button>
      </header>

      <div className="g g4">
        <div className="stat">
          <span className="eyebrow">Rating</span>
          <span className="stat-v">{dx.rating.toFixed(1)}</span>
        </div>
        <div className="stat">
          <span className="eyebrow">Bids placed</span>
          <span className="stat-v">{dx.bids}</span>
        </div>
        <div className="stat">
          <span className="eyebrow">Projects won</span>
          <span className="stat-v">{dx.won}</span>
        </div>
        <div className="stat">
          <span className="eyebrow">Earnings</span>
          <span className="stat-v">{money(dx.earned)}</span>
        </div>
      </div>

      <div className="split">
        <section className="col gap12">
          <h2 className="h3">Bid history</h2>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Placed</th>
                  <th className="r">Bid</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (<tr key={i}>
                    <td>
                      <span className="w600">{h.title}</span>
                    </td>
                    <td>{h.atF}</td>
                    <td className="amt">{h.amountF}</td>
                    <td>
                      <span className={h.cls}>{h.result}</span>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card col gap20">
          <h2 className="h3">Settings</h2>

          <div className="field">
            <span className="lbl">Skills</span>
            <div className="row gap8">
              {dx.skills.map((k) => (<span key={k} className="chip">
                  {k}
                </span>))}
            </div>
          </div>

          <div className="field">
            <span className="lbl">Concurrent project limit</span>
            <div className="row gap12">
              <div className="stepper">
                <button type="button" className="icon-btn" aria-label="Lower limit" onClick={() => adjustDesignerLimit(dx.id, -1)}>
                  <MinusIcon size={18}/>
                </button>
                <span>{dx.limit}</span>
                <button type="button" className="icon-btn" aria-label="Raise limit" onClick={() => adjustDesignerLimit(dx.id, 1)}>
                  <PlusIcon size={18}/>
                </button>
              </div>
              <span className="help">Currently on {dx.load} {dx.load === 1 ? 'project' : 'projects'}</span>
            </div>
          </div>

          <div className="field">
            <span className="lbl">Portfolio</span>
            {dx.portfolio ? (<a href={'https://' + dx.portfolio} target="_blank" rel="noopener noreferrer">
                {dx.portfolio}
              </a>) : (<span>—</span>)}
          </div>

          <div className="field">
            <span className="lbl">Login</span>
            <div className="row gap8">
              <button type="button" className="btn btn-s" onClick={() => resetDesignerPw(dx.email)}>
                Send new temporary password
              </button>
            </div>
          </div>
        </section>
      </div>
    </>);
};

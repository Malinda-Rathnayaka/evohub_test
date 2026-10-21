import React from 'react';
import { useHub } from '../../context/HubContext';
import { ST, money, fdate, D } from '../../utils/formatters';
export const DesignerProjects = () => {
    const { projects, meId, now, openWork } = useHub();
    const mine = projects.filter((pp) => pp.awardedTo === meId);
    const dueOf = (pp) => (pp.award ? pp.award.at + pp.days * D : now);
    const myProjects = mine.map((pp) => ({
        id: pp.id,
        title: pp.title,
        code: pp.code,
        statusLabel: ST[pp.status][0],
        statusCls: ST[pp.status][1],
        awardF: pp.award ? money(pp.award.amount) : '—',
        dueF: pp.status === 'completed' ? 'Delivered' : fdate(dueOf(pp)),
    }));
    return (<>
      <header className="col gap8">
        <span className="eyebrow">My projects</span>
        <h1 className="h1">Projects you've won</h1>
      </header>

      {myProjects.length > 0 ? (<div className="g g2">
          {myProjects.map((a) => (<article key={a.id} className="ocard">
              <div className="row between">
                <span className={a.statusCls}>{a.statusLabel}</span>
                <span className="help">{a.code}</span>
              </div>
              <h2 className="h3">{a.title}</h2>
              <dl className="dl">
                <div>
                  <dt>Award</dt>
                  <dd className="num">{a.awardF}</dd>
                </div>
                <div>
                  <dt>Due</dt>
                  <dd>{a.dueF}</dd>
                </div>
              </dl>
              <button type="button" className="btn btn-block" onClick={() => openWork(a.id)}>
                Open workspace
              </button>
            </article>))}
        </div>) : (<div className="panel help">
          No projects won yet. Projects awarded to you will appear here.
        </div>)}
    </>);
};

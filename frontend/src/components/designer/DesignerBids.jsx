import React from 'react';
import { useHub } from '../../context/HubContext';
import { money, fdate, fshort, cdown } from '../../utils/formatters';
export const DesignerBids = () => {
    const { projects, meId, now, openBrief, openWork, go } = useHub();
    const myBids = [];
    projects.forEach((pp) => {
        const b = pp.bids.find((x) => x.d === meId);
        if (!b)
            return;
        const won = pp.awardedTo === meId;
        const c = cdown(pp.closes, now);
        const stt = pp.status === 'open'
            ? ['Sealed', 'bdg b-out', 'Editable until it closes · ' + c.text + ' left']
            : pp.status === 'closed'
                ? ['Awaiting decision', 'bdg b-grey b-dot', 'Bidding closed ' + fshort(pp.closes)]
                : won
                    ? ['Won', 'bdg b-fill', 'Awarded ' + fshort(pp.award ? pp.award.at : pp.closes)]
                    : ['Not selected', 'bdg b-dash', 'Went to another designer'];
        myBids.push({
            id: pp.id,
            title: pp.title,
            code: pp.code,
            category: pp.category,
            amountF: money(b.amount),
            days: b.days + ' days',
            atF: fdate(b.at),
            statusLabel: stt[0],
            cls: stt[1],
            info: stt[2],
            at: b.at,
            won: won,
            status: pp.status,
        });
    });
    myBids.sort((a, b) => b.at - a.at);
    const handleOpen = (b) => {
        if (b.won && b.status !== 'awarded') {
            openWork(b.id);
        }
        else {
            openBrief(b.id);
        }
    };
    return (<>
      <header className="col gap8">
        <span className="eyebrow">My bids</span>
        <h1 className="h1">Bids you've placed</h1>
        <p className="help">Only you and EVO ART can see these amounts.</p>
      </header>

      {myBids.length > 0 ? (<>
          <div className="tbl-wrap only-d">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Project</th>
                  <th className="r">Your bid</th>
                  <th>Delivery</th>
                  <th>Placed</th>
                  <th>Status</th>
                  <th>Info</th>
                  <th>
                    <span className="sr">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {myBids.map((b) => (<tr key={b.id} className="tr-click" onClick={() => handleOpen(b)}>
                    <td>
                      <div className="col">
                        <span className="w600">{b.title}</span>
                        <span className="help">
                          {b.code} · {b.category}
                        </span>
                      </div>
                    </td>
                    <td className="amt">{b.amountF}</td>
                    <td>{b.days}</td>
                    <td>{b.atF}</td>
                    <td>
                      <span className={b.cls}>{b.statusLabel}</span>
                    </td>
                    <td className="help">{b.info}</td>
                    <td className="r">
                      <button type="button" className="btn btn-s" onClick={(e) => {
                    e.stopPropagation();
                    handleOpen(b);
                }}>
                        View
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <div className="only-m mlist">
            {myBids.map((b) => (<div key={b.id} className="mcard">
                <div className="row between">
                  <span className={b.cls}>{b.statusLabel}</span>
                  <span className="help">{b.code}</span>
                </div>
                <span className="h3">{b.title}</span>
                <div className="row between">
                  <span className="w600 num">{b.amountF}</span>
                  <span className="help">{b.days}</span>
                </div>
                <span className="help">{b.info}</span>
                <button type="button" className="btn btn-block" onClick={() => handleOpen(b)}>
                  View
                </button>
              </div>))}
          </div>
        </>) : (<div className="empty">
          <h2 className="h3">No bids yet</h2>
          <p className="help">Open a project from Home to place your first sealed bid.</p>
          <button type="button" className="btn btn-p" onClick={() => go('d-home')}>
            See open projects
          </button>
        </div>)}
    </>);
};

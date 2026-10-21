import React from 'react';
import { useHub } from '../../context/HubContext';
import { money, fdate, D } from '../../utils/formatters';
export const AdminPayments = () => {
    const { payments, projects, designers, payF, setPayF, markPaid, now, } = useHub();
    const monthPaid = payments
        .filter((x) => x.status === 'paid' && x.at && x.at > now - 30 * D)
        .reduce((a, x) => a + x.amount, 0);
    const dueSum = payments
        .filter((x) => x.status === 'due')
        .reduce((a, x) => a + x.amount, 0);
    const allPaid = payments
        .filter((x) => x.status === 'paid')
        .reduce((a, x) => a + x.amount, 0);
    const payRows = payments
        .filter((x) => payF === 'all' || x.status === payF)
        .slice()
        .sort((a, b) => (a.status === 'due' ? 0 : 1) - (b.status === 'due' ? 0 : 1) ||
        (b.at || 0) - (a.at || 0))
        .map((x) => {
        const pp = x.p ? projects.find((p) => p.id === x.p) : null;
        const d = designers.find((des) => des.id === x.d);
        return {
            id: x.id,
            project: pp ? pp.title : x.pt || '',
            designer: d ? d.name : 'Unknown',
            type: x.type,
            amountF: money(x.amount),
            dateText: x.at ? fdate(x.at) : 'Not paid yet',
            statusLabel: x.status === 'paid' ? 'Paid' : 'Due',
            statusCls: x.status === 'paid' ? 'bdg b-fill' : 'bdg b-dash',
            isDue: x.status === 'due',
        };
    });
    const payOpts = [
        { id: 'all', label: 'All' },
        { id: 'paid', label: 'Paid' },
        { id: 'due', label: 'Due' },
    ];
    return (<>
      <header className="col gap8">
        <span className="eyebrow">Payments</span>
        <h1 className="h1">All payments</h1>
      </header>

      <div className="g g3">
        <div className="stat">
          <span className="eyebrow">Paid this month</span>
          <span className="stat-v">{money(monthPaid)}</span>
        </div>
        <div className="stat">
          <span className="eyebrow">Due to designers</span>
          <span className="stat-v">{money(dueSum)}</span>
        </div>
        <div className="stat">
          <span className="eyebrow">Paid all time</span>
          <span className="stat-v">{money(allPaid)}</span>
        </div>
      </div>

      <div className="seg" role="group" aria-label="Filter payments" style={{ alignSelf: 'flex-start' }}>
        {payOpts.map((o) => (<button key={o.id} type="button" className={payF === o.id ? 'on' : ''} aria-pressed={payF === o.id} onClick={() => setPayF(o.id)}>
            {o.label}
          </button>))}
      </div>

      <div className="tbl-wrap only-d">
        <table className="tbl">
          <thead>
            <tr>
              <th>Payment</th>
              <th>Project</th>
              <th>Designer</th>
              <th>Type</th>
              <th>Date</th>
              <th className="r">Amount</th>
              <th>Status</th>
              <th>
                <span className="sr">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {payRows.map((x) => (<tr key={x.id}>
                <td className="mono" style={{ fontSize: '13px' }}>
                  {x.id}
                </td>
                <td className="w600">{x.project}</td>
                <td>{x.designer}</td>
                <td>{x.type}</td>
                <td>{x.dateText}</td>
                <td className="amt">{x.amountF}</td>
                <td>
                  <span className={x.statusCls}>{x.statusLabel}</span>
                </td>
                <td className="r">
                  {x.isDue && (<button type="button" className="btn btn-s" onClick={() => markPaid(x.id)}>
                      Mark as paid
                    </button>)}
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      <div className="only-m mlist">
        {payRows.map((x) => (<div key={x.id} className="mcard">
            <div className="row between">
              <span className={x.statusCls}>{x.statusLabel}</span>
              <span className="help mono">{x.id}</span>
            </div>
            <div className="col gap4">
              <span className="w600">{x.project}</span>
              <span className="help">
                {x.designer} · {x.type}
              </span>
            </div>
            <div className="row between">
              <span className="w600 num">{x.amountF}</span>
              <span className="help">{x.dateText}</span>
            </div>
            {x.isDue && (<button type="button" className="btn btn-block" onClick={() => markPaid(x.id)}>
                Mark as paid
              </button>)}
          </div>))}
      </div>
    </>);
};

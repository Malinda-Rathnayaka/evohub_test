import React from 'react';
import { useHub } from '../../context/HubContext';
import { money, fdate, ST, D } from '../../utils/formatters';
export const DesignerEarnings = () => {
    const { projects, payments, meId, now } = useHub();
    const myPays = payments.filter((x) => x.d === meId);
    const mine = projects.filter((pp) => pp.awardedTo === meId);
    const receivedF = money(myPays.filter((x) => x.status === 'paid').reduce((a, x) => a + x.amount, 0));
    const dueF = money(myPays.filter((x) => x.status === 'due').reduce((a, x) => a + x.amount, 0));
    const monthF = money(myPays
        .filter((x) => x.status === 'paid' && x.at && x.at > now - 30 * D)
        .reduce((a, x) => a + x.amount, 0));
    const perProject = mine.map((pp) => {
        const ps = myPays.filter((x) => x.p === pp.id);
        return {
            title: pp.title,
            statusLabel: ST[pp.status][0],
            statusCls: ST[pp.status][1],
            awardF: money(pp.award?.amount),
            paidF: money(ps.filter((x) => x.status === 'paid').reduce((a, x) => a + x.amount, 0)),
            dueF: money(ps.filter((x) => x.status === 'due').reduce((a, x) => a + x.amount, 0)),
        };
    });
    const payRows = myPays
        .slice()
        .sort((a, b) => (b.at || now + 1) - (a.at || now + 1))
        .map((x) => {
        const pp = x.p ? projects.find((p) => p.id === x.p) : null;
        return {
            id: x.id,
            project: pp ? pp.title : x.pt || '',
            type: x.type,
            ref: x.ref || '—',
            amountF: money(x.amount),
            dateText: x.at ? fdate(x.at) : 'Not paid yet',
            statusLabel: x.status === 'paid' ? 'Paid' : 'Due',
            statusCls: x.status === 'paid' ? 'bdg b-fill' : 'bdg b-dash',
        };
    });
    return (<>
      <header className="col gap8">
        <span className="eyebrow">Earnings</span>
        <h1 className="h1">Your earnings</h1>
      </header>

      <div className="g g3">
        <div className="stat">
          <span className="eyebrow">Received</span>
          <span className="stat-v">{receivedF}</span>
          <span className="help">All time</span>
        </div>
        <div className="stat">
          <span className="eyebrow">Balance due</span>
          <span className="stat-v">{dueF}</span>
          <span className="help">Paid within 7 days of each milestone</span>
        </div>
        <div className="stat">
          <span className="eyebrow">This month</span>
          <span className="stat-v">{monthF}</span>
          <span className="help">Received in the last 30 days</span>
        </div>
      </div>

      <section className="col gap12">
        <h2 className="h3">By project</h2>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th className="r">Award</th>
                <th className="r">Paid</th>
                <th className="r">Due</th>
              </tr>
            </thead>
            <tbody>
              {perProject.map((x, i) => (<tr key={i}>
                  <td className="w600">{x.title}</td>
                  <td>
                    <span className={x.statusCls}>{x.statusLabel}</span>
                  </td>
                  <td className="amt">{x.awardF}</td>
                  <td className="amt">{x.paidF}</td>
                  <td className="amt">{x.dueF}</td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="col gap12">
        <h2 className="h3">Payments</h2>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Date</th>
                <th>Project</th>
                <th>Type</th>
                <th>Reference</th>
                <th className="r">Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payRows.map((x) => (<tr key={x.id}>
                  <td>{x.dateText}</td>
                  <td className="w600">{x.project}</td>
                  <td>{x.type}</td>
                  <td className="mono" style={{ fontSize: '13px' }}>
                    {x.ref}
                  </td>
                  <td className="amt">{x.amountF}</td>
                  <td>
                    <span className={x.statusCls}>{x.statusLabel}</span>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </section>
    </>);
};

import React from 'react';
import { useHub } from '../../context/HubContext';
import { PlusIcon } from '../common/Icons';
import { money } from '../../utils/formatters';
export const AdminDesignersList = () => {
    const { designers, go } = useHub();
    const handleOpen = (did) => {
        go('a-designer', { did });
    };
    return (<>
      <header className="row between top">
        <div className="col gap8">
          <span className="eyebrow">Designers</span>
          <h1 className="h1">Interviewed designers</h1>
          <p className="help">Only designers you add here can sign in. There is no public sign-up.</p>
        </div>
        <button type="button" className="btn btn-p" onClick={() => go('a-add', { ndDone: false })}>
          <PlusIcon size={18}/>
          Add designer
        </button>
      </header>

      <div className="tbl-wrap only-d">
        <table className="tbl">
          <thead>
            <tr>
              <th>Designer</th>
              <th>Skills</th>
              <th>Rating</th>
              <th>Workload</th>
              <th>Status</th>
              <th className="r">Earnings</th>
              <th>
                <span className="sr">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {designers.map((d) => (<tr key={d.id} className="tr-click" onClick={() => handleOpen(d.id)}>
                <td>
                  <div className="who">
                    <span className="av av-s">{d.ini}</span>
                    <div className="col">
                      <span className="w600">{d.name}</span>
                      <span className="help">{d.email}</span>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '13px' }}>{d.skills.join(', ')}</td>
                <td className="num w600">{d.rating.toFixed(1)}</td>
                <td className="num">
                  {d.load} / {d.limit}
                </td>
                <td>
                  <span className={d.active ? 'bdg b-out' : 'bdg b-dash'}>
                    {d.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="amt">{money(d.earned)}</td>
                <td className="r">
                  <button type="button" className="btn btn-s" onClick={(e) => {
                e.stopPropagation();
                handleOpen(d.id);
            }}>
                    View
                  </button>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      <div className="only-m mlist">
        {designers.map((d) => (<div key={d.id} className="mcard">
            <div className="row between">
              <div className="who">
                <span className="av av-s">{d.ini}</span>
                <div className="col">
                  <span className="w600">{d.name}</span>
                  <span className="help">
                    Rating {d.rating.toFixed(1)} · Load {d.load} / {d.limit}
                  </span>
                </div>
              </div>
              <span className={d.active ? 'bdg b-out' : 'bdg b-dash'}>
                {d.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <span className="help">{d.skills.join(', ')}</span>
            <button type="button" className="btn btn-block" onClick={() => handleOpen(d.id)}>
              View designer
            </button>
          </div>))}
      </div>
    </>);
};

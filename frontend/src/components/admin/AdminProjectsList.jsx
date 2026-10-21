import React from 'react';
import { useHub } from '../../context/HubContext';
import { PlusIcon, SearchIcon } from '../common/Icons';
import { ST, money, cdown, fshort } from '../../utils/formatters';
export const AdminProjectsList = () => {
    const { projects, now, pf, setPf, clearFilters, openProject, go, } = useHub();
    const order = {
        closed: 0,
        open: 1,
        review: 2,
        awarded: 3,
        progress: 4,
        draft: 5,
        completed: 6,
    };
    const q = pf.q.trim().toLowerCase();
    const rowsRaw = projects
        .filter((p) => (pf.status === 'all' || p.status === pf.status) &&
        (pf.cat === 'all' || p.category === pf.cat) &&
        (!q ||
            (p.title + ' ' + p.code + ' ' + p.client + ' ' + p.category)
                .toLowerCase()
                .indexOf(q) >= 0))
        .sort((a, b) => (order[a.status] - order[b.status]) || a.closes - b.closes);
    const rows = rowsRaw.map((p) => {
        const c = cdown(p.closes, now);
        const soon = p.status === 'open' && c.soon;
        return {
            id: p.id,
            code: p.code,
            title: p.title,
            client: p.client,
            category: p.category,
            statusLabel: ST[p.status][0],
            statusCls: ST[p.status][1],
            maxF: money(p.max),
            bidsText: p.status === 'draft'
                ? '—'
                : p.bids.length + (p.status === 'open' ? ' sealed' : ' bids'),
            soon: soon,
            notSoon: !soon,
            closeText: p.status === 'open'
                ? c.text
                : p.status === 'draft'
                    ? 'Opens ' + fshort(p.opens)
                    : 'Closed ' + fshort(p.closes),
        };
    });
    const rowsText = rows.length + (rows.length === 1 ? ' project' : ' projects');
    return (<>
      <header className="row between top">
        <div className="col gap8">
          <span className="eyebrow">Projects</span>
          <h1 className="h1">All projects</h1>
        </div>
        <button type="button" className="btn btn-p" onClick={() => go('a-create', { editingId: null })}>
          <PlusIcon size={18}/>
          New project
        </button>
      </header>

      <div className="filters">
        <label className="field fgrow">
          <span className="lbl">Search</span>
          <span className="ico-in">
            <SearchIcon size={18}/>
            <input className="inp" type="search" placeholder="Title, code or client" value={pf.q} onChange={(e) => setPf((prev) => ({ ...prev, q: e.target.value }))}/>
          </span>
        </label>
        <label className="field">
          <span className="lbl">Status</span>
          <select className="inp" value={pf.status} onChange={(e) => setPf((prev) => ({ ...prev, status: e.target.value }))}>
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="awarded">Awarded</option>
            <option value="progress">In progress</option>
            <option value="review">In review</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label className="field">
          <span className="lbl">Category</span>
          <select className="inp" value={pf.cat} onChange={(e) => setPf((prev) => ({ ...prev, cat: e.target.value }))}>
            <option value="all">All categories</option>
            <option value="Branding">Branding</option>
            <option value="Packaging">Packaging</option>
            <option value="Print">Print</option>
            <option value="Social media">Social media</option>
            <option value="UI/UX">UI/UX</option>
          </select>
        </label>
      </div>

      <span className="help">{rowsText}</span>

      {rows.length > 0 ? (<>
          <div className="tbl-wrap only-d">
            <table className="tbl">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th className="r">Max bid</th>
                  <th>Bids</th>
                  <th>Bid close</th>
                  <th>
                    <span className="sr">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (<tr key={r.id} className="tr-click" onClick={() => openProject(r.id)}>
                    <td>
                      <div className="col">
                        <span className="w600">{r.title}</span>
                        <span className="help">
                          {r.code} · {r.client}
                        </span>
                      </div>
                    </td>
                    <td>{r.category}</td>
                    <td>
                      <span className={r.statusCls}>{r.statusLabel}</span>
                    </td>
                    <td className="amt">{r.maxF}</td>
                    <td className="num">{r.bidsText}</td>
                    <td>
                      {r.soon ? (<span className="cdchip cdchip-soon">
                          <span className="blink"/>
                          Closing soon · {r.closeText}
                        </span>) : (<span className="num">{r.closeText}</span>)}
                    </td>
                    <td className="r">
                      <button type="button" className="btn btn-s" onClick={(e) => {
                    e.stopPropagation();
                    openProject(r.id);
                }}>
                        Open
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <div className="only-m mlist">
            {rows.map((r) => (<div key={r.id} className="mcard">
                <div className="row between">
                  <span className={r.statusCls}>{r.statusLabel}</span>
                  <span className="help">{r.code}</span>
                </div>
                <div className="col gap4">
                  <span className="h3">{r.title}</span>
                  <span className="help">
                    {r.category} · {r.client}
                  </span>
                </div>
                <div className="row between">
                  <span className="w600 num">{r.maxF}</span>
                  <span className="help">{r.bidsText}</span>
                </div>
                {r.soon ? (<div className="cdbox cdbox-soon">
                    <span className="cd-l">
                      <span className="blink"/>
                      Closing soon
                    </span>
                    <span className="cd-t">{r.closeText}</span>
                  </div>) : (<span className="help">Bid close: {r.closeText}</span>)}
                <button type="button" className="btn btn-block" onClick={() => openProject(r.id)}>
                  Open project
                </button>
              </div>))}
          </div>
        </>) : (<div className="empty">
          <div className="empty-ic">
            <SearchIcon size={24}/>
          </div>
          <h2 className="h3">No projects match</h2>
          <p className="help" style={{ maxWidth: '340px' }}>
            Nothing fits these filters. Try another status or category, or clear the search.
          </p>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button type="button" className="btn" onClick={clearFilters}>
              Clear filters
            </button>
            <button type="button" className="btn btn-p" onClick={() => go('a-create', { editingId: null })}>
              New project
            </button>
          </div>
        </div>)}
    </>);
};

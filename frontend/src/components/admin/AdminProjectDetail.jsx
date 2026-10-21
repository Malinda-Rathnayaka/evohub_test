import React from 'react';
import { useHub } from '../../context/HubContext';
import { ChevronLeftIcon, ClockIcon, FileIcon, DownloadIcon, LockIcon, CheckIcon, TieIcon, ErrorCircleIcon, EmptyBoxIcon, DeliveryPreviewSvg, UploadIcon, } from '../common/Icons';
import { StatusTimeline } from '../common/StatusTimeline';
import { ST, money, cdown, fdt, fdate, first, VCLS, AWARDED, D, } from '../../utils/formatters';
import { rankBids } from '../../utils/bidRanking';
export const AdminProjectDetail = () => {
    const { pid, projects, designers, payments, tab, setTab, now, bidsPreview, setBidsPreview, ver, setVer, fileIdx, setFileIdx, comment, setComment, sendComment, endBidding, reopen, editProject, openAwardModal, openAwardOtherModal, openApproveModal, openRevisionModal, markPaid, setProjects, toastMsg, go, } = useHub();
    const p = projects.find((x) => x.id === pid) || projects[0];
    const pc = cdown(p.closes, now);
    const winner = p.awardedTo ? designers.find((d) => d.id === p.awardedTo) : null;
    const pPays = payments.filter((x) => x.p === p.id);
    const tabs = [
        { id: 'overview', label: 'Overview' },
        {
            id: 'bids',
            label: 'Bids' + (p.status !== 'draft' ? ` (${p.bids.length})` : ''),
        },
        { id: 'delivery', label: 'Delivery' },
        { id: 'payments', label: 'Payments' },
        { id: 'activity', label: 'Activity' },
    ];
    const rk = rankBids(p, designers, bidsPreview);
    const stageAwarded = AWARDED.includes(p.status);
    const isClosed = p.status === 'closed';
    const vers = p.deliveries;
    const vi = vers.length ? (ver == null ? vers.length - 1 : Math.min(ver, vers.length - 1)) : -1;
    const cv = vi >= 0 ? vers[vi] : null;
    const fi = cv ? Math.min(fileIdx, cv.files.length - 1) : 0;
    const curFile = cv ? cv.files[fi] : null;
    const handlePublishNow = () => {
        const currNow = Date.now();
        setProjects((prev) => prev.map((x) => x.id === p.id
            ? {
                ...x,
                status: 'open',
                closes: x.closes <= currNow ? currNow + 3 * D : x.closes,
                activity: [{ at: currNow, text: 'Published. Eligible designers notified.' }, ...x.activity],
            }
            : x));
        toastMsg('Project published.');
    };
    const previewOpts = [
        { id: 'live', label: 'Live data' },
        { id: 'tie', label: 'Tie' },
        { id: 'none', label: 'No bids' },
        { id: 'inelig', label: 'All ineligible' },
    ];
    return (<>
      <button type="button" className="back" onClick={() => go('a-projects')}>
        <ChevronLeftIcon size={18}/>
        All projects
      </button>

      <header className="row between top">
        <div className="col gap8">
          <div className="row gap8">
            <span className="eyebrow">
              {p.code} · {p.category}
            </span>
            <span className={ST[p.status][1]}>{ST[p.status][0]}</span>
          </div>
          <h1 className="h1">{p.title}</h1>
        </div>
        <div className="row gap8">
          {p.status === 'open' && (<>
              <span className={pc.soon ? 'cdchip cdchip-soon' : 'cdchip'}>
                <ClockIcon size={16}/>
                {pc.soon ? `Closing soon · ${pc.text}` : `Closes in ${pc.text}`}
              </span>
              <button type="button" className="btn" onClick={() => endBidding(p.id)}>
                End bidding now
              </button>
            </>)}
          {p.status === 'draft' && (<button type="button" className="btn btn-p" onClick={handlePublishNow}>
              Publish now
            </button>)}
          {(p.status === 'open' || p.status === 'draft' || p.status === 'closed') && (<button type="button" className="btn" onClick={() => editProject(p.id)}>
              Edit project
            </button>)}
        </div>
      </header>

      <section className="card" aria-label="Project status">
        <StatusTimeline status={p.status}/>
      </section>

      <div className="tabs" role="tablist" aria-label="Project sections">
        {tabs.map((t) => (<button key={t.id} type="button" role="tab" className={tab === t.id ? 'tab tab-on' : 'tab'} aria-selected={tab === t.id} onClick={() => {
                setTab(t.id);
                setVer(null);
                setFileIdx(0);
            }}>
            {t.label}
          </button>))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (<div className="split">
          <div className="col gap24">
            <section className="card col gap16">
              <h2 className="h3">Brief</h2>
              <p className="p">{p.brief}</p>
              <div className="col gap8">
                <span className="lbl">Deliverables</span>
                <ul className="ul">
                  {p.deliverables.map((x, i) => (<li key={i}>{x}</li>))}
                </ul>
              </div>
            </section>
            <section className="card col gap12">
              <h2 className="h3">Reference files</h2>
              <span className="help">Visible to every designer who can bid.</span>
              {p.refs.map((f, i) => (<div key={i} className="file">
                  <FileIcon size={18}/>
                  <span className="file-name">{f.name}</span>
                  <span className="help">{f.size}</span>
                  <button type="button" className="icon-btn" aria-label={`Download ${f.name}`}>
                    <DownloadIcon size={18}/>
                  </button>
                </div>))}
            </section>
          </div>
          <div className="col gap24">
            <section className="card col">
              <h2 className="h3" style={{ paddingBottom: '8px' }}>
                Key details
              </h2>
              <div className="kv">
                <span>Maximum bid</span>
                <b className="num">{money(p.max)}</b>
              </div>
              <div className="kv">
                <span>Bid window</span>
                <b>
                  {fdt(p.opens)} – {fdt(p.closes)}
                </b>
              </div>
              <div className="kv">
                <span>Delivery</span>
                <b>{p.days} days</b>
              </div>
              <div className="kv">
                <span>Revisions</span>
                <b>{p.revisions} {p.revisions === 1 ? 'round' : 'rounds'}</b>
              </div>
              <div className="kv">
                <span>Required skill</span>
                <b>{p.skill}</b>
              </div>
              <div className="kv">
                <span>Minimum rating</span>
                <b>{p.minRating.toFixed(1)} and above</b>
              </div>
              <div className="kv">
                <span>Visibility</span>
                <b>{p.visibility}</b>
              </div>
              <div className="kv">
                <span>Bids</span>
                <b>
                  {p.status === 'draft'
                ? 'Not open yet'
                : `${p.bids.length} ${p.bids.length === 1 ? 'bid' : 'bids'}${p.status === 'open' ? ' (sealed)' : ''}`}
                </b>
              </div>
              <div className="kv">
                <span>Awarded to</span>
                <b>{winner ? winner.name : 'Not awarded yet'}</b>
              </div>
            </section>

            <section className="panel col gap12">
              <div className="row between">
                <h2 className="h3">Client</h2>
                <span className="bdg b-dash">Hidden from designers</span>
              </div>
              <span className="w600">{p.client}</span>
              {p.clientFiles.map((f, i) => (<div key={i} className="file">
                  <LockIcon size={18}/>
                  <span className="file-name">{f.name}</span>
                  <span className="help">{f.size}</span>
                </div>))}
              <span className="help">
                {winner
                ? `Shared with ${winner.name} on award.`
                : 'Shared with the winning designer when you award.'}
              </span>
            </section>
          </div>
        </div>)}

      {/* BIDS TAB */}
      {tab === 'bids' && (<>
          {(p.status === 'open' || p.status === 'draft') ? (<div className="empty">
              <div className="empty-ic">
                <LockIcon size={24}/>
              </div>
              <h2 className="h3">Bids stay sealed until bidding closes</h2>
              <p className="help" style={{ maxWidth: '420px' }}>
                {p.bids.length === 1 ? '1 sealed bid' : `${p.bids.length} sealed bids`} so far. Amounts appear here when bidding closes on {fdt(p.closes)}.
              </p>
              {p.status === 'open' && (<button type="button" className="btn" onClick={() => endBidding(p.id)}>
                  End bidding now
                </button>)}
            </div>) : (<>
              {isClosed && (<div className="row between">
                  <span className="help">Preview other states of this screen</span>
                  <div className="seg" role="group" aria-label="Preview state">
                    {previewOpts.map((o) => (<button key={o.id} type="button" className={bidsPreview === o.id ? 'on' : ''} aria-pressed={bidsPreview === o.id} onClick={() => setBidsPreview(o.id)}>
                        {o.label}
                      </button>))}
                  </div>
                </div>)}

              {stageAwarded && (<div className="banner banner-b">
                  <CheckIcon size={22} strokeWidth={2}/>
                  <div className="col gap4">
                    <span className="w600">
                      {winner ? `Awarded to ${winner.name} for ${p.award ? money(p.award.amount) : ''}` : ''}
                    </span>
                    <span className="help">
                      {p.award
                        ? `${fdate(p.award.at)} · ${p.award.reason ? 'Reason: ' + p.award.reason : 'Lowest eligible bid'}`
                        : ''}
                    </span>
                  </div>
                </div>)}

              {isClosed && rk.lowest && (<div className="decide">
                  <div className="col gap6">
                    <span className="eyebrow" style={{ color: '#000' }}>
                      Lowest eligible bid
                    </span>
                    <span className="decide-amt">{money(rk.lowest.amount)}</span>
                    <span className="w600">
                      {rk.lowest.d.name} · Rating {rk.lowest.d.rating.toFixed(1)} · {rk.lowest.b.days} days
                    </span>
                    <span className="help">
                      {money(p.max - rk.lowest.amount)} under the maximum of {money(p.max)}
                    </span>
                  </div>
                  <button type="button" className="btn btn-p btn-l" onClick={() => openAwardModal(p.id, rk.lowest.d.id)}>
                    Award to lowest eligible
                  </button>
                </div>)}

              {isClosed && rk.tie && (<div className="banner">
                  <TieIcon size={22}/>
                  <div className="col gap4">
                    <span className="w600">Tie at {money(rk.lowest?.amount)}</span>
                    <span style={{ fontSize: '14px' }}>
                      {rk.ties.map((t) => t.d.name).join(' and ')} bid the same amount. Tie-break rule: higher rating first, then the earlier bid. {first(rk.ties[0]?.d.name)} ranks first.
                    </span>
                  </div>
                </div>)}

              {isClosed && rk.rows.length > 0 && !rk.lowest && (<div className="banner">
                  <ErrorCircleIcon size={22}/>
                  <div className="col gap8 grow">
                    <span className="w600">No eligible bids</span>
                    <span style={{ fontSize: '14px' }}>
                      Every bid breaks at least one rule (rating, workload or maximum). Reopen bidding, or award to a designer anyway with a written reason.
                    </span>
                    <div className="row">
                      <button type="button" className="btn btn-s btn-p" onClick={() => reopen(p.id)}>
                        Reopen bidding for 3 days
                      </button>
                    </div>
                  </div>
                </div>)}

              {isClosed && rk.rows.length === 0 && (<div className="empty">
                  <div className="empty-ic">
                    <EmptyBoxIcon size={24}/>
                  </div>
                  <h2 className="h3">No bids came in</h2>
                  <p className="help" style={{ maxWidth: '420px' }}>
                    Bidding closed without any bids. Reopen it, raise the maximum, or invite more designers.
                  </p>
                  <div className="row" style={{ justifyContent: 'center' }}>
                    <button type="button" className="btn" onClick={() => editProject(p.id)}>
                      Edit project
                    </button>
                    <button type="button" className="btn btn-p" onClick={() => reopen(p.id)}>
                      Reopen bidding for 3 days
                    </button>
                  </div>
                </div>)}

              {rk.rows.length > 0 && (<>
                  <div className="tbl-wrap only-d">
                    <table className="tbl">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Designer</th>
                          <th>Rating</th>
                          <th>Workload</th>
                          <th>Delivery</th>
                          <th>Note</th>
                          <th className="r">Bid</th>
                          <th>Eligibility</th>
                          <th>
                            <span className="sr">Action</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rk.rows.map((x, i) => {
                        const isLowest = isClosed && rk.lowest && x === rk.lowest;
                        const isWinner = p.awardedTo === x.d.id;
                        return (<tr key={x.d.id} className={isLowest ? 'row-hl' : x.elig ? '' : 'row-x'}>
                              <td className="num w600">{i + 1}</td>
                              <td>
                                <div className="who">
                                  <span className="av av-s">{x.d.ini}</span>
                                  <div className="col">
                                    <span className="w600">{x.d.name}</span>
                                    {x.b.portfolio && (<a href={'https://' + x.b.portfolio} target="_blank" rel="noopener noreferrer" style={{ fontSize: '13px' }}>
                                        {x.b.portfolio}
                                      </a>)}
                                  </div>
                                </div>
                              </td>
                              <td className="num">{x.d.rating.toFixed(1)}</td>
                              <td className="num">
                                {x.load} / {x.d.limit}
                              </td>
                              <td className="num">{x.b.days} days</td>
                              <td className="note-cell">{x.b.note || '—'}</td>
                              <td className="amt">{money(x.amount)}</td>
                              <td>
                                <div className="col gap4">
                                  <span className={isLowest
                                ? 'bdg b-fill'
                                : x.elig
                                    ? 'bdg b-out'
                                    : 'bdg b-dash'}>
                                    {isLowest ? 'Lowest eligible' : x.elig ? 'Eligible' : 'Not eligible'}
                                  </span>
                                  <span className="help">{x.reason}</span>
                                </div>
                              </td>
                              <td className="r">
                                {isClosed && (<button type="button" className="btn btn-s" onClick={() => isLowest
                                    ? openAwardModal(p.id, x.d.id)
                                    : openAwardOtherModal(p.id, x.d.id)}>
                                    {isLowest ? 'Award' : 'Award to this designer'}
                                  </button>)}
                                {isWinner && <span className="bdg b-fill">Awarded</span>}
                              </td>
                            </tr>);
                    })}
                      </tbody>
                    </table>
                  </div>

                  <div className="only-m mlist">
                    {rk.rows.map((x, i) => {
                        const isLowest = isClosed && rk.lowest && x === rk.lowest;
                        const isWinner = p.awardedTo === x.d.id;
                        return (<div key={x.d.id} className={isLowest ? 'mcard mcard-hl' : 'mcard'}>
                          <div className="row between">
                            <div className="who">
                              <span className="av av-s">{x.d.ini}</span>
                              <div className="col">
                                <span className="w600">
                                  {i + 1}. {x.d.name}
                                </span>
                                <span className="help">
                                  Rating {x.d.rating.toFixed(1)} · Load {x.load} / {x.d.limit}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="row between">
                            <span className="big-amt" style={{ fontSize: '26px' }}>
                              {money(x.amount)}
                            </span>
                            <span className="help">{x.b.days} days</span>
                          </div>
                          <div className="col gap4">
                            <span className={isLowest
                                ? 'bdg b-fill'
                                : x.elig
                                    ? 'bdg b-out'
                                    : 'bdg b-dash'} style={{ alignSelf: 'flex-start' }}>
                              {isLowest ? 'Lowest eligible' : x.elig ? 'Eligible' : 'Not eligible'}
                            </span>
                            <span className="help">{x.reason}</span>
                          </div>
                          {x.b.note && <p style={{ fontSize: '14px' }}>{x.b.note}</p>}
                          {isClosed && (<button type="button" className="btn btn-block" onClick={() => isLowest
                                    ? openAwardModal(p.id, x.d.id)
                                    : openAwardOtherModal(p.id, x.d.id)}>
                              {isLowest ? 'Award' : 'Award to this designer'}
                            </button>)}
                          {isWinner && (<span className="bdg b-fill" style={{ alignSelf: 'flex-start' }}>
                              Awarded
                            </span>)}
                        </div>);
                    })}
                  </div>

                  <p className="help">
                    Sorted by amount. Tie-break: higher rating, then the earlier bid. Eligible means active, rating at or above {p.minRating.toFixed(1)}, under their project limit and at or below the maximum.
                  </p>
                </>)}
            </>)}
        </>)}

      {/* DELIVERY TAB */}
      {tab === 'delivery' && (<>
          {vers.length > 0 ? (<>
              <div className="row between">
                <div className="row gap12">
                  <div className="seg" role="group" aria-label="Version">
                    {vers.map((v, i) => (<button key={v.v} type="button" className={i === vi ? 'on' : ''} aria-pressed={i === vi} onClick={() => {
                        setVer(i);
                        setFileIdx(0);
                    }}>
                        Version {v.v}
                      </button>))}
                  </div>
                  {cv && (<span className={VCLS[cv.status] || 'bdg b-out'}>
                      {cv.status}
                    </span>)}
                </div>
                <div className="row gap8">
                  <span className="help">
                    {p.revUsed} of {p.revisions} revisions used
                  </span>
                  <span className="revbar" aria-hidden="true">
                    {Array.from({ length: p.revisions }).map((_, i) => (<i key={i} className={i < p.revUsed ? 'on' : ''}/>))}
                  </span>
                </div>
              </div>

              <div className="split">
                <div className="col gap16">
                  {curFile && (<div className="preview" role="img" aria-label={`Preview of ${curFile.name}`}>
                      <DeliveryPreviewSvg />
                      <div className="col" style={{ alignItems: 'center' }}>
                        <span className="w600">{curFile.name}</span>
                        <span className="help">
                          Version {cv ? cv.v : 1} · {curFile.size}
                        </span>
                      </div>
                    </div>)}

                  {cv && (<div className="g g2">
                      {cv.files.map((f, i) => (<button key={f.name} type="button" className={i === fi ? 'fbtn fbtn-on' : 'fbtn'} onClick={() => setFileIdx(i)}>
                          <FileIcon size={18}/>
                          <span className="col grow">
                            <span className="file-name">{f.name}</span>
                            <span className="help">{f.size}</span>
                          </span>
                        </button>))}
                    </div>)}

                  {cv && (<div className="panel col gap4">
                      <span className="lbl">Designer's note · {fdt(cv.at)}</span>
                      <p style={{ fontSize: '14px' }}>{cv.note}</p>
                    </div>)}
                </div>

                <div className="col gap24">
                  {p.status === 'review' && vi === vers.length - 1 && (<section className="card col gap16">
                      <div className="col gap4">
                        <h2 className="h3">Ready for your review</h2>
                        <span className="help">
                          Submitted by {winner?.name || 'Designer'} · {cv ? fdt(cv.at) : ''}
                        </span>
                      </div>
                      <button type="button" className="btn btn-p btn-l btn-block" onClick={openApproveModal}>
                        Approve version {cv ? cv.v : 1}
                      </button>
                      <button type="button" className="btn btn-block" disabled={p.revUsed >= p.revisions} onClick={openRevisionModal}>
                        Request a revision
                      </button>
                      <span className="help">
                        {p.revUsed >= p.revisions
                        ? 'All included revisions are used. Agree any extra work with the designer first.'
                        : `${p.revisions - p.revUsed} of ${p.revisions} revisions left.`}
                      </span>
                    </section>)}

                  {p.status === 'completed' && (<div className="banner banner-b">
                      <CheckIcon size={22} strokeWidth={2}/>
                      <div className="col gap4">
                        <span className="w600">Approved and completed</span>
                        <span className="help">
                          Final files are with EVO ART. The project is closed.
                        </span>
                      </div>
                    </div>)}

                  {p.status === 'progress' && (<div className="panel col gap4">
                      <span className="w600">Waiting for the next version</span>
                      <span className="help">
                        {winner?.name || 'The designer'} is working on your revision notes.
                      </span>
                    </div>)}

                  <section className="card col gap16">
                    <h2 className="h3">Comments</h2>
                    {p.comments.map((c, i) => {
                    const isA = c.by === 'admin';
                    const dd = isA ? null : designers.find((d) => d.id === c.by);
                    return (<div key={i} className="cmt">
                          <span className={isA ? 'av av-s' : 'av av-s av-o'}>
                            {isA ? 'EA' : dd ? dd.ini : '??'}
                          </span>
                          <div className="col gap4 grow">
                            <div className="row gap8">
                              <span className="w600" style={{ fontSize: '14px' }}>
                                {isA ? 'EVO ART team' : dd ? dd.name : 'Designer'}
                              </span>
                              <span className="help">{fdt(c.at)}</span>
                            </div>
                            <p style={{ fontSize: '14px' }}>{c.text}</p>
                          </div>
                        </div>);
                })}
                    {p.comments.length === 0 && (<span className="help">No comments yet.</span>)}

                    <label className="field">
                      <span className="lbl">Add a comment</span>
                      <textarea className="inp" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Visible to the designer"/>
                    </label>
                    <div className="row end">
                      <button type="button" className="btn btn-p btn-s" onClick={sendComment}>
                        Send comment
                      </button>
                    </div>
                  </section>
                </div>
              </div>
            </>) : (<div className="empty">
              <div className="empty-ic">
                <UploadIcon size={24}/>
              </div>
              <h2 className="h3">Nothing delivered yet</h2>
              <p className="help" style={{ maxWidth: '380px' }}>
                {stageAwarded
                    ? `${winner ? first(winner.name) : 'The designer'} hasn’t submitted files yet. You’ll be notified when version 1 arrives.`
                    : 'Files appear here after you award the project and the designer submits work.'}
              </p>
            </div>)}
        </>)}

      {/* PAYMENTS TAB */}
      {tab === 'payments' && (<>
          <div className="g g3">
            <div className="stat">
              <span className="eyebrow">Award amount</span>
              <span className="stat-v">{p.award ? money(p.award.amount) : '—'}</span>
            </div>
            <div className="stat">
              <span className="eyebrow">Paid</span>
              <span className="stat-v">
                {money(pPays
                .filter((x) => x.status === 'paid')
                .reduce((a, x) => a + x.amount, 0))}
              </span>
            </div>
            <div className="stat">
              <span className="eyebrow">Due</span>
              <span className="stat-v">
                {money(pPays
                .filter((x) => x.status === 'due')
                .reduce((a, x) => a + x.amount, 0))}
              </span>
            </div>
          </div>

          {pPays.length > 0 ? (<div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Payment</th>
                    <th>Designer</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Reference</th>
                    <th className="r">Amount</th>
                    <th>Status</th>
                    <th>
                      <span className="sr">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pPays.map((x) => {
                    const des = designers.find((d) => d.id === x.d);
                    return (<tr key={x.id}>
                        <td className="mono" style={{ fontSize: '13px' }}>
                          {x.id}
                        </td>
                        <td>{des ? des.name : 'Unknown'}</td>
                        <td>{x.type}</td>
                        <td>{x.at ? fdate(x.at) : 'Not paid yet'}</td>
                        <td className="mono" style={{ fontSize: '13px' }}>
                          {x.ref || '—'}
                        </td>
                        <td className="amt">{money(x.amount)}</td>
                        <td>
                          <span className={x.status === 'paid' ? 'bdg b-fill' : 'bdg b-dash'}>
                            {x.status === 'paid' ? 'Paid' : 'Due'}
                          </span>
                        </td>
                        <td className="r">
                          {x.status === 'due' && (<button type="button" className="btn btn-s" onClick={() => markPaid(x.id)}>
                              Mark as paid
                            </button>)}
                        </td>
                      </tr>);
                })}
                </tbody>
              </table>
            </div>) : (<div className="empty">
              <div className="empty-ic">
                <LockIcon size={24}/>
              </div>
              <h2 className="h3">No payments yet</h2>
              <p className="help">An advance of 50% is logged automatically when you award the project.</p>
            </div>)}
        </>)}

      {/* ACTIVITY TAB */}
      {tab === 'activity' && (<section className="card col">
          {p.activity.map((a, i) => (<div key={i} className="li top" style={{ justifyContent: 'flex-start' }}>
              <span className="tl-dot" style={{
                    borderColor: '#000',
                    width: '14px',
                    height: '14px',
                    marginTop: '4px',
                }}/>
              <div className="col gap4 grow">
                <span style={{ fontSize: '14px' }}>{a.text}</span>
                <span className="help">{fdt(a.at)}</span>
              </div>
            </div>))}
        </section>)}
    </>);
};

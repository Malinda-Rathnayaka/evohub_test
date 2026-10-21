import React from 'react';
import { useHub } from '../../context/HubContext';
import { ChevronLeftIcon, FileIcon, DownloadIcon, LockIcon, ErrorCircleIcon, CheckIcon, StarBurstSvg, } from '../common/Icons';
import { money, cdown, fdt, fdate, ftime, first, AWARDED, } from '../../utils/formatters';
export const DesignerBrief = () => {
    const { pid, projects, designers, meId, now, bid, setBid, bidErr, editingBid, justPlaced, submitBid, editBid, cancelEditBid, openWithdrawModal, openWork, go, } = useHub();
    const p = projects.find((x) => x.id === pid) || projects[0];
    const me = designers.find((d) => d.id === meId) || designers[0];
    const meFirst = first(me.name);
    const myBid = p.bids.find((b) => b.d === meId);
    const bc = cdown(p.closes, now);
    const stageAwarded = AWARDED.includes(p.status);
    const wonMe = stageAwarded && p.awardedTo === meId;
    const dStatus = p.status === 'open'
        ? ['Open for bidding', 'bdg b-out']
        : p.status === 'closed'
            ? ['Bidding closed', 'bdg b-grey']
            : wonMe
                ? ['Awarded to you', 'bdg b-fill']
                : ['Closed', 'bdg b-grey'];
    const pForm = p.status === 'open' && (!myBid || editingBid);
    const pPlaced = p.status === 'open' && !!myBid && !editingBid;
    const pAwaiting = p.status === 'closed' && !!myBid;
    const pWon = wonMe;
    const pLost = stageAwarded && !!myBid && !wonMe;
    const pMissed = (p.status === 'closed' && !myBid) || (stageAwarded && !myBid && !wonMe);
    const cdLabel = p.status === 'open' ? (bc.soon ? 'Closing soon' : 'Bidding closes in') : 'Bidding closed';
    const cdCls = p.status === 'open' && bc.soon ? 'cdbig cdbig-soon' : 'cdbig';
    const cdText = p.status === 'open' ? bc.text : fdate(p.closes);
    const cdSub = p.status === 'open' ? 'Closes ' + fdt(p.closes) : 'Closed at ' + ftime(p.closes);
    const errCount = ['amount', 'days', 'note', 'ip'].filter((k) => bidErr[k]).length;
    return (<>
      <button type="button" className="back" onClick={() => go('d-home')}>
        <ChevronLeftIcon size={18}/>
        Open projects
      </button>

      <header className="col gap8">
        <div className="row gap8">
          <span className="eyebrow">
            {p.code} · {p.category}
          </span>
          <span className={dStatus[1]}>{dStatus[0]}</span>
        </div>
        <h1 className="h1">{p.title}</h1>
      </header>

      <div className="split">
        <div className="col gap24">
          <section className="card col gap20">
            <dl className="dl g4" style={{ display: 'grid' }}>
              <div>
                <dt>Maximum bid</dt>
                <dd className="num">{money(p.max)}</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>{p.days} days</dd>
              </div>
              <div>
                <dt>Revisions</dt>
                <dd>{p.revisions} {p.revisions === 1 ? 'round' : 'rounds'}</dd>
              </div>
              <div>
                <dt>Bidding closes</dt>
                <dd>{fdt(p.closes)}</dd>
              </div>
            </dl>

            <div className="divider"/>

            <div className="col gap8">
              <h2 className="h3">The brief</h2>
              <p className="p">{p.brief}</p>
            </div>

            <div className="col gap8">
              <span className="lbl">What you'll deliver</span>
              <ul className="ul">
                {p.deliverables.map((x, i) => (<li key={i}>{x}</li>))}
              </ul>
            </div>

            <div className="col gap8">
              <span className="lbl">Who can bid</span>
              <span style={{ fontSize: '14px' }}>
                Required skill: {p.skill} · Rating {p.minRating.toFixed(1)} and above
              </span>
            </div>
          </section>

          <section className="card col gap12">
            <h2 className="h3">Reference files</h2>
            {p.refs.map((f, i) => (<div key={i} className="file">
                <FileIcon size={18}/>
                <span className="file-name">{f.name}</span>
                <span className="help">{f.size}</span>
                <button type="button" className="icon-btn" aria-label={`Download ${f.name}`}>
                  <DownloadIcon size={18}/>
                </button>
              </div>))}
            <div className="locked">
              <LockIcon size={20}/>
              <div className="col gap4">
                <span className="w600">Client files are locked</span>
                <span className="help">They're shared with the designer who wins this project.</span>
              </div>
            </div>
          </section>
        </div>

        <div className="col gap16">
          <div className={cdCls} role="timer" aria-live="off">
            <span className="cd-flag">
              {p.status === 'open' && bc.soon && <span className="blink"/>}
              {cdLabel}
            </span>
            <span className="cd-t">{cdText}</span>
            <span className="help">{cdSub}</span>
          </div>

          {pForm && (<form className="card col gap16" onSubmit={submitBid} noValidate>
              <h2 className="h3">{editingBid ? 'Edit your sealed bid' : 'Place your sealed bid'}</h2>
              <div className="seal">
                <LockIcon size={20} style={{ flex: 'none', marginTop: '2px' }}/>
                <div className="col gap4">
                  <span className="w600">Your bid is sealed.</span>
                  <span className="help">Other designers cannot see it, or how many people have bid.</span>
                </div>
              </div>

              {errCount > 0 && (<div className="errbox" role="alert">
                  <ErrorCircleIcon size={18}/>
                  <span>
                    Fix {errCount} {errCount === 1 ? 'thing' : 'things'} below to place your bid.
                  </span>
                </div>)}

              <label className="field">
                <span className="lbl">Your bid</span>
                <span className="pre">
                  <span>LKR</span>
                  <input className={bidErr.amount ? 'inp inp-err' : 'inp'} inputMode="decimal" placeholder="0.00" value={bid.amount} onChange={(e) => {
                setBid((b) => ({ ...b, amount: e.target.value }));
            }}/>
                </span>
                <span className="help">Maximum {money(p.max)}</span>
                {bidErr.amount && (<span className="err">
                    <ErrorCircleIcon size={16}/>
                    {bidErr.amount}
                  </span>)}
              </label>

              <label className="field">
                <span className="lbl">Delivery time (days)</span>
                <input className={bidErr.days ? 'inp inp-err' : 'inp'} inputMode="numeric" value={bid.days} onChange={(e) => {
                setBid((b) => ({ ...b, days: e.target.value }));
            }}/>
                <span className="help">EVO ART needs it within {p.days} days.</span>
                {bidErr.days && (<span className="err">
                    <ErrorCircleIcon size={16}/>
                    {bidErr.days}
                  </span>)}
              </label>

              <label className="field">
                <span className="lbl">
                  Note to EVO ART <span className="help">(optional)</span>
                </span>
                <textarea className={bidErr.note ? 'inp inp-err' : 'inp'} rows={3} value={bid.note} onChange={(e) => {
                setBid((b) => ({ ...b, note: e.target.value }));
            }} placeholder="Your approach, or similar work you've done"/>
                <span className="help">{bid.note.length} / 300</span>
                {bidErr.note && <span className="err">{bidErr.note}</span>}
              </label>

              <label className="field">
                <span className="lbl">
                  Portfolio link <span className="help">(optional)</span>
                </span>
                <input className="inp" type="url" value={bid.portfolio} onChange={(e) => {
                setBid((b) => ({ ...b, portfolio: e.target.value }));
            }} placeholder="portfolio.example/your-name"/>
              </label>

              <div className={bidErr.ip ? 'ipbox ipbox-err' : 'ipbox'}>
                <label className="check">
                  <input type="checkbox" checked={bid.ip} onChange={(e) => {
                setBid((b) => ({ ...b, ip: e.target.checked }));
            }}/>
                  <span style={{ fontSize: '14px' }}>
                    <b>I agree:</b> All work becomes the exclusive property of EVO ART (PVT) LTD.
                  </span>
                </label>
              </div>
              {bidErr.ip && (<span className="err" style={{ marginTop: '-8px' }}>
                  <ErrorCircleIcon size={16}/>
                  {bidErr.ip}
                </span>)}

              <button type="submit" className="btn btn-p btn-l btn-block">
                <LockIcon size={18}/>
                {editingBid ? 'Update sealed bid' : 'Place sealed bid'}
              </button>

              {editingBid && (<button type="button" className="btn btn-g btn-block" onClick={cancelEditBid}>
                  Cancel
                </button>)}
            </form>)}

          {pPlaced && (<section className="card col gap16">
              {justPlaced && (<>
                  <div className="row gap12">
                    <span className="okc" style={{ width: '44px', height: '44px' }}>
                      <CheckIcon size={22} strokeWidth={2.6}/>
                    </span>
                    <div className="col">
                      <span className="h3">Your bid is in.</span>
                      <span className="help">It's sealed. Only EVO ART can see it.</span>
                    </div>
                  </div>
                  <div className="divider"/>
                </>)}
              <div className="row between">
                <h2 className="h3">Your sealed bid</h2>
                <span className="bdg b-out">Sealed</span>
              </div>
              <span className="big-amt">{money(myBid?.amount)}</span>
              <div className="kv" style={{ borderTop: 0, paddingTop: 0 }}>
                <span>Delivery</span>
                <b>{myBid?.days} days</b>
              </div>
              <div className="kv">
                <span>Placed</span>
                <b>{myBid ? fdt(myBid.at) : '—'}</b>
              </div>
              {myBid?.note && (<div className="panel" style={{ padding: '14px', fontSize: '14px' }}>
                  {myBid.note}
                </div>)}
              <p className="help">You can edit or withdraw until bidding closes, in {bc.text}.</p>
              <div className="g g2">
                <button type="button" className="btn" onClick={editBid}>
                  Edit bid
                </button>
                <button type="button" className="btn btn-g" onClick={openWithdrawModal}>
                  Withdraw
                </button>
              </div>
            </section>)}

          {pAwaiting && (<section className="card col gap16">
              <div className="row between">
                <h2 className="h3">Awaiting decision</h2>
                <span className="bdg b-grey b-dot">Awaiting</span>
              </div>
              <p style={{ fontSize: '14px' }}>
                Bidding has closed. EVO ART is reviewing the sealed bids and will let you know here.
              </p>
              <div className="panel col gap4">
                <span className="eyebrow">Your bid</span>
                <span className="big-amt" style={{ fontSize: '28px' }}>
                  {money(myBid?.amount)}
                </span>
                <span className="help">
                  {myBid?.days} days · placed {myBid ? fdt(myBid.at) : ''}
                </span>
              </div>
            </section>)}

          {pWon && (<section className="won">
              <StarBurstSvg className="won-burst"/>
              <span className="bdg" style={{ background: '#fff', color: '#000', alignSelf: 'flex-start' }}>
                You won
              </span>
              <h2 className="h1" style={{ fontSize: '36px' }}>
                Congratulations, {meFirst}.
              </h2>
              <p style={{ fontSize: '15px', maxWidth: '300px' }}>
                EVO ART awarded you this project for <b>{p.award ? money(p.award.amount) : ''}</b>. The client files are now unlocked in your workspace.
              </p>
              <button type="button" className="btn btn-w btn-l" style={{ alignSelf: 'flex-start' }} onClick={() => openWork(p.id)}>
                Open workspace
              </button>
            </section>)}

          {pLost && (<section className="lost">
              <div className="row between">
                <h2 className="h3">Not selected</h2>
                <span className="bdg b-dash">Not selected</span>
              </div>
              <p style={{ fontSize: '14px' }}>
                This project went to another designer. Thanks for bidding. Your amount stays private.
              </p>
              <div className="panel col gap4">
                <span className="eyebrow">Your bid</span>
                <span className="w600 num">{money(myBid?.amount)}</span>
              </div>
              <button type="button" className="btn" onClick={() => go('d-home')}>
                See open projects
              </button>
            </section>)}

          {pMissed && (<section className="panel col gap8">
              <span className="w600">Bidding has closed</span>
              <span className="help">You didn't place a bid on this project.</span>
            </section>)}
        </div>
      </div>
    </>);
};

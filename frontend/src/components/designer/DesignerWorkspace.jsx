import React from 'react';
import { useHub } from '../../context/HubContext';
import { ChevronLeftIcon, UploadIcon, FileIcon, CloseIcon, DownloadIcon, CheckIcon, ErrorCircleIcon, } from '../common/Icons';
import { StatusTimeline } from '../common/StatusTimeline';
import { ST, money, cdown, fdt, fdate, VCLS, D, } from '../../utils/formatters';
export const DesignerWorkspace = () => {
    const { pid, projects, designers, now, pending, addPending, removePending, submitWork, comment, setComment, sendComment, go, } = useHub();
    const p = projects.find((x) => x.id === pid) || projects[0];
    const vers = p.deliveries;
    const lastV = vers.length ? vers[vers.length - 1] : null;
    const canUpload = p.status === 'awarded' || p.status === 'progress';
    const lastAdmin = p.comments.filter((c) => c.by === 'admin').slice(-1)[0];
    const dueOf = p.award ? p.award.at + p.days * D : now;
    const dueCd = p.status === 'completed'
        ? 'Delivered'
        : cdown(dueOf, now).closed
            ? 'Overdue'
            : cdown(dueOf, now).text + ' left';
    const revBanner = p.status === 'progress' && !!lastV && lastV.status === 'Revision requested';
    const lastRev = p.revUsed >= p.revisions;
    return (<>
      <button type="button" className="back" onClick={() => go('d-projects')}>
        <ChevronLeftIcon size={18}/>
        My projects
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
        <div className="cdbox" style={{ minWidth: '260px' }}>
          <span className="cd-l">Due {fdate(dueOf)}</span>
          <span className="cd-t">{dueCd}</span>
        </div>
      </header>

      <section className="card" aria-label="Project status">
        <StatusTimeline status={p.status}/>
      </section>

      {revBanner && (<div className="banner">
          <ErrorCircleIcon size={22} style={{ flex: 'none' }}/>
          <div className="col gap4 grow">
            <div className="row between">
              <span className="w600">Revision requested</span>
              <span className="bdg b-out">
                Revision {p.revUsed} of {p.revisions}
              </span>
            </div>
            <p style={{ fontSize: '14px' }}>"{lastAdmin ? lastAdmin.text : ''}"</p>
            {lastRev && (<span className="help">This is the last included revision.</span>)}
          </div>
        </div>)}

      <div className="split">
        <div className="col gap24">
          <section className="card col gap16">
            <div className="row between">
              <h2 className="h3">Deliverables</h2>
              <span className="help">Next: version {vers.length + 1}</span>
            </div>

            {canUpload && (<>
                <button type="button" className="drop" onClick={addPending}>
                  <UploadIcon size={26}/>
                  <span className="w600">Drag files here or browse</span>
                  <span className="help">PDF, PNG, JPG, AI or ZIP · up to 200 MB</span>
                </button>

                {pending.map((f, i) => (<div key={i} className="file">
                    <FileIcon size={18}/>
                    <span className="file-name">{f.name}</span>
                    <span className="help">{f.size} · Ready</span>
                    <button type="button" className="icon-btn" aria-label={`Remove ${f.name}`} onClick={() => removePending(i)}>
                      <CloseIcon size={18}/>
                    </button>
                  </div>))}

                <button type="button" className="btn btn-p btn-l btn-block" disabled={pending.length === 0} onClick={submitWork}>
                  Submit version {vers.length + 1} for review
                </button>
                <span className="help">
                  {pending.length
                ? `${pending.length} ${pending.length === 1 ? 'file' : 'files'} ready. EVO ART is notified when you submit.`
                : 'Add at least one file to submit.'}
                </span>
              </>)}

            {p.status === 'review' && (<div className="panel col gap4">
                <span className="w600">Version {lastV ? lastV.v : 0} is with EVO ART</span>
                <span className="help">
                  You'll see their decision here. Uploads reopen if they ask for a revision.
                </span>
              </div>)}

            {p.status === 'completed' && (<div className="banner banner-b">
                <CheckIcon size={22} strokeWidth={2}/>
                <div className="col gap4">
                  <span className="w600">Approved. Project complete.</span>
                  <span className="help">
                    Thank you. Your final payment is logged in Earnings.
                  </span>
                </div>
              </div>)}
          </section>

          {vers.length > 0 && (<section className="col gap12">
              <h2 className="h3">Submitted versions</h2>
              {vers
                .slice()
                .reverse()
                .map((v) => (<div key={v.v} className="card col gap12" style={{ padding: '18px' }}>
                    <div className="row between">
                      <span className="w600">
                        Version {v.v} · {fdt(v.at)}
                      </span>
                      <span className={VCLS[v.status] || 'bdg b-out'}>
                        {v.status}
                      </span>
                    </div>
                    {v.files.map((f, i) => (<div key={i} className="file">
                        <FileIcon size={18}/>
                        <span className="file-name">{f.name}</span>
                        <span className="help">{f.size}</span>
                      </div>))}
                  </div>))}
            </section>)}

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
            {p.comments.length === 0 && (<span className="help">No comments yet. Ask EVO ART anything about the brief.</span>)}

            <label className="field">
              <span className="lbl">Message EVO ART</span>
              <textarea className="inp" rows={3} value={comment} onChange={(e) => setComment(e.target.value)}/>
            </label>
            <div className="row end">
              <button type="button" className="btn btn-p btn-s" onClick={sendComment}>
                Send
              </button>
            </div>
          </section>
        </div>

        <div className="col gap24">
          <section className="card col gap12">
            <div className="row between">
              <h2 className="h3">Client files</h2>
              <span className="bdg b-fill">Unlocked</span>
            </div>
            <span className="help">Shared with you because you won this project.</span>
            {p.clientFiles.map((f, i) => (<div key={i} className="file">
                <FileIcon size={18}/>
                <span className="file-name">{f.name}</span>
                <span className="help">{f.size}</span>
                <button type="button" className="icon-btn" aria-label={`Download ${f.name}`}>
                  <DownloadIcon size={18}/>
                </button>
              </div>))}
          </section>

          <section className="card col gap12">
            <h2 className="h3">Brief</h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{p.brief}</p>
            <ul className="ul" style={{ fontSize: '14px' }}>
              {p.deliverables.map((x, i) => (<li key={i}>{x}</li>))}
            </ul>
            {p.refs.map((f, i) => (<div key={i} className="file">
                <FileIcon size={18}/>
                <span className="file-name">{f.name}</span>
                <span className="help">{f.size}</span>
              </div>))}
          </section>

          <section className="card col">
            <div className="kv" style={{ borderTop: 0 }}>
              <span>Award</span>
              <b className="num">{p.award ? money(p.award.amount) : '—'}</b>
            </div>
            <div className="kv">
              <span>Revisions used</span>
              <b>
                {p.revUsed} of {p.revisions}
              </b>
            </div>
            <div className="kv">
              <span>Rights</span>
              <b>Owned by EVO ART (PVT) LTD</b>
            </div>
          </section>
        </div>
      </div>
    </>);
};

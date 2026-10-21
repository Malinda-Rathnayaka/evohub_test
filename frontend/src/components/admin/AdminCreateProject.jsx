import React from 'react';
import { useHub } from '../../context/HubContext';
import { ChevronLeftIcon, ErrorCircleIcon, UploadIcon, FileIcon, CloseIcon, LockIcon } from '../common/Icons';
export const AdminCreateProject = () => {
    const { draft, setDraft, draftErr, editingId, designers, addDraftRef, removeDraftRef, addDraftClientFile, removeDraftClientFile, toggleDraftDesigner, publish, go, } = useHub();
    const createTitle = editingId ? 'Edit project' : 'New project';
    const createEyebrow = editingId ? 'Projects · Edit' : 'Projects · Create';
    const publishLabel = editingId ? 'Save changes' : 'Publish project';
    const hasErrors = !!(draftErr.title || draftErr.brief || draftErr.max);
    const activeDesigners = designers.filter((x) => x.active);
    return (<>
      <button type="button" className="back" onClick={() => go('a-projects')}>
        <ChevronLeftIcon size={18}/>
        All projects
      </button>

      <header className="col gap8">
        <span className="eyebrow">{createEyebrow}</span>
        <h1 className="h1">{createTitle}</h1>
        <p className="lead">
          Designers see everything here except the client section. Bids are sealed until the closing time.
        </p>
      </header>

      {hasErrors && (<div className="errbox" role="alert">
          <ErrorCircleIcon size={18}/>
          <span>Some details are missing. Check the fields marked below.</span>
        </div>)}

      <div className="split">
        <div className="col gap24">
          <section className="card col gap20">
            <h2 className="h3">The brief</h2>

            <label className="field">
              <span className="lbl">Project title</span>
              <input className={draftErr.title ? 'inp inp-err' : 'inp'} value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder="For example: Tea gift box packaging"/>
              {draftErr.title && (<span className="err">
                  <ErrorCircleIcon size={16}/>
                  Add a project title.
                </span>)}
            </label>

            <div className="g g2">
              <label className="field">
                <span className="lbl">Category</span>
                <select className="inp" value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
                  <option>Branding</option>
                  <option>Packaging</option>
                  <option>Print</option>
                  <option>Social media</option>
                  <option>UI/UX</option>
                </select>
              </label>

              <label className="field">
                <span className="lbl">Required skill</span>
                <select className="inp" value={draft.skill} onChange={(e) => setDraft((d) => ({ ...d, skill: e.target.value }))}>
                  <option>Brand identity</option>
                  <option>Packaging design</option>
                  <option>Print &amp; layout</option>
                  <option>Editorial layout</option>
                  <option>Social media design</option>
                  <option>UI/UX design</option>
                  <option>Illustration</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span className="lbl">Brief</span>
              <textarea className={draftErr.brief ? 'inp inp-err' : 'inp'} rows={6} value={draft.brief} onChange={(e) => setDraft((d) => ({ ...d, brief: e.target.value }))} placeholder="What is it, who is it for, and what should it feel like?"/>
              {draftErr.brief && (<span className="err">
                  <ErrorCircleIcon size={16}/>
                  Write a short brief so designers know what to price.
                </span>)}
            </label>

            <div className="field">
              <span className="lbl">Reference files</span>
              <button type="button" className="drop" onClick={addDraftRef}>
                <UploadIcon size={24}/>
                <span className="w600">Drop files here or browse</span>
                <span className="help">PDF, AI, PSD, JPG, PNG or ZIP · up to 50 MB each</span>
              </button>
              {draft.refs.map((f, i) => (<div key={i} className="file">
                  <FileIcon size={18}/>
                  <span className="file-name">{f.name}</span>
                  <span className="help">{f.size}</span>
                  <button type="button" className="icon-btn" aria-label={`Remove ${f.name}`} onClick={() => removeDraftRef(i)}>
                    <CloseIcon size={18}/>
                  </button>
                </div>))}
            </div>
          </section>

          <section className="card col gap20">
            <h2 className="h3">Budget and timing</h2>

            <label className="field">
              <span className="lbl">Maximum bid</span>
              <span className="pre">
                <span>LKR</span>
                <input className={draftErr.max ? 'inp inp-err' : 'inp'} inputMode="decimal" value={draft.max} onChange={(e) => setDraft((d) => ({ ...d, max: e.target.value }))} placeholder="0.00"/>
              </span>
              <span className="help">Designers can't bid above this amount. They never see other bids.</span>
              {draftErr.max && (<span className="err">
                  <ErrorCircleIcon size={16}/>
                  Enter a maximum bid above zero.
                </span>)}
            </label>

            <div className="g g2">
              <label className="field">
                <span className="lbl">Bidding opens</span>
                <input className="inp" type="datetime-local" value={draft.opens} onChange={(e) => setDraft((d) => ({ ...d, opens: e.target.value }))}/>
              </label>

              <label className="field">
                <span className="lbl">Bidding closes</span>
                <input className="inp" type="datetime-local" value={draft.closes} onChange={(e) => setDraft((d) => ({ ...d, closes: e.target.value }))}/>
              </label>

              <label className="field">
                <span className="lbl">Delivery time (days)</span>
                <input className="inp" inputMode="numeric" value={draft.days} onChange={(e) => setDraft((d) => ({ ...d, days: e.target.value }))}/>
              </label>

              <label className="field">
                <span className="lbl">Revision rounds included</span>
                <select className="inp" value={draft.revisions} onChange={(e) => setDraft((d) => ({ ...d, revisions: e.target.value }))}>
                  <option value="1">1 round</option>
                  <option value="2">2 rounds</option>
                  <option value="3">3 rounds</option>
                </select>
              </label>
            </div>
          </section>
        </div>

        <div className="col gap24">
          <section className="card col gap16">
            <h2 className="h3">Who can bid</h2>

            <label className="field">
              <span className="lbl">Minimum designer rating</span>
              <select className="inp" value={draft.minRating} onChange={(e) => setDraft((d) => ({ ...d, minRating: e.target.value }))}>
                <option value="3.0">3.0 and above</option>
                <option value="3.5">3.5 and above</option>
                <option value="4.0">4.0 and above</option>
                <option value="4.5">4.5 and above</option>
              </select>
            </label>

            <fieldset className="field">
              <legend className="lbl" style={{ marginBottom: '4px' }}>
                Visibility
              </legend>
              <label className="radio">
                <input type="radio" name="vis" checked={draft.visibility === 'all'} onChange={() => setDraft((d) => ({ ...d, visibility: 'all' }))}/>
                All active designers
              </label>
              <label className="radio">
                <input type="radio" name="vis" checked={draft.visibility === 'selected'} onChange={() => setDraft((d) => ({ ...d, visibility: 'selected' }))}/>
                Selected designers only
              </label>
            </fieldset>

            {draft.visibility === 'selected' && (<div className="panel col" style={{ padding: '8px 16px' }}>
                {activeDesigners.map((dp) => (<label key={dp.id} className="check">
                    <input type="checkbox" checked={draft.selected.includes(dp.id)} onChange={() => toggleDraftDesigner(dp.id)}/>
                    <span className="col">
                      <span className="w600">{dp.name}</span>
                      <span className="help">
                        Rating {dp.rating.toFixed(1)} · {dp.skills.join(', ')}
                      </span>
                    </span>
                  </label>))}
              </div>)}
          </section>

          <section className="card col gap16">
            <div className="row between">
              <h2 className="h3">Client</h2>
              <span className="bdg b-dash">Hidden from designers</span>
            </div>

            <label className="field">
              <span className="lbl">Client name</span>
              <input className="inp" value={draft.client} onChange={(e) => setDraft((d) => ({ ...d, client: e.target.value }))}/>
            </label>

            <div className="field">
              <span className="lbl">Client files</span>
              <button type="button" className="drop" style={{ padding: '18px 16px' }} onClick={addDraftClientFile}>
                <span className="w600">Add client files</span>
                <span className="help">Shared with the winning designer only</span>
              </button>
              {draft.clientFiles.map((f, i) => (<div key={i} className="file">
                  <LockIcon size={18}/>
                  <span className="file-name">{f.name}</span>
                  <span className="help">{f.size}</span>
                  <button type="button" className="icon-btn" aria-label={`Remove ${f.name}`} onClick={() => removeDraftClientFile(i)}>
                    <CloseIcon size={18}/>
                  </button>
                </div>))}
            </div>
          </section>

          <div className="col gap8">
            <button type="button" className="btn btn-p btn-l btn-block" onClick={() => publish(false)}>
              {publishLabel}
            </button>
            <button type="button" className="btn btn-block" onClick={() => publish(true)}>
              Save as draft
            </button>
            <button type="button" className="btn btn-g btn-block" onClick={() => go('a-projects')}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>);
};

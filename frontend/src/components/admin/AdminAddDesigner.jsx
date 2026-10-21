import React from 'react';
import { useHub } from '../../context/HubContext';
import { ChevronLeftIcon, CheckIcon } from '../common/Icons';
import { SKILLS, first } from '../../utils/formatters';
export const AdminAddDesigner = () => {
    const { nd, setNd, ndErr, ndDone, ndNewId, toggleNdSkill, regenNdPw, copyNdPw, submitNd, ndAnother, go, } = useHub();
    const ndFirst = first(nd.name);
    return (<>
      <button type="button" className="back" onClick={() => go('a-designers')}>
        <ChevronLeftIcon size={18}/>
        All designers
      </button>

      <header className="col gap12">
        <span className="eyebrow">Designers</span>
        <h1 className="h1">Add a designer</h1>
        <div className="steps">
          <span className="step step-on">
            <b>1</b>Details
          </span>
          <span className="step step-on">
            <b>2</b>Login
          </span>
          <span className={ndDone ? 'step step-on' : 'step'}>
            <b>3</b>Invite
          </span>
        </div>
      </header>

      {!ndDone ? (<div className="split">
          <section className="card col gap20">
            <h2 className="h3">Designer details</h2>
            <div className="g g2">
              <label className="field">
                <span className="lbl">Full name</span>
                <input className={ndErr.name ? 'inp inp-err' : 'inp'} value={nd.name} onChange={(e) => setNd((n) => ({ ...n, name: e.target.value }))}/>
                {ndErr.name && <span className="err">{ndErr.name}</span>}
              </label>

              <label className="field">
                <span className="lbl">Email</span>
                <input className={ndErr.email ? 'inp inp-err' : 'inp'} type="email" value={nd.email} onChange={(e) => setNd((n) => ({ ...n, email: e.target.value }))}/>
                {ndErr.email && <span className="err">{ndErr.email}</span>}
              </label>

              <label className="field">
                <span className="lbl">Phone</span>
                <input className="inp" type="tel" value={nd.phone} onChange={(e) => setNd((n) => ({ ...n, phone: e.target.value }))}/>
              </label>

              <label className="field">
                <span className="lbl">Interview rating</span>
                <select className="inp" value={nd.rating} onChange={(e) => setNd((n) => ({ ...n, rating: e.target.value }))}>
                  <option value="3.5">3.5</option>
                  <option value="4.0">4.0</option>
                  <option value="4.5">4.5</option>
                  <option value="5.0">5.0</option>
                </select>
              </label>
            </div>

            <fieldset className="field">
              <legend className="lbl" style={{ marginBottom: '6px' }}>
                Skills
              </legend>
              <div className="row gap8">
                {SKILLS.map((k) => {
                const on = nd.skills.includes(k);
                return (<button key={k} type="button" className={on ? 'chipbtn chipbtn-on' : 'chipbtn'} aria-pressed={on} onClick={() => toggleNdSkill(k)}>
                      {k}
                    </button>);
            })}
              </div>
              {ndErr.skills && (<span className="err" style={{ marginTop: '6px' }}>
                  {ndErr.skills}
                </span>)}
            </fieldset>

            <label className="field" style={{ maxWidth: '280px' }}>
              <span className="lbl">Concurrent project limit</span>
              <select className="inp" value={nd.limit} onChange={(e) => setNd((n) => ({ ...n, limit: e.target.value }))}>
                <option value="1">1 project</option>
                <option value="2">2 projects</option>
                <option value="3">3 projects</option>
                <option value="4">4 projects</option>
              </select>
            </label>
          </section>

          <section className="card col gap16">
            <h2 className="h3">Login and invite</h2>
            <label className="field">
              <span className="lbl">Temporary password</span>
              <input className="inp mono" readOnly value={nd.pw}/>
            </label>
            <div className="row gap8">
              <button type="button" className="btn btn-s" onClick={regenNdPw}>
                Generate new
              </button>
              <button type="button" className="btn btn-s" onClick={copyNdPw}>
                Copy
              </button>
            </div>
            <span className="help">The designer must change it the first time they sign in.</span>
            <label className="check">
              <input type="checkbox" checked={nd.invite} onChange={(e) => setNd((n) => ({ ...n, invite: e.target.checked }))}/>
              <span>Email the invite now</span>
            </label>
            <button type="button" className="btn btn-p btn-l btn-block" onClick={submitNd}>
              Create login and send invite
            </button>
          </section>
        </div>) : (<div className="split">
          <section className="card col gap20">
            <div className="row gap16">
              <span className="okc">
                <CheckIcon size={30} strokeWidth={2.4}/>
              </span>
              <div className="col gap4">
                <h2 className="h2">Login created</h2>
                <span className="help">
                  {nd.name} can now sign in. The invite has gone to {nd.email}.
                </span>
              </div>
            </div>

            <div className="mailprev">
              <div className="mailprev-h">
                <span>
                  <b>To:</b> {nd.email}
                </span>
                <span>
                  <b>Subject:</b> You're invited to EVO ART Designer Hub
                </span>
              </div>
              <div className="col gap12" style={{ padding: '20px', fontSize: '14px' }}>
                <p>Hi {ndFirst},</p>
                <p>
                  Thanks for interviewing with EVO ART. You now have access to Designer Hub, our private portal for design projects.
                </p>
                <div className="panel col gap4" style={{ padding: '14px' }}>
                  <span>
                    <b>Email:</b> {nd.email}
                  </span>
                  <span>
                    <b>Temporary password:</b> <span className="mono">{nd.pw}</span>
                  </span>
                </div>
                <p>Please sign in and choose a new password. Bids you place are sealed. Only EVO ART sees them.</p>
                <p>EVO ART (PVT) LTD</p>
              </div>
            </div>
          </section>

          <section className="col gap12">
            <button type="button" className="btn btn-p btn-l btn-block" onClick={() => go('a-designer', { did: ndNewId || 'D1' })}>
              View designer
            </button>
            <button type="button" className="btn btn-block" onClick={ndAnother}>
              Add another designer
            </button>
          </section>
        </div>)}
    </>);
};

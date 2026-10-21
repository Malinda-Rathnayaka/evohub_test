import React from 'react';
import { useHub } from '../../context/HubContext';
export const DesignerProfile = () => {
    const { designers, meId, prof, setProf, saveProfile, go, } = useHub();
    const me = designers.find((d) => d.id === meId) || designers[0];
    return (<>
      <header className="col gap8">
        <span className="eyebrow">Profile</span>
        <h1 className="h1">Your profile</h1>
      </header>

      <div className="split">
        <section className="card col gap20">
          <div className="who gap16">
            <span className="av av-l">{me.ini}</span>
            <div className="col gap4">
              <span className="h2">{me.name}</span>
              <span className="help">
                Designer since {me.joined} · Rating {me.rating.toFixed(1)}
              </span>
            </div>
          </div>

          <label className="field">
            <span className="lbl">Email</span>
            <input className="inp" readOnly value={me.email}/>
            <span className="help">Contact EVO ART to change your email.</span>
          </label>

          <div className="g g2">
            <label className="field">
              <span className="lbl">Phone</span>
              <input className="inp" type="tel" value={prof.phone} onChange={(e) => setProf((p) => ({ ...p, phone: e.target.value }))}/>
            </label>
            <label className="field">
              <span className="lbl">Portfolio link</span>
              <input className="inp" type="url" value={prof.portfolio} onChange={(e) => setProf((p) => ({ ...p, portfolio: e.target.value }))}/>
            </label>
          </div>

          <div className="field">
            <span className="lbl">Skills</span>
            <div className="row gap8">
              {me.skills.map((k) => (<span key={k} className="chip">
                  {k}
                </span>))}
            </div>
            <span className="help">Skills and rating are set by EVO ART after your interview.</span>
          </div>

          <div className="row end">
            <button type="button" className="btn btn-p" onClick={saveProfile}>
              Save changes
            </button>
          </div>
        </section>

        <section className="card col gap12">
          <h2 className="h3">Password</h2>
          <p className="help">Choose a strong password you don't use anywhere else.</p>
          <button type="button" className="btn" onClick={() => go('password', { pwFrom: 'd-profile' })}>
            Change password
          </button>
          <div className="divider" style={{ margin: '8px 0' }}/>
          <h2 className="h3">Your agreement</h2>
          <p className="help">All work you deliver becomes the exclusive property of EVO ART (PVT) LTD.</p>
        </section>
      </div>
    </>);
};

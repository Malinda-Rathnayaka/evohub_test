import React from 'react';
import { useHub } from '../../context/HubContext';
import { LockIcon, ErrorCircleIcon } from '../common/Icons';
export const LoginScreen = () => {
    const { login, onLoginEmail, onLoginPw, signIn, showForgot, toggleForgot } = useHub();
    return (<div className="login">
      <div className="login-art">
        <div className="logo logo-inv" style={{ padding: 0 }}>
          <b>EVO ART</b>
          <span>Designer Hub</span>
        </div>
        <div className="col gap20">
          <p className="display">
            Sealed bids.
            <br />
            Fair awards.
            <br />
            Great work.
          </p>
          <p className="lead-inv">
            A private workspace where EVO ART shares design projects with the freelance designers we have interviewed.
          </p>
        </div>
        <p className="help-inv">
          <LockIcon size={16}/>
          Private portal. Access by invitation only.
        </p>
      </div>

      <div className="login-form">
        <form onSubmit={signIn} noValidate>
          <div className="col gap8">
            <h1 className="h2">Sign in</h1>
            <p className="help">Use the email EVO ART invited you with.</p>
          </div>

          {login.err && (<div className="errbox" role="alert">
              <ErrorCircleIcon size={18}/>
              <span>{login.err}</span>
            </div>)}

          <label className="field">
            <span className="lbl">Email</span>
            <input className={login.err ? 'inp inp-err' : 'inp'} type="email" autoComplete="username" value={login.email} onChange={(e) => onLoginEmail(e.target.value)}/>
          </label>

          <label className="field">
            <span className="lbl">Password</span>
            <input className={login.err ? 'inp inp-err' : 'inp'} type="password" autoComplete="current-password" value={login.pw} onChange={(e) => onLoginPw(e.target.value)}/>
          </label>

          <button className="btn btn-p btn-l btn-block" type="submit">
            Sign in
          </button>

          <div className="col gap4">
            <button type="button" className="link" aria-expanded={showForgot} onClick={toggleForgot}>
              Forgot password? Contact EVO ART
            </button>
            {showForgot && (<div className="panel" style={{ fontSize: '14px' }}>
                EVO ART resets passwords for you. Message your EVO ART contact and we will send you a new temporary password.
              </div>)}
          </div>

          <div className="divider"/>

          <p className="help row gap8">
            <LockIcon size={16}/>
            Private portal. Access by invitation only.
          </p>
        </form>
      </div>
    </div>);
};

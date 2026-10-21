import React from 'react';
import { useHub } from '../../context/HubContext';
import { ChevronLeftIcon, ErrorCircleIcon } from '../common/Icons';
export const ChangePasswordScreen = () => {
    const { pw, setPw, pwErr, savePw, go, pwFrom, role } = useHub();
    const pwBackTo = pwFrom && pwFrom !== 'password' ? pwFrom : role === 'admin' ? 'a-dash' : 'd-profile';
    const hasErr = !!(pwErr.cur || pwErr.nw || pwErr.cf);
    return (<>
      <button type="button" className="back" onClick={() => go(pwBackTo)}>
        <ChevronLeftIcon size={18}/>
        Back
      </button>

      <header className="col gap8">
        <span className="eyebrow">Account</span>
        <h1 className="h1">Change password</h1>
      </header>

      <form className="card col gap16" style={{ maxWidth: '520px' }} onSubmit={savePw} noValidate>
        {hasErr && (<div className="errbox" role="alert">
            <ErrorCircleIcon size={18}/>
            <span>Your password wasn't changed. Check the fields below.</span>
          </div>)}

        <label className="field">
          <span className="lbl">Current password</span>
          <input className={pwErr.cur ? 'inp inp-err' : 'inp'} type="password" autoComplete="current-password" value={pw.cur} onChange={(e) => setPw((p) => ({ ...p, cur: e.target.value }))}/>
          {pwErr.cur && <span className="err">{pwErr.cur}</span>}
        </label>

        <label className="field">
          <span className="lbl">New password</span>
          <input className={pwErr.nw ? 'inp inp-err' : 'inp'} type="password" autoComplete="new-password" value={pw.nw} onChange={(e) => setPw((p) => ({ ...p, nw: e.target.value }))}/>
          <span className="help">At least 8 characters, including a number.</span>
          {pwErr.nw && <span className="err">{pwErr.nw}</span>}
        </label>

        <label className="field">
          <span className="lbl">Confirm new password</span>
          <input className={pwErr.cf ? 'inp inp-err' : 'inp'} type="password" autoComplete="new-password" value={pw.cf} onChange={(e) => setPw((p) => ({ ...p, cf: e.target.value }))}/>
          {pwErr.cf && <span className="err">{pwErr.cf}</span>}
        </label>

        <div className="row end">
          <button type="button" className="btn btn-g" onClick={() => go(pwBackTo)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-p">
            Update password
          </button>
        </div>
      </form>
    </>);
};

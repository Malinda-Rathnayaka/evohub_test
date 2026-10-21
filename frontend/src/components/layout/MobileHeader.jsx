import React from 'react';
import { useHub } from '../../context/HubContext';
import { SignOutIcon } from '../common/Icons';
export const MobileHeader = () => {
    const { role, signOut, designers, meId } = useHub();
    const isAdmin = role === 'admin';
    const me = designers.find((d) => d.id === meId) || designers[0];
    const acctIni = isAdmin ? 'EA' : me.ini;
    return (<div className="mtop">
      <div className="logo logo-sm">
        <b>EVO ART</b>
        <span>Designer Hub</span>
      </div>
      <div className="row gap4">
        <span className="av av-s">{acctIni}</span>
        <button type="button" className="icon-btn" aria-label="Sign out" onClick={signOut}>
          <SignOutIcon size={20}/>
        </button>
      </div>
    </div>);
};

import React from 'react';
import { useHub } from '../../context/HubContext';
export const Sidebar = () => {
    const { role, screen, go, signOut, designers, meId } = useHub();
    const isAdmin = role === 'admin';
    const me = designers.find((d) => d.id === meId) || designers[0];
    const adminNav = [
        { label: 'Dashboard', screen: 'a-dash', matches: ['a-dash'] },
        { label: 'Projects', screen: 'a-projects', matches: ['a-projects', 'a-create', 'a-project'] },
        { label: 'Designers', screen: 'a-designers', matches: ['a-designers', 'a-designer', 'a-add'] },
        { label: 'Payments', screen: 'a-payments', matches: ['a-payments'] },
        { label: 'Change password', screen: 'password', matches: ['password'] },
    ];
    const designerNav = [
        { label: 'Home', screen: 'd-home', matches: ['d-home', 'd-brief'] },
        { label: 'My bids', screen: 'd-bids', matches: ['d-bids'] },
        { label: 'My projects', screen: 'd-projects', matches: ['d-projects', 'd-work'] },
        { label: 'Earnings', screen: 'd-earnings', matches: ['d-earnings'] },
        { label: 'Profile', screen: 'd-profile', matches: ['d-profile', 'password'] },
    ];
    const navItems = isAdmin ? adminNav : designerNav;
    const acct = isAdmin
        ? { name: 'EVO ART team', ini: 'EA', sub: 'Admin' }
        : { name: me.name, ini: me.ini, sub: 'Designer' };
    return (<aside className="side" aria-label="Main menu">
      <div className="logo">
        <b>EVO ART</b>
        <span>Designer Hub</span>
      </div>

      <nav className="col gap4" aria-label="Sections">
        {navItems.map((n) => {
            const isActive = n.matches.includes(screen);
            return (<button key={n.label} type="button" className={isActive ? 'nav nav-on' : 'nav'} aria-current={isActive ? 'page' : undefined} onClick={() => go(n.screen, n.screen === 'password' ? { pwFrom: screen } : {})}>
              {n.label}
            </button>);
        })}
      </nav>

      <div className="side-foot">
        <div className="who" style={{ padding: '0 6px' }}>
          <span className="av">{acct.ini}</span>
          <div className="col">
            <span className="w600">{acct.name}</span>
            <span className="help">{acct.sub}</span>
          </div>
        </div>
        <button type="button" className="nav" onClick={signOut}>
          Sign out
        </button>
      </div>
    </aside>);
};

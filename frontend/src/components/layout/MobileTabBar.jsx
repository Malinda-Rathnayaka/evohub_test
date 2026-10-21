import React from 'react';
import { useHub } from '../../context/HubContext';
export const MobileTabBar = () => {
    const { role, screen, go } = useHub();
    const isAdmin = role === 'admin';
    const adminNav = [
        { short: 'Home', screen: 'a-dash', matches: ['a-dash'] },
        { short: 'Projects', screen: 'a-projects', matches: ['a-projects', 'a-create', 'a-project'] },
        { short: 'Designers', screen: 'a-designers', matches: ['a-designers', 'a-designer', 'a-add'] },
        { short: 'Payments', screen: 'a-payments', matches: ['a-payments'] },
        { short: 'Account', screen: 'password', matches: ['password'] },
    ];
    const designerNav = [
        { short: 'Home', screen: 'd-home', matches: ['d-home', 'd-brief'] },
        { short: 'My bids', screen: 'd-bids', matches: ['d-bids'] },
        { short: 'Projects', screen: 'd-projects', matches: ['d-projects', 'd-work'] },
        { short: 'Earnings', screen: 'd-earnings', matches: ['d-earnings'] },
        { short: 'Profile', screen: 'd-profile', matches: ['d-profile', 'password'] },
    ];
    const navItems = isAdmin ? adminNav : designerNav;
    return (<nav className="tabbar" aria-label="Sections">
      {navItems.map((n) => {
            const isActive = n.matches.includes(screen);
            return (<button key={n.short} type="button" className={isActive ? 'tb tb-on' : 'tb'} aria-current={isActive ? 'page' : undefined} onClick={() => go(n.screen, n.screen === 'password' ? { pwFrom: screen } : {})}>
            {n.short}
          </button>);
        })}
    </nav>);
};

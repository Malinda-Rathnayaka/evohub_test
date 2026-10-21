import React from 'react';
import { useHub } from '../../context/HubContext';
import { PrototypeBar } from './PrototypeBar';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { MobileTabBar } from './MobileTabBar';
export const AppShell = ({ children }) => {
    const { loggedIn, isMobile, chrome } = useHub();
    return (<div className={`app${isMobile ? ' m' : ''}`}>
      {chrome && <PrototypeBar />}

      {!loggedIn ? (children) : (<>
          <MobileHeader />
          <div className="shell">
            <Sidebar />
            <main className="main">
              <div className="main-in">{children}</div>
            </main>
          </div>
          <MobileTabBar />
        </>)}
    </div>);
};

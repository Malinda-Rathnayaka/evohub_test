import React from 'react';
import { HubProvider, useHub } from './context/HubContext';
import { AppShell } from './components/layout/AppShell';
import { ModalContainer } from './components/modals/ModalContainer';
import { Toast } from './components/common/Toast';
// Shared screens
import { LoginScreen } from './components/shared/LoginScreen';
import { ChangePasswordScreen } from './components/shared/ChangePasswordScreen';
import { NavigationMapScreen } from './components/shared/NavigationMapScreen';
import { DesignSystemScreen } from './components/shared/DesignSystemScreen';
// Admin screens
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProjectsList } from './components/admin/AdminProjectsList';
import { AdminCreateProject } from './components/admin/AdminCreateProject';
import { AdminProjectDetail } from './components/admin/AdminProjectDetail';
import { AdminDesignersList } from './components/admin/AdminDesignersList';
import { AdminDesignerDetail } from './components/admin/AdminDesignerDetail';
import { AdminAddDesigner } from './components/admin/AdminAddDesigner';
import { AdminPayments } from './components/admin/AdminPayments';
// Designer screens
import { DesignerHome } from './components/designer/DesignerHome';
import { DesignerBrief } from './components/designer/DesignerBrief';
import { DesignerBids } from './components/designer/DesignerBids';
import { DesignerProjects } from './components/designer/DesignerProjects';
import { DesignerWorkspace } from './components/designer/DesignerWorkspace';
import { DesignerEarnings } from './components/designer/DesignerEarnings';
import { DesignerProfile } from './components/designer/DesignerProfile';
const ScreenRenderer = () => {
    const { loggedIn, screen } = useHub();
    if (!loggedIn) {
        return <LoginScreen />;
    }
    switch (screen) {
        case 'a-dash':
            return <AdminDashboard />;
        case 'a-projects':
            return <AdminProjectsList />;
        case 'a-create':
            return <AdminCreateProject />;
        case 'a-project':
            return <AdminProjectDetail />;
        case 'a-designers':
            return <AdminDesignersList />;
        case 'a-designer':
            return <AdminDesignerDetail />;
        case 'a-add':
            return <AdminAddDesigner />;
        case 'a-payments':
            return <AdminPayments />;
        case 'd-home':
            return <DesignerHome />;
        case 'd-brief':
            return <DesignerBrief />;
        case 'd-bids':
            return <DesignerBids />;
        case 'd-projects':
            return <DesignerProjects />;
        case 'd-work':
            return <DesignerWorkspace />;
        case 'd-earnings':
            return <DesignerEarnings />;
        case 'd-profile':
            return <DesignerProfile />;
        case 'password':
            return <ChangePasswordScreen />;
        case 'map':
            return <NavigationMapScreen />;
        case 'system':
            return <DesignSystemScreen />;
        default:
            return <AdminDashboard />;
    }
};
const AppContent = () => {
    return (<AppShell>
      <ScreenRenderer />
      <ModalContainer />
      <Toast />
    </AppShell>);
};
export const App = () => {
    return (<HubProvider>
      <AppContent />
    </HubProvider>);
};
export default App;

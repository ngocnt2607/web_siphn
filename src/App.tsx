import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';
import StorageService from 'app/services/storage';
import React, { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import AuthGuard from 'routes/auth-guard';
import LoginGuard from 'routes/login-guard';
import LoadingComponent from 'shared/blocks/loading/loading.component';
import './styles/index.scss';

export const customTheme = createTheme({
  typography: {
    fontFamily: `'Inter', sans-serif`,
  },
});

const LoginRoute = React.lazy(() => import('app/modules/login/routing'));
const HomeRoute = React.lazy(() => import('app/modules/home/routing'));
const TrunkManagementRoute = React.lazy(
  () => import('app/modules/trunk-management/routing')
);
const CustomerManagementRoute = React.lazy(
  () => import('app/modules/customer-management/routing')
);

const HotlineRoute = React.lazy(
  () => import('app/modules/hotline-routing/routing')
);

const VirtualRoute = React.lazy(
  () => import('app/modules/virtual-routing/routing')
);

function App() {
  useEffect(() => {
    StorageService.init();
  }, []);
  return (
    <ThemeProvider theme={customTheme}>
      <Suspense fallback={<LoadingComponent open />}>
        <Routes>
          <Route
            path="/login/*"
            element={
              <LoginGuard>
                <LoginRoute />
              </LoginGuard>
            }
          />

          <Route
            path="/admin/home/*"
            element={
              <AuthGuard>
                <HomeRoute />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/trunk-management/*"
            element={
              <AuthGuard>
                <TrunkManagementRoute />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/customer-management/*"
            element={
              <AuthGuard>
                <CustomerManagementRoute />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/hotline-routing/*"
            element={
              <AuthGuard>
                <HotlineRoute />
              </AuthGuard>
            }
          />

          <Route
            path="/admin/virtual-routing/*"
            element={
              <AuthGuard>
                <VirtualRoute />
              </AuthGuard>
            }
          />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;

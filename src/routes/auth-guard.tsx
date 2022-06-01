import React from 'react';
import { useAppSelector } from 'app/services/redux/hooks';
import { selectUser } from 'app/services/redux/slices/user-slice';
import { Navigate, useLocation } from 'react-router-dom';
import DrawerLayout from 'shared/blocks/drawer-layout/drawer-layout.component';

function AuthGuard({ children }: { children: JSX.Element }) {
  const auth = useAppSelector(selectUser);
  const location = useLocation();

  if (auth.id) {
    return <DrawerLayout>{children}</DrawerLayout>;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
}

export default AuthGuard;

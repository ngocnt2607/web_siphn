import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TrunkManagementPage from './pages/trunk-management.component';
import TrunkDetailPage from './pages/trunk-detail.component';

export default function TrunkManagementRoute() {
  return (
    <Routes>
      <Route path="/" element={<TrunkManagementPage />} />
      <Route path="/detail/:groupCode/:trunkId" element={<TrunkDetailPage />} />
    </Routes>
  );
}

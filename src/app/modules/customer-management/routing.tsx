import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CustomerPage from './pages/customer-management/customer-management.component';
import HotlineDetailPage from './pages/hotline-detail/hotline-detail.component';
import VirtualDetailPage from './pages/virtual-detail/virtual-detail.component';

export default function CustomerManagementRoute() {
  return (
    <Routes>
      <Route
        path="/hotline-detail/:customerId/:hotlineGroupId"
        element={<HotlineDetailPage />}
      />
      <Route
        path="/virtual-detail/:customerId/:virtualGroupId"
        element={<VirtualDetailPage />}
      />
      <Route path="/" element={<CustomerPage />} />
    </Routes>
  );
}

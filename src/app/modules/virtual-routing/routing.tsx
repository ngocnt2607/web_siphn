import React from 'react';
import { Route, Routes } from 'react-router-dom';
import VirtualRoutingPage from './pages/virtual-routing.component';

export default function VirtualRoute() {
  return (
    <Routes>
      <Route path="/" element={<VirtualRoutingPage />} />
    </Routes>
  );
}

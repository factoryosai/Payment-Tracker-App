/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Parties } from './pages/Parties';
import { PartyLedger } from './pages/PartyLedger';
import { Bills } from './pages/Bills';
import { Payments } from './pages/Payments';
import { Reports } from './pages/Reports';

function PrivateRoute({ children, requireAdmin }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { profile } = useAuth();
  
  if (!profile) return <Navigate to="/login" />;
  if (requireAdmin && profile.role !== 'admin') return <Navigate to="/" />;
  
  return <>{children}</>;
}

function AppRoutes() {
  const { profile } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={profile ? <Navigate to="/" /> : <Login />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="parties" element={<Parties />} />
          <Route path="parties/:id" element={<PartyLedger />} />
          <Route path="bills" element={<Bills />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastProvider } from "./components/Toast";

import { SchemeProvider } from "./context/SchemeContext";

export default function App() {
  return (
    <SchemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to={localStorage.getItem("token") ? "/dashboard" : "/"} replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </SchemeProvider>
  );
}


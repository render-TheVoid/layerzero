import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MainLayout } from './layouts/MainLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute';

import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import VerificationSent from './pages/VerificationSent';
import EmailVerified from './pages/EmailVerified';
import TokenExpired from './pages/TokenExpired';
import ResendVerification from './pages/ResendVerification';
import UrlSummarizer from './pages/UrlSummarizer';
import DocSummarizer from './pages/DocSummarizer';
import Account from './pages/Account';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/verification-sent" element={<VerificationSent />} />
              <Route path="/email-verified" element={<EmailVerified />} />
              <Route path="/verify-email/:token" element={<EmailVerified />} />
              <Route path="/token-expired" element={<TokenExpired />} />

              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/resend-verification" element={<ResendVerification />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Navigate to="/dashboard/url" replace />} />
                <Route path="/dashboard/url" element={<UrlSummarizer />} />
                <Route path="/dashboard/doc" element={<DocSummarizer />} />
                <Route path="/dashboard/account" element={<Account />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
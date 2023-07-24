import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PrivateRoute } from './auth/PrivateRoute';
import { EmailVerificationLandingPage } from './pages/EmailVerificationLandingPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LogInPage } from './pages/LogInPage';
import { PasswordResetLandingPage } from './pages/PasswordResetLandingPage';
import { PleaseVerifyEmailPage } from './pages/PleaseVerifyEmailPage';
import { SignUpPage } from './pages/SignUpPage';
import { UserInfoPage } from './pages/UserInfoPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const AppRoutes = () => {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<PrivateRoute/>}>
                        <Route path="/" element={<UserInfoPage />} />
                    </Route>
                    <Route path="/login" element={<LogInPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/please-verify" element={<PleaseVerifyEmailPage />} />
                    <Route path="/verify-email/:verificationString" element={<EmailVerificationLandingPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password/:passwordResetCode" element={<PasswordResetLandingPage />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}
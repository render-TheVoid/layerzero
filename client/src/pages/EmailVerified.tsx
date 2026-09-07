import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { CheckCircle2, XCircle, Loader2, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import { toast } from 'sonner';

const EmailVerified: React.FC = () => {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(!!token);
  const [success, setSuccess] = useState<boolean>(!token);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        setLoading(true);
        await api.get(`/auth/user/verify/${token}`);
        setSuccess(true);
        toast.success("Email verified successfully!");
      } catch (err: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
        setSuccess(false);
        const msg = err.response?.data?.message || "Invalid or expired verification link.";
        setErrorMessage(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="flex flex-1 min-h-0 flex-col lg:items-center lg:justify-center bg-background px-6 py-10 md:py-12">
      <Card className="w-full max-w-md rounded-[4px] border border-border bg-surface p-4 md:p-6 text-center">
        {loading ? (
          <CardContent className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <CardTitle className="text-2xl font-heading font-medium tracking-tight text-foreground">
              Verifying your email...
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Please wait while we validate your verification token.
            </CardDescription>
          </CardContent>
        ) : success ? (
          <>
            <CardHeader className="flex flex-col items-center pb-4">
              <div className="w-14 h-14 rounded-[4px] bg-secondary border border-border flex items-center justify-center mb-4 text-emerald-500 dark:text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="kicker mb-3">Auth / Verification</p>
              <CardTitle className="text-3xl font-heading font-medium tracking-tight text-foreground">
                Email Verified!
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm mt-2">
                Your email address has been successfully verified. You can now access all features of Layerzero.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 pb-4">
              <div className="text-sm text-muted-foreground border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.2em]">
                Your account is active. Ready to sign in!
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-10 font-medium flex items-center justify-center gap-2"
              >
                Sign In to Your Account <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="flex flex-col items-center pb-4">
              <div className="w-14 h-14 rounded-[4px] bg-secondary border border-border flex items-center justify-center mb-4 text-destructive">
                <XCircle className="w-7 h-7" />
              </div>
              <p className="kicker mb-3">Auth / Verification</p>
              <CardTitle className="text-3xl font-heading font-medium tracking-tight text-foreground">
                Verification Failed
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm mt-2">
                {errorMessage || "The verification link is invalid or has expired."}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 pb-4">
              <p className="text-xs text-muted-foreground border-t border-border pt-4 font-mono uppercase tracking-[0.15em]">
                Verification tokens expire after 15 minutes. If your link has expired, you can request a new one.
              </p>
            </CardContent>

            <CardFooter className="flex flex-col space-y-3 pt-2">
              <Link to="/resend-verification" className="w-full">
                <Button className="w-full h-10 font-medium flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Request New Verification Link
                </Button>
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
                Back to Sign In
              </Link>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
};

export default EmailVerified;
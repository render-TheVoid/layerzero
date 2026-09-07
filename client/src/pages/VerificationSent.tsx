import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { MailCheck, ArrowLeft, RefreshCw } from 'lucide-react';

const VerificationSent: React.FC = () => {
  const location = useLocation();
  const email = location.state?.email;

  return (
    <div className="flex flex-1 min-h-0 flex-col lg:items-center lg:justify-center bg-background px-6 py-10 md:py-12">
      <Card className="w-full max-w-lg rounded-[4px] border border-border bg-surface p-4 md:p-6 text-center">
        <CardHeader className="flex flex-col items-center pb-4">
          <div className="w-14 h-14 rounded-[4px] bg-secondary border border-border flex items-center justify-center mb-4 text-foreground">
            <MailCheck className="w-6 h-6" />
          </div>
          <p className="kicker mb-3">Auth / Verification</p>
          <CardTitle className="text-3xl font-heading font-medium tracking-tight text-foreground">
            Check your email
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm max-w-md mt-2">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {email && (
            <div className="bg-secondary border border-border rounded-[4px] p-3.5 text-sm text-foreground flex items-center justify-center gap-2">
              <span className="text-muted-foreground">Sent to:</span>
              <span className="font-semibold text-foreground">{email}</span>
            </div>
          )}

          <div className="border-t border-border pt-4 text-left">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground mb-2">Next Steps</div>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-1">
              <li>Open your email client and find the message from Layerzero.</li>
              <li>Click the <strong className="text-foreground">Verify Email</strong> button inside.</li>
              <li>The link is valid for <strong className="text-foreground">15 minutes</strong>.</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-4">
          <Link to="/login" className="w-full">
            <Button className="w-full h-10 font-medium">Proceed to Sign In</Button>
          </Link>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-1">
            <span>Didn't receive the email?</span>
            <Link
              to="/resend-verification"
              state={{ email }}
              className="text-foreground font-medium hover:text-accent transition-colors inline-flex items-center gap-1 hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Resend Link
            </Link>
          </div>

          <Link to="/register" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-2">
            <ArrowLeft className="w-3 h-3" /> Back to registration
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerificationSent;
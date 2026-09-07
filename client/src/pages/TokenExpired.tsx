import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Clock, RefreshCw, ArrowLeft } from 'lucide-react';

const TokenExpired: React.FC = () => {
  return (
    <div className="flex flex-1 min-h-0 flex-col lg:items-center lg:justify-center bg-background px-6 py-10 md:py-12">
      <Card className="w-full max-w-md rounded-[4px] border border-border bg-surface p-4 md:p-6 text-center">
        <CardHeader className="flex flex-col items-center pb-4">
          <div className="w-14 h-14 rounded-[4px] bg-secondary border border-border flex items-center justify-center mb-4 text-destructive">
            <Clock className="w-7 h-7" />
          </div>
          <p className="kicker mb-3">Auth / Verification</p>
          <CardTitle className="text-3xl font-heading font-medium tracking-tight text-foreground">
            Link Expired
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-2">
            The verification link you clicked is invalid or has expired. For security reasons, verification tokens expire after 15 minutes.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2 pb-4">
          <div className="text-sm text-muted-foreground border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.2em]">
            Don't worry! You can request a new verification link to activate your account.
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3 pt-2">
          <Link to="/resend-verification" className="w-full">
            <Button className="w-full h-10 font-medium flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" /> Request New Verification Link
            </Button>
          </Link>
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TokenExpired;
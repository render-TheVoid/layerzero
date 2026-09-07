import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LOGIN_CAPABILITIES = [
  "01 / URL EXTRACTION",
  "02 / DOCUMENT PARSING",
  "03 / FOUR-PROVIDER ROUTING",
  "04 / PDF EXPORT",
];

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setUnverifiedEmail(null);
    try {
      await login(data);
      toast.success("Logged in successfully");
      navigate('/dashboard/url');
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      if (error.response?.status === 403 || error.response?.data?.message?.includes("Verify your email")) {
        setUnverifiedEmail(data.email);
        toast.error("Please verify your email address before logging in.");
      } else if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach((key) => {
          setError(key as any /* eslint-disable-line @typescript-eslint/no-explicit-any */, {
            type: "server",
            message: backendErrors[key][0],
          });
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to log in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col lg:items-center lg:justify-center bg-background px-6 py-10 md:py-12">
      <Card className="w-full max-w-4xl rounded-[4px] border border-border bg-surface gridlines md:grid md:grid-cols-5">
        {/* Identity panel */}
        <div className="hidden md:flex flex-col justify-between p-10 border-r border-border col-span-2">
          <div>
            <p className="font-heading text-2xl font-medium tracking-tight text-foreground">layerzero</p>
            <div className="rule my-6" />
            <p className="kicker">01 / Sign In</p>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed mt-4">
              Secure access to the control surface — extract, process, and summarize across four inference engines.
            </p>
          </div>
          <div className="space-y-2.5">
            {LOGIN_CAPABILITIES.map((cap) => (
              <p key={cap} className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {cap}
              </p>
            ))}
          </div>
          <div className="rule--tagged">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Hybrid Summarization</span>
          </div>
        </div>

        {/* Form panel */}
        <div className="col-span-3 p-8 md:p-10 flex flex-col justify-center bg-surface">
          <p className="kicker md:hidden mb-3">01 / Sign In</p>
          <h1 className="text-3xl font-heading font-medium tracking-tight text-foreground mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm font-sans mb-8">Enter your credentials to access layerzero</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            {unverifiedEmail && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-[4px] p-3.5 text-xs text-amber-600 dark:text-amber-400 space-y-2">
                <p className="font-semibold">Email Verification Required</p>
                <p>Your email address is not verified yet. Please check your inbox or resend the verification link.</p>
                <Link to="/resend-verification" state={{ email: unverifiedEmail }} className="inline-block font-bold underline hover:opacity-80">
                  Resend Verification Email →
                </Link>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">Email Address</Label>
              <Input id="email" type="email" placeholder="developer@layerzero.ai" {...register('email')} disabled={isLoading} />
              {errors.email && (
                <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">Password</Label>
                <Link to="/resend-verification" className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors">
                  Forgot?
                </Link>
              </div>
              <Input id="password" type="password" {...register('password')} disabled={isLoading} />
              {errors.password && (
                <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full h-10 font-medium mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <div className="pt-1 text-center text-sm text-muted-foreground font-sans">
              Don't have an account?{" "}
              <Link to="/register" className="text-foreground font-medium hover:text-accent transition-colors hover:underline">
                Create account →
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
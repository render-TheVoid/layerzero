import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2, MailCheck, ArrowLeft } from 'lucide-react';

const resendSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ResendFormValues = z.infer<typeof resendSchema>;

const ResendVerification: React.FC = () => {
  const { resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const defaultEmail = location.state?.email || '';

  const { register, handleSubmit, setError, formState: { errors } } = useForm<ResendFormValues>({
    resolver: zodResolver(resendSchema),
    defaultValues: {
      email: defaultEmail,
    }
  });

  const onSubmit = async (data: ResendFormValues) => {
    setIsLoading(true);
    try {
      await resendVerification(data.email);
      toast.success("Verification email sent successfully!");
      navigate('/verification-sent', { state: { email: data.email } });
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.keys(backendErrors).forEach((key) => {
          setError(key as any /* eslint-disable-line @typescript-eslint/no-explicit-any */, {
            type: "server",
            message: backendErrors[key][0],
          });
        });
      } else {
        const message = error.response?.data?.message || "Failed to send verification email";
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col lg:items-center lg:justify-center bg-background px-6 py-10 md:py-12">
      <Card className="w-full max-w-md rounded-[4px] border border-border bg-surface">
        <CardHeader className="text-left pb-2 px-6 pt-8 md:px-8 md:pt-10">
          <div className="w-12 h-12 rounded-[4px] bg-secondary border border-border flex items-center justify-center mb-4 text-foreground">
            <MailCheck className="w-5 h-5" />
          </div>
          <p className="kicker mb-3">Auth / Resend Verification</p>
          <CardTitle className="text-3xl font-heading font-medium tracking-tight text-foreground">Resend Verification</CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-2">
            Enter your registered email address and we'll send you a new verification link.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-3.5 px-6 md:px-8 py-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="developer@layerzero.ai"
                {...register('email')}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 px-6 pb-8 md:px-8 md:pb-10 pt-2 text-center">
            <Button type="submit" className="w-full h-10 flex items-center justify-center gap-2 font-medium" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send Verification Link
            </Button>
            <div className="flex items-center justify-between w-full pt-1 text-xs text-muted-foreground">
              <Link to="/login" className="hover:text-foreground inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Back to Sign In
              </Link>
              <Link to="/register" className="text-foreground font-semibold hover:text-accent transition-colors hover:underline">
                Create Account →
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResendVerification;
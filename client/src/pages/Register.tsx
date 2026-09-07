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

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const REGISTER_POINTS = [
  "URL EXTRACTION",
  "DOCUMENT PARSING",
  "FOUR-PROVIDER ROUTING",
  "PDF EXPORT",
];

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      toast.success("Account registered! Please check your email to verify.");
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
        toast.error(error.response?.data?.message || "Failed to create account");
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
            <p className="kicker">01 / Register</p>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed mt-4">
              Create a profile to issue the API keys and access the four inference engines from one control surface.
            </p>
          </div>
          <div className="space-y-2.5">
            {REGISTER_POINTS.map((cap, i) => (
              <p key={cap} className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                0{i + 1} / {cap}
              </p>
            ))}
          </div>
          <div className="rule--tagged">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-muted-foreground">Hybrid Summarization</span>
          </div>
        </div>

        {/* Form panel */}
        <div className="col-span-3 p-8 md:p-10 flex flex-col justify-center bg-surface">
          <p className="kicker md:hidden mb-3">01 / Register</p>
          <h1 className="text-3xl font-heading font-medium tracking-tight text-foreground mb-1">Create an account</h1>
          <p className="text-muted-foreground text-sm font-sans mb-8">Enter your details to get started with layerzero</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">Full Name</Label>
              <Input id="name" placeholder="John Doe" {...register('name')} disabled={isLoading} />
              {errors.name && (
                <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">Email Address</Label>
              <Input id="email" type="email" placeholder="developer@layerzero.ai" {...register('email')} disabled={isLoading} />
              {errors.email && (
                <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">Password</Label>
              <Input id="password" type="password" {...register('password')} disabled={isLoading} />
              {errors.password && (
                <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full h-10 font-medium mt-2" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Get Started
            </Button>
            <div className="pt-1 text-center text-sm text-muted-foreground font-sans">
              Already have an account?{" "}
              <Link to="/login" className="text-foreground font-medium hover:text-accent transition-colors hover:underline">
                Sign in here →
              </Link>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Register;
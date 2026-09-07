import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { toast } from 'sonner';
import { Loader2, TriangleAlert } from 'lucide-react';

const updateSchema = z
  .object({
    name: z.string().trim().min(3, { message: "Name must be at least 3 characters" }).max(45).optional(),
    email: z.string().trim().email({ message: "Invalid email address" }).optional(),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, { message: "Password must be at least 8 characters" }).optional(),
  })
  .refine((data) => data.newPassword ? !!data.currentPassword : true, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"],
  })
  .refine((data) => {
    const { name, email, newPassword } = data;
    return !!name || !!email || !!newPassword;
  }, {
    message: "At least one field must be provided to update",
    path: ["name"],
  });

type UpdateFormValues = z.infer<typeof updateSchema>;

const Account: React.FC = () => {
  const { user, updateAccount, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { register, handleSubmit, setError, reset, formState: { errors } } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: UpdateFormValues) => {
    setIsLoading(true);
    try {
      await updateAccount(data);
      const emailChanged = data.email && data.email !== user?.email;
      toast.success(
        emailChanged
          ? "Profile updated! Check your email to verify your new address."
          : "Account updated successfully"
      );
      reset({ name: user?.name, email: user?.email, currentPassword: '', newPassword: '' });
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
        toast.error(error.response?.data?.message || "Failed to update account");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    try {
      await deleteAccount();
      toast.success("Account deleted successfully");
      navigate('/');
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      setConfirmDelete(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-20">
      <div className="mb-12">
        <p className="kicker mb-4">03 / Account</p>
        <h1 className="text-3xl md:text-5xl font-heading font-medium tracking-tight text-foreground mb-2">Account</h1>
        <p className="text-muted-foreground text-base font-sans">Manage your profile, email, and password.</p>
      </div>

      <div className="border-t border-border">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-left px-0 pb-0 pt-8">
            <CardTitle className="text-lg font-heading font-medium tracking-tight text-foreground">Profile Details</CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-1">Update your name, email, or password.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 py-4 text-left">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-border pt-8">
                <div className="md:col-span-6">
                  <Label htmlFor="name" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...register('name')}
                    disabled={isLoading}
                    className="mt-2"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-2">{errors.name.message}</p>
                  )}
                </div>
                <div className="md:col-span-6">
                  <Label htmlFor="email" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="developer@layerzero.ai"
                    {...register('email')}
                    disabled={isLoading}
                    className="mt-2"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-2">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="border-t border-border mt-8 pt-8">
                <p className="text-sm font-medium text-foreground mb-1">Change Password</p>
                <p className="text-xs text-muted-foreground font-sans mb-6">Enter your current password along with a new one.</p>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
                  <div className="md:col-span-6">
                    <Label htmlFor="currentPassword" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register('currentPassword')}
                      disabled={isLoading}
                      className="mt-2"
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-2">{errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div className="md:col-span-6">
                    <Label htmlFor="newPassword" className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/70">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      {...register('newPassword')}
                      disabled={isLoading}
                      className="mt-2"
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-destructive font-medium pl-2 border-l-2 border-destructive mt-2">{errors.newPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t border-border mt-8 pt-8 flex items-center">
                <Button type="submit" className="h-10 px-6 font-medium" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12 rounded-[4px] border border-destructive/30 bg-destructive/5">
        <div className="px-6 py-6 md:px-8">
          <p className="kicker mb-6 text-destructive/70">03 / Danger Zone</p>

          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <h2 className="font-heading text-xl font-medium tracking-tight text-foreground flex items-center gap-2.5">
                <TriangleAlert className="h-4 w-4 text-destructive" strokeWidth={1.5} />
                Delete Account
              </h2>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-9 px-4 rounded-[4px] border-destructive text-destructive bg-transparent hover:bg-destructive/10 hover:text-destructive font-mono text-[10px] uppercase tracking-[0.15em]"
              >
                {isDeleting && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {confirmDelete ? "Click to Confirm" : "Delete Account ↗"}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground font-sans leading-relaxed max-w-2xl">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>

            {confirmDelete && (
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-destructive mt-1">
                / Confirm deletion to proceed. This is permanent.
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Account;
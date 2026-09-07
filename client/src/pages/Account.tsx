import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
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
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-light text-3xl tracking-tight text-foreground">Account</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your profile, email, and password.</p>
      </div>

      <Card className="rounded-2xl border border-border bg-card/90 backdrop-blur-md shadow-xl">
        <CardHeader className="text-left pb-2">
          <CardTitle className="text-2xl font-heading font-medium tracking-tight text-foreground">Profile Details</CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">Update your name, email, or password.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 py-3 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                {...register('name')}
                disabled={isLoading}
                className="rounded-lg h-10"
              />
              {errors.name && (
                <p className="text-sm text-red-600 font-medium pl-2 border-l-2 border-red-600 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="developer@layerzero.ai"
                {...register('email')}
                disabled={isLoading}
                className="rounded-lg h-10"
              />
              {errors.email && (
                <p className="text-sm text-red-600 font-medium pl-2 border-l-2 border-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm font-semibold text-foreground mb-1">Change Password</p>
              <p className="text-xs text-muted-foreground mb-4">Enter your current password along with a new one.</p>
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('currentPassword')}
                  disabled={isLoading}
                  className="rounded-lg h-10"
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-600 font-medium pl-2 border-l-2 border-red-600 mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5 pt-3">
                <Label htmlFor="newPassword" className="text-xs uppercase tracking-wider font-semibold text-foreground/80">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register('newPassword')}
                  disabled={isLoading}
                  className="rounded-lg h-10"
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-600 font-medium pl-2 border-l-2 border-red-600 mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex items-center px-6 pb-6 md:px-8 md:pb-8 pt-2">
            <Button type="submit" className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground hover:opacity-90 h-10 font-medium" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="rounded-2xl border border-red-600/30 bg-red-500/5 backdrop-blur-md">
        <CardHeader className="text-left pb-2">
          <CardTitle className="text-2xl font-heading font-medium tracking-tight text-red-600 dark:text-red-400 flex items-center gap-2">
            <TriangleAlert className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm mt-1">
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardFooter className="px-6 pb-6 md:px-8 md:pb-8 pt-2 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            {confirmDelete
              ? "Are you sure? This will permanently remove your account. Click again to confirm."
              : "Once you delete your account, there is no going back."}
          </p>
          <Button
            variant="destructive"
            className="rounded-full h-10 font-medium"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmDelete ? "Click to Confirm" : "Delete Account"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Account;

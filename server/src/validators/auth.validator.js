import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().trim().min(3).max(45),
    email: z.string().trim()
        .email("Enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
});

export const loginSchema = z.object({
    email: z.string().trim()
        .email("Enter a valid email address"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
});

export const updateAccountSchema = z.object({
    name: z.string().trim().min(3).max(45).optional(),
    email: z.string().trim()
        .email("Enter a valid email address").optional(),
    currentPassword: z
        .string()
        .min(8, "Current password must be at least 8 characters long")
        .optional(),
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters long")
        .optional(),
}).refine((data) => data.newPassword ? data.currentPassword : true, {
    message: "Current password is required to set a new password",
    path: ["currentPassword"]
}).refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
    path: []
});
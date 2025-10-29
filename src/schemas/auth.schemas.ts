import z from "zod";

export const signinSchema = z.object({
  email: z.email().min(1, "Email is required.").nonempty("Email is required."),
  password: z.string().nonempty("Password is required."),
});

export const signupSchema = z.object({
  email: z.email().min(1, "Email is required.").nonempty("Email is required."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(32, "Password must be at most 32 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    ),
});

export type SigninSchema = z.infer<typeof signinSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;

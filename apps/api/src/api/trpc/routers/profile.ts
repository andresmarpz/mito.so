import z from "zod";
import { protectedProcedure, publicProcedure, trpcRouter } from "../init";
import { ProfileService } from "../../../services/profile";
import { TRPCError } from "@trpc/server";

export const profileRouter = trpcRouter({
  /**
   * Get the current user's profile
   */
  get: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ProfileService.getProfileByUserId(ctx.user!.id);
    return profile;
  }),

  /**
   * Get a profile by username (public endpoint)
   */
  getByUsername: publicProcedure
    .input(
      z.object({
        username: z.string().min(1).max(50),
      })
    )
    .query(async ({ input }) => {
      const profile = await ProfileService.getProfileByUsername(input.username);
      if (!profile) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Profile not found",
        });
      }
      return profile;
    }),

  /**
   * Create a profile for the authenticated user
   */
  create: protectedProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3)
          .max(30)
          .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
        full_name: z.string().min(1).max(100).optional().nullable(),
        avatar_url: z.string().url().optional().nullable(),
        bio: z.string().max(500).optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if user already has a profile
      const existingProfile = await ProfileService.getProfileByUserId(ctx.user!.id);
      if (existingProfile) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Profile already exists for this user",
        });
      }

      // Check username availability
      const isAvailable = await ProfileService.checkUsernameAvailability(input.username);
      if (!isAvailable) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username is already taken",
        });
      }

      // Create the profile
      const profile = await ProfileService.createProfile(ctx.user!.id, {
        username: input.username,
        full_name: input.full_name,
        avatar_url: input.avatar_url,
        bio: input.bio,
      });

      return profile;
    }),

  /**
   * Update the authenticated user's profile
   */
  update: protectedProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3)
          .max(30)
          .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
          .optional(),
        full_name: z.string().min(1).max(100).optional().nullable(),
        avatar_url: z.string().url().optional().nullable(),
        bio: z.string().max(500).optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedProfile = await ProfileService.updateProfile(ctx.user!.id, input);
        
        if (!updatedProfile) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Profile not found",
          });
        }

        return updatedProfile;
      } catch (error) {
        if (error instanceof Error && error.message === "Username is already taken") {
          throw new TRPCError({
            code: "CONFLICT",
            message: error.message,
          });
        }
        throw error;
      }
    }),

  /**
   * Check if a username is available
   */
  checkUsername: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3)
          .max(30)
          .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
      })
    )
    .query(async ({ input }) => {
      const isAvailable = await ProfileService.checkUsernameAvailability(input.username);
      return { available: isAvailable };
    }),
});
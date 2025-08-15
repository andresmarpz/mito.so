import { eq } from "drizzle-orm";
import { db } from "../db";
import { profiles, type Profile, type ProfileInsert } from "../db/schema";

export interface ProfileUpdateData {
  username?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
}

export class ProfileService {
  /**
   * Get profile by user ID
   */
  static async getProfileByUserId(userId: string): Promise<Profile | null> {
    const result = await db.query.profiles.findFirst({
      where: eq(profiles.user_id, userId),
    });

    return result || null;
  }

  /**
   * Get profile by username
   */
  static async getProfileByUsername(username: string): Promise<Profile | null> {
    const result = await db.query.profiles.findFirst({
      where: eq(profiles.username, username),
    });

    return result || null;
  }

  /**
   * Create a new profile for a user
   */
  static async createProfile(
    userId: string,
    data: {
      username: string;
      full_name?: string | null;
      avatar_url?: string | null;
      bio?: string | null;
    }
  ): Promise<Profile> {
    const [profile] = await db
      .insert(profiles)
      .values({
        user_id: userId,
        username: data.username,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
      })
      .returning();

    return profile;
  }

  /**
   * Update an existing profile
   */
  static async updateProfile(
    userId: string,
    data: ProfileUpdateData
  ): Promise<Profile | null> {
    const existingProfile = await this.getProfileByUserId(userId);
    if (!existingProfile) {
      return null;
    }

    // Check username availability if username is being changed
    if (data.username && data.username !== existingProfile.username) {
      const usernameExists = await this.checkUsernameAvailability(data.username);
      if (!usernameExists) {
        throw new Error("Username is already taken");
      }
    }

    const [updatedProfile] = await db
      .update(profiles)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(profiles.user_id, userId))
      .returning();

    return updatedProfile;
  }

  /**
   * Check if a username is available
   * Returns true if available, false if taken
   */
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    const existingProfile = await this.getProfileByUsername(username);
    return !existingProfile;
  }

  /**
   * Delete a profile (if needed)
   */
  static async deleteProfile(userId: string): Promise<boolean> {
    const result = await db
      .delete(profiles)
      .where(eq(profiles.user_id, userId))
      .returning();

    return result.length > 0;
  }
}
/**
 * Audit Logger
 * Logs critical security and authentication events for user review.
 */
import { prisma } from "@/lib/prisma/client";

export type ActivityAction = 
  | "login" 
  | "logout" 
  | "password_changed" 
  | "profile_updated" 
  | "email_changed"
  | "account_deleted";

export async function logActivity({
  profileId,
  action,
  metadata = {},
}: {
  profileId: string;
  action: ActivityAction;
  metadata?: Record<string, any>;
}) {
  try {
    await prisma.activityLog.create({
      data: {
        profile_id: profileId,
        action,
        metadata,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Do not throw; audit logging shouldn't crash the main flow if it fails
  }
}

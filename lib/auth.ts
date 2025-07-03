import { db } from "@/database/drizzle";
import {
  account_table,
  session_table,
  user_table,
  verification_table,
} from "@/database/schema";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { eq } from "drizzle-orm";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user_table,
      session: session_table,
      account: account_table,
      verification: verification_table,
    },
  }),
  advanced: {
    cookies: {
      session_token: {
        name: "auth_session_token",
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["github", "google"],
      allowDifferentEmails: false,
      allowUnlinkingAll: false,
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  session: {
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 5 * 60,
    // },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // day (every 1 day the session expiration is updated)
    // freshAge: 0,
    // disableSessionRefresh: true
  },
  user: {
    deleteUser: {
      enabled: true,
      afterDelete: async (user) => {
        await db.delete(user_table).where(eq(user_table.id, user.id));
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin", "superadmin"],
      impersonationSessionDuration: 60 * 60 * 24, // 1 day
    }),
  ],
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;

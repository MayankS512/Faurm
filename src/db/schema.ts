import {
  mysqlTable,
  serial,
  varchar,
  int,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { InferModel } from "drizzle-orm";

// Users
export const users = mysqlTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 40 }).notNull(),
    emailVerified: timestamp("email_verified"),
    name: varchar("name", { length: 40 }),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("user_id_unique").on(users.id),
    };
  }
);

// Accounts
export const accounts = mysqlTable("accounts", {
  id: serial("id").primaryKey(),
  userId: int("user_id").references(() => users.id),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  type: text("type").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  // Should be date / timestamp? date('expiresAt') / timestamp('expiresAt')
  expiresAt: int("expiresAt"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
});

// Sessions
export const sessions = mysqlTable("sessions", {
  id: serial("id").primaryKey(),
  sessionToken: text("session_token").notNull(),
  userId: int("user_id")
    .references(() => users.id)
    .notNull(),
  expires: timestamp("expires").notNull(),
});

// Types
export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, "insert">;
export type Account = InferModel<typeof accounts>;
export type NewAccount = InferModel<typeof accounts, "insert">;
export type Session = InferModel<typeof sessions>;
export type NewSession = InferModel<typeof sessions, "insert">;

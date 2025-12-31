// this middleware is used to process API requests using admin privileges to Appwrite to give access to new users

/**
 * createAdminClient — server-only helper to create an Appwrite admin client.
 *
 * This module is intended to run only on the server (`import "server-only"`).
 * It constructs a `Client` configured with the project endpoint and an
 * administrative API key (from environment variables) and returns an
 * object exposing Appwrite SDK instances (currently `account`) for
 * performing privileged operations such as creating users.
 *
 * Required environment variables:
 * - `NEXT_PUBLIC_APPWRITE_ENDPOINT` — Appwrite server endpoint
 * - `NEXT_PUBLIC_APPWRITE_PROJECT`  — Appwrite project ID
 * - `NEXT_APPWRITE_KEY`            — Admin API key (keep secret; server-only)
 *
 * Example usage (server route):
 * ```ts
 * const { account } = await createAdminClient();
 * await account.create(...)
 * ```
 */

import "server-only";

import { Client, Account, Users, Databases } from "node-appwrite";
import { cookies } from "next/headers";
import { AUTH_COOKIE } from "./auth/constants";

export const createSessionClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = cookies().get(AUTH_COOKIE);
  if (!session || !session.value) throw new Error("Unauthorized");

  client.setSession(session.value);

  const account = new Account(client);
  const databases = new Databases(client);
  return { account, databases };
  // return {
  //   get account() {
  //     return new Account(client);
  //   },
  //   get databases() {
  //     return new Databases(client);
  //   },
  // };
};

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  const account = new Account(client);
  const users = new Users(client);
  const databases = new Databases(client);
  return { account, users, databases };
  // return {
  //   get account() {
  //     return new Account(client);
  //   },
  // };
};

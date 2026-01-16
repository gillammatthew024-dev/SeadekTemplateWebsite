import { getToken} from "next-auth/jwt";
import { authOptions } from "./options";
import { NextRequest } from "next/server";

export async function getSession(
  req: NextRequest,
) {
  return await getToken({req, secret: process.env.NEXTAUTH_SECRET});
}

export async function needsAdmin(
  req: NextRequest,
): Promise<boolean> {
  const session = await getSession(req);

  if (!session) {
    console.log("No session or user", session);
    return false;
  }

  // Optional: real admin check if you store role
  // return session.user.role === "admin";

  return true;
}

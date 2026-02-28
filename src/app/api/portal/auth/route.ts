import { NextResponse } from "next/server";
import { getAPIUser } from "@/lib/auth-sap";

export async function GET() {
  const user = await getAPIUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}

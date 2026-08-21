import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    throw new Error("MySafeVault Sentry Test Error from Server Route!");
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ message: "Sentry error triggered and sent!" }, { status: 500 });
  }
}

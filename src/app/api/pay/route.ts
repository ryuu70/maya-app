import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  void request;
  return NextResponse.json({ success: false, message: "決済APIは未実装です" }, { status: 501 });
} 
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  const event = await request.json();
  // Pay.jpのイベント種別
  const type = event.type;
  const obj = event.data?.object;

  // 顧客ID・サブスクID取得
  const customerId = obj?.customer;
  const subscriptionId = obj?.id;
  let status = obj?.status;

  // 顧客IDがなければ何もしない
  if (!customerId) {
    return NextResponse.json({ error: "customerIdがありません" }, { status: 400 });
  }

  // サブスクリプション系イベント
  if (type === "subscription.canceled" || type === "subscription.deleted") {
    // サブスク解約
    await prisma.user.updateMany({
      where: { payjpCustomerId: customerId },
      data: {
        isPaid: false,
        subscriptionStatus: "canceled",
      },
    });
  } else if (type === "subscription.updated") {
    // サブスク更新（status: active, trialing, past_due, canceled, unpaid など）
    await prisma.user.updateMany({
      where: { payjpCustomerId: customerId },
      data: {
        subscriptionStatus: status,
        isPaid: status === "active" || status === "trialing",
      },
    });
  } else if (type === "charge.failed") {
    // 支払い失敗
    await prisma.user.updateMany({
      where: { payjpCustomerId: customerId },
      data: {
        isPaid: false,
        subscriptionStatus: "unpaid",
      },
    });
  } else if (type === "charge.succeeded") {
    // 支払い成功
    await prisma.user.updateMany({
      where: { payjpCustomerId: customerId },
      data: {
        isPaid: true,
        subscriptionStatus: "active",
      },
    });
  }

  return NextResponse.json({ received: true });
} 
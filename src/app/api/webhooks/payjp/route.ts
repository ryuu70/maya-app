import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// Pay.jp Webhook用エンドポイント
export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    // Pay.jpのイベント種別
    const eventType = event.type;
    // 顧客情報
    const customer = event.data?.object?.customer;
    // サブスクリプション情報
    const subscription = event.data?.object;
    // 顧客メール（Pay.jpのcustomerオブジェクトにemailが含まれる）
    let customerEmail = null;
    if (customer && typeof customer === "object" && customer.email) {
      customerEmail = customer.email;
    } else if (subscription && subscription.customer && subscription.customer.email) {
      customerEmail = subscription.customer.email;
    } else if (event.data?.object?.email) {
      customerEmail = event.data.object.email;
    }

    if (!customerEmail) {
      return NextResponse.json({ error: "顧客メールが特定できません" }, { status: 400 });
    }

    // ユーザーを検索
    const user = await prisma.user.findUnique({ where: { email: customerEmail } });
    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }

    // イベント種別ごとにDBを更新
    let updateData: any = {};
    let logMsg = "";
    switch (eventType) {
      case "customer.subscription.created":
      case "customer.subscription.resumed":
      case "customer.subscription.updated":
        updateData = {
          isPaid: true,
          subscriptionStatus: subscription.status || "active",
        };
        logMsg = "サブスクリプション作成/更新/再開";
        break;
      case "customer.subscription.canceled":
      case "customer.subscription.deleted":
        updateData = {
          isPaid: false,
          subscriptionStatus: "canceled",
        };
        logMsg = "サブスクリプション解約/削除";
        break;
      case "invoice.payment_failed":
        updateData = {
          isPaid: false,
          subscriptionStatus: "payment_failed",
        };
        logMsg = "支払い失敗";
        break;
      case "invoice.payment_succeeded":
        updateData = {
          isPaid: true,
          subscriptionStatus: "active",
        };
        logMsg = "支払い成功";
        break;
      default:
        return NextResponse.json({ error: `未対応のイベントタイプ: ${eventType}` }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: customerEmail },
      data: updateData,
    });

    console.log(`✅ [Pay.jp Webhook] ${logMsg}:`, {
      email: updatedUser.email,
      isPaid: updatedUser.isPaid,
      subscriptionStatus: updatedUser.subscriptionStatus,
      eventType,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Pay.jp Webhook処理エラー:", error);
    return NextResponse.json({ error: "Pay.jp Webhook処理に失敗しました" }, { status: 500 });
  }
} 
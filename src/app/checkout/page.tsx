"use client";

import React, { useEffect, useRef, useState } from "react";
import type PayjpJs from "typedef-payjp-js";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Suspense } from "react";

declare global {
  interface Window {
    Payjp?: (key: string) => PayjpJs.Payjp;
    __payjpInstance__?: PayjpJs.Payjp;
  }
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutPageContent />
    </Suspense>
  );
}

function CheckoutPageContent() {
  const { data: session } = useSession();
  // --- 初回表示時のみ自動リロード ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!sessionStorage.getItem("checkout_reloaded")) {
        sessionStorage.setItem("checkout_reloaded", "1");
        window.location.reload();
      }
    }
  }, []);

  const [payjp, setPayjp] = useState<PayjpJs.Payjp | null>(null);

  const numberRef = useRef<PayjpJs.PayjpElement | null>(null);
  const expiryRef = useRef<PayjpJs.PayjpElement | null>(null);
  const cvcRef = useRef<PayjpJs.PayjpElement | null>(null);

  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  // pay.jsのscriptを公式CDNから読み込む
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Payjp) return; // すでに読み込み済みなら何もしない

    const script = document.createElement("script");
    script.src = "https://js.pay.jp/v2/pay.js";
    script.async = true;
    script.onload = () => {
      // 読み込み完了後にPayjpインスタンスを作成
      const publicKey = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY || "";
      window.__payjpInstance__ = window.Payjp!(publicKey);
      setPayjp(window.__payjpInstance__!);
    };
    document.body.appendChild(script);

    // クリーンアップ
    return () => {
      script.remove();
    };
  }, []);

  // Payjpインスタンスができたらカード要素をmount
  useEffect(() => {
    if (!payjp) return;

    const elements = payjp.elements();

    if (!numberRef.current) {
      const numberElement = elements.create("cardNumber");
      numberElement.mount("#number-form");
      numberRef.current = numberElement;
    }

    if (!expiryRef.current) {
      const expiryElement = elements.create("cardExpiry");
      expiryElement.mount("#expiry-form");
      expiryRef.current = expiryElement;
    }

    if (!cvcRef.current) {
      const cvcElement = elements.create("cardCvc");
      cvcElement.mount("#cvc-form");
      cvcRef.current = cvcElement;
    }

    return () => {
      numberRef.current?.unmount();
      expiryRef.current?.unmount();
      cvcRef.current?.unmount();
      numberRef.current = null;
      expiryRef.current = null;
      cvcRef.current = null;
    };
  }, [payjp]);

  const getToken = async () => {
    if (!payjp || !numberRef.current) {
      alert("カードフォームが初期化されていません");
      return;
    }

    const result = await payjp.createToken(numberRef.current);
    if (result.error) {
      alert(`エラー: ${result.error.message}`);
    } else {
      // サーバーへの送信処理
      alert(`Token取得成功: ${result.id}`);
      try {
        const email = session?.user?.email;
        if (!email) {
          alert("ログインしていません。メールアドレスが取得できません。");
          return;
        }
        if (!plan) {
          alert("プランが選択されていません");
          return;
        }
        // 1. 顧客作成/検索
        const customerRes = await fetch("/api/payjp/customer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token: result.id }),
        });
        const customerData = await customerRes.json();
        if (!customerData.customer?.id) {
          alert("顧客作成に失敗しました: " + (customerData.error || ""));
          return;
        }
        // 2. サブスクリプション作成
        const subscribeRes = await fetch("/api/payjp/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: customerData.customer.id, planId: plan }),
        });
        const subscribeData = await subscribeRes.json();
        if (!subscribeData.subscription?.id) {
          alert("サブスクリプション作成に失敗しました: " + (subscribeData.error || ""));
          return;
        }
        alert("サブスクリプション決済が完了しました！");
      } catch (e: any) {
        alert("通信エラー: " + (e?.message || e));
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold text-black mb-4">お支払い情報</h2>
      {plan && (
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-center font-semibold">
          選択中のプラン: {plan === "premium" ? "神託プレミアム" : "星読みベーシック"}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm text-black font-medium mb-1">カード番号</label>
        <div id="number-form" className="p-3 border rounded bg-gray-50" />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm text-black font-medium mb-1">有効期限</label>
          <div id="expiry-form" className="p-3 border rounded bg-gray-50" />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-black font-medium mb-1">セキュリティコード</label>
          <div id="cvc-form" className="p-3 border rounded bg-gray-50" />
        </div>
      </div>

      <button
        onClick={getToken}
        className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
      >
        ¥3,000を支払う
      </button>
    </div>
  );
}

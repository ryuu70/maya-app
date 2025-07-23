"use client";
import React, { useEffect, useRef, useState } from "react";
import type PayjpJs from "typedef-payjp-js";

declare global {
  interface Window {
    Payjp?: (key: string) => PayjpJs.Payjp;
    __payjpInstance__?: PayjpJs.Payjp;
  }
}

export default function CheckoutButton() {
  const [payjp, setPayjp] = useState<PayjpJs.Payjp | null>(null);
  const [ready, setReady] = useState(false);

  const numberRef = useRef<PayjpJs.PayjpElement | null>(null);
  const expiryRef = useRef<PayjpJs.PayjpElement | null>(null);
  const cvcRef = useRef<PayjpJs.PayjpElement | null>(null);

  // Payjpインスタンスを1回だけ作る
  useEffect(() => {
    if (typeof window === "undefined" || !window.Payjp) return;

    if (!window.__payjpInstance__) {
      const publicKey = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY || "";
      window.__payjpInstance__ = window.Payjp(publicKey);
    }

    setPayjp(window.__payjpInstance__!);
    setReady(true);
  }, []);

  // カード要素を1回だけmountする
  useEffect(() => {
    if (!payjp || !ready) return;

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
  }, [payjp, ready]);

  const getToken = async () => {
    if (!payjp || !numberRef.current) {
      alert("カードフォームが初期化されていません");
      return;
    }

    const result = await payjp.createToken(numberRef.current);
    if ((result as any).error) {
      alert(`エラー: ${(result as any).error.message}`);
    } else {
      alert(`Token取得成功: ${(result as any).id}`);
      // サーバーへの送信処理はここで書く
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">お支払い情報</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">カード番号</label>
        <div id="number-form" className="p-3 border rounded bg-gray-50" />
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">有効期限</label>
          <div id="expiry-form" className="p-3 border rounded bg-gray-50" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">セキュリティコード</label>
          <div id="cvc-form" className="p-3 border rounded bg-gray-50" />
        </div>
      </div>

      <button
        onClick={getToken}
        className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
      >
        トークンを取得
      </button>
    </div>
  );
} 
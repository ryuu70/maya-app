"use client";
import { useEffect, useRef, useState } from "react";
import type PayjpJs from "typedef-payjp-js";

declare global {
  interface Window {
    Payjp?: (key: string) => PayjpJs.Payjp;
    __payjpInstance__?: PayjpJs.Payjp;
  }
}

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({ className }: CheckoutButtonProps) {
  const [payjp, setPayjp] = useState<PayjpJs.Payjp | null>(null);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const publicKey = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY || "";

  const numberRef = useRef<PayjpJs.PayjpElement | null>(null);
  const expiryRef = useRef<PayjpJs.PayjpElement | null>(null);
  const cvcRef = useRef<PayjpJs.PayjpElement | null>(null);

  // payjp.jsのscriptを読み込む
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Payjp) return;
    const script = document.createElement("script");
    script.src = "/payjp.js";
    script.async = true;
    script.onload = () => {
      setReady(true);
    };
    document.body.appendChild(script);
  }, []);

  // Payjpインスタンス生成
  useEffect(() => {
    if (!window.Payjp || !publicKey) return;
    if (!window.__payjpInstance__) {
      window.__payjpInstance__ = window.Payjp(publicKey);
    }
    setPayjp(window.__payjpInstance__!);
    setReady(true);
  }, [publicKey]);

  // カード要素をmount
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
      setError("カードフォームが初期化されていません");
      return;
    }
    setLoading(true);
    setError(null);
    const result = await payjp.createToken(numberRef.current);
    setLoading(false);
    if ((result as any).error) {
      setError((result as any).error.message);
    } else {
      setToken((result as any).id);
    }
  };

  const handlePay = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      window.location.href = "/thanks";
    } else {
      setError("決済に失敗しました: " + (data.message || ""));
    }
  };

  if (!publicKey) {
    return <div style={{color: 'red', fontWeight: 700}}>Pay.jp公開鍵が設定されていません。管理者にご連絡ください。</div>;
  }

  return (
    <div className={className}>
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
        disabled={loading}
        className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
        style={{marginBottom: 16}}
      >
        カード情報送信
      </button>
      <div style={{marginTop: 8, color: '#333', fontSize: 12}}>トークン: {token ?? '(未取得)'}</div>
      <button
        type="button"
        onClick={handlePay}
        disabled={!token || loading}
        style={{
          marginTop: 16,
          background: !token ? '#ccc' : '#6366f1',
          color: '#fff',
          padding: '10px 32px',
          border: 'none',
          borderRadius: 4,
          fontWeight: 700,
          fontSize: 16,
          cursor: !token ? 'not-allowed' : 'pointer'
        }}
      >
        決済する
      </button>
      {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
    </div>
  );
} 
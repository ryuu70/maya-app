"use client";
import { useEffect, useRef, useState } from "react";

interface CheckoutButtonProps {
  className?: string;
}

export default function CheckoutButton({ className }: CheckoutButtonProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const publicKey = process.env.NEXT_PUBLIC_PAYJP_PUBLIC_KEY || "";

  useEffect(() => {
    if (!formRef.current) return;
    if (!publicKey) {
      console.warn("Pay.jp公開鍵が設定されていません。NEXT_PUBLIC_PAYJP_PUBLIC_KEYを環境変数で指定してください。");
      return;
    }
    if (formRef.current.querySelector("#payjp-checkout-script")) return;

    const script = document.createElement("script");
    script.src = "https://checkout.pay.jp/";
    script.className = "payjp-button";
    script.setAttribute("data-key", publicKey);
    script.setAttribute("data-partial", "true");
    script.id = "payjp-checkout-script";
    formRef.current.appendChild(script);

    const handler = function (e: any) {
      setToken(e.detail.token);
      console.log("Payjp token created:", e.detail.token);
    };
    window.addEventListener("payjp_token_created", handler);
    return () => {
      window.removeEventListener("payjp_token_created", handler);
    };
  }, []); // 依存配列を空にして初回のみ実行

  const handlePay = async () => {
    if (!token) return;
    setLoading(true);
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
      alert("決済に失敗しました: " + (data.message || ""));
    }
  };

  if (!publicKey) {
    return <div style={{color: 'red', fontWeight: 700}}>Pay.jp公開鍵が設定されていません。管理者にご連絡ください。</div>;
  }

  return (
    <div>
      <form ref={formRef} action="#" method="POST" className={className} onSubmit={e => e.preventDefault()}>
        {loading && <div>決済処理中...</div>}
        {/* Pay.jpボタンはscriptで動的に挿入 */}
      </form>
      {/* tokenの値を画面に必ず表示 */}
      <div style={{marginTop: 8, color: '#333', fontSize: 12}}>トークン: {token ?? '(未取得)'}</div>
      {/* 決済ボタンは常に表示し、tokenがなければdisabled */}
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
    </div>
  );
} 
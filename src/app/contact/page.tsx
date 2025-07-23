import React from "react";

export default function ContactPage() {
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>お問い合わせ</h1>
      <p style={{ marginBottom: 24 }}>ご質問・ご要望などございましたら、下記フォームよりご連絡ください。</p>
      <form>
        <div style={{ marginBottom: 16 }}>
          <label>お名前<br /><input type="text" name="name" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }} /></label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>メールアドレス<br /><input type="email" name="email" style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }} /></label>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>お問い合わせ内容<br /><textarea name="message" rows={5} style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc" }} /></label>
        </div>
        <button type="submit" style={{ background: "#6366f1", color: "#fff", padding: "10px 32px", border: "none", borderRadius: 4, fontWeight: 700, fontSize: 16 }}>送信</button>
      </form>
    </div>
  );
} 
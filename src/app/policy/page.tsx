"use client";

export default function PolicyPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
      <p className="mb-4">本サービス（マヤ占い）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. 取得する情報</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>氏名、メールアドレス、誕生日など、登録時にご入力いただく情報</li>
        <li>サービス利用時に自動的に取得される情報（アクセスログ、Cookie等）</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. 利用目的</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>サービス提供・本人確認・お問い合わせ対応</li>
        <li>サービス改善・新機能開発・ご案内の送付</li>
        <li>法令遵守等</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. 第三者提供</h2>
      <p className="mb-4">法令に基づく場合を除き、本人の同意なく第三者に個人情報を提供しません。</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. 安全管理</h2>
      <p className="mb-4">個人情報の漏洩・滅失・毀損の防止に努め、適切な管理を行います。</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. お問い合わせ</h2>
      <p className="mb-4">個人情報の開示・訂正・削除等のご要望は、お問い合わせフォームよりご連絡ください。</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">6. 改定</h2>
      <p>本ポリシーは必要に応じて改定する場合があります。改定時は本ページでお知らせします。</p>
      <div className="mt-8 text-sm text-gray-500">2024年7月 改定</div>
    </div>
  );
} 
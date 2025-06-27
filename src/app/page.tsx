import Image from "next/image";

export default function Home() {
  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">生年月日から運命を読み解きましょう</h2>
      <p className="mb-6">マヤ暦に基づくKINナンバーや相性、人生年表を自動解析します。</p>
      <a
        href="/fortune"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
      >
        占いを始める
      </a>
    </div>
  );
}

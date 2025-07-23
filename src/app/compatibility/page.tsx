"use client";
import { useState } from "react";
import { getKakeByKin } from "../lib/kake";
import { getKinNumber } from "../lib/kin";

// 誕生日から現在までの経過日数分だけKINを進める関数
function getCurrentKinNumber(birthday: string): number | null {
  if (!birthday) return null;
  const baseKin = getKinNumber(birthday);
  if (!baseKin) return null;
  const birthDate = new Date(birthday);
  const today = new Date();
  // 日付差分（日数）
  const diffDays = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  // KINは260でループ
  return ((baseKin - 1 + diffDays) % 260) + 1;
}

export default function CompatibilityPage() {
  // 誕生日（YYYY-MM-DD）
  const [birthday1, setBirthday1] = useState("");
  const [birthday2, setBirthday2] = useState("");
  // KINナンバー（自動算出）
  const kin1 = getCurrentKinNumber(birthday1);
  const kin2 = getCurrentKinNumber(birthday2);
  const [result, setResult] = useState<null | {
    kake1: any;
    kake2: any;
    comment: string;
  }>(null);

  const handleJudge = () => {
    if (!kin1 || !kin2) {
      setResult({
        kake1: null,
        kake2: null,
        comment: "どちらかの誕生日が正しくありません。"
      });
      return;
    }
    const kake1 = getKakeByKin(Number(kin1));
    const kake2 = getKakeByKin(Number(kin2));
    let comment = "";
    if (!kake1 || !kake2) {
      comment = "どちらかのKINに該当する卦が見つかりません。";
    } else if (kake1.No === kake2.No) {
      comment = "同じ卦なので、価値観や性質がとても似ています。お互いに理解しやすい関係です。";
    } else if (Math.abs(Number(kake1.No) - Number(kake2.No)) === 1) {
      comment = "隣り合う卦なので、刺激し合いながらもバランスが取れる関係です。";
    } else {
      comment = "異なる卦同士ですが、違いを認め合うことで良い関係を築けます。";
    }
    setResult({ kake1, kake2, comment });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-3xl font-extrabold mb-8 text-center tracking-tight text-indigo-800 drop-shadow">相性鑑定</h1>
      <div className="w-full flex flex-col md:flex-row gap-6 mb-8">
        {/* 1人目カード */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <label className="block mb-2 text-lg font-semibold text-indigo-700">1人目の誕生日</label>
          <input
            type="date"
            value={birthday1}
            onChange={e => setBirthday1(e.target.value)}
            className="border-2 border-indigo-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg mb-3 text-black bg-white"
            placeholder="YYYY-MM-DD"
          />
          <div className="text-sm text-gray-500 mb-1">KINナンバー</div>
          <div className="text-2xl font-bold text-indigo-600 mb-2">{kin1 ?? "-"}</div>
        </div>
        {/* 2人目カード */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center">
          <label className="block mb-2 text-lg font-semibold text-indigo-700">2人目の誕生日</label>
          <input
            type="date"
            value={birthday2}
            onChange={e => setBirthday2(e.target.value)}
            className="border-2 border-indigo-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg mb-3 text-black bg-white"
            placeholder="YYYY-MM-DD"
          />
          <div className="text-sm text-gray-500 mb-1">KINナンバー</div>
          <div className="text-2xl font-bold text-indigo-600 mb-2">{kin2 ?? "-"}</div>
        </div>
      </div>
      <button
        onClick={handleJudge}
        className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-full px-8 py-3 text-lg font-bold shadow-lg hover:scale-105 transition mb-8"
        disabled={!kin1 || !kin2}
      >
        鑑定する
      </button>
      {result && (
        <div className="w-full bg-white p-6 rounded-2xl shadow-xl mt-4 animate-fade-in">
          <h2 className="text-xl font-bold mb-3 text-indigo-700">相性コメント</h2>
          <p className="mb-6 text-gray-700 text-base">{result.comment}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 rounded-xl p-4">
              <h3 className="font-bold text-indigo-600 mb-2">1人目（KIN {kin1 ?? "-"}）</h3>
              {result.kake1 ? (
                <>
                  <div className="font-semibold mb-1 text-lg text-black">{result.kake1.卦}</div>
                  <div className="text-sm mb-1 text-black">{result.kake1.詳細.卦の象}</div>
                  <div className="text-xs text-gray-700">{result.kake1.詳細.占いの目安.運勢}</div>
                </>
              ) : (
                <div className="text-black">該当なし</div>
              )}
            </div>
            <div className="bg-indigo-50 rounded-xl p-4">
              <h3 className="font-bold text-indigo-600 mb-2">2人目（KIN {kin2 ?? "-"}）</h3>
              {result.kake2 ? (
                <>
                  <div className="font-semibold mb-1 text-lg text-black">{result.kake2.卦}</div>
                  <div className="text-sm mb-1 text-black">{result.kake2.詳細.卦の象}</div>
                  <div className="text-xs text-gray-700">{result.kake2.詳細.占いの目安.運勢}</div>
                </>
              ) : (
                <div className="text-black">該当なし</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
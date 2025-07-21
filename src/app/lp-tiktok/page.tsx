"use client";
import { useState } from "react";
import Link from "next/link";
import { getKinNumber } from "../lib/kin";
import { getKakeByKin } from "../lib/kake";
import { useSession } from "next-auth/react";

const questions = [
  { id: 1, text: "氏名", type: "text", placeholder: "例：山田太郎" },
  { id: 2, text: "性別", type: "radio", options: ["男性", "女性", "その他"] },
  { id: 3, text: "誕生日", type: "date" },
  { id: 4, text: "占いたい種類", type: "radio", options: ["恋愛", "仕事", "金運", "健康", "人間関係", "全体運"] },
];

export default function LpTiktokPage() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<null | {
    kin: number | null;
    kake: any;
    name: string;
    gender: string;
    birthday: string;
    uranaiType: string;
  }>(null);

  const handleChange = (qIdx: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = value;
    setAnswers(newAnswers);
  };

  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    const [name, gender, birthday, uranaiType] = answers;
    const kin = getKinNumber(birthday);
    const kake = kin ? getKakeByKin(kin) : null;
    setResult({ kin, kake, name, gender, birthday, uranaiType });
    setShowResult(true);
  };

  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-start p-0 sm:p-4">
      <header className="w-full max-w-lg mx-auto pt-8 pb-4 px-4 sm:px-8">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6 sm:mb-8 drop-shadow-lg tracking-tight leading-tight">
          <span role="img" aria-label="crystal-ball">🔮</span> TikTok限定！かんたんマヤ診断
        </h1>
      </header>
      <main className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-start items-center px-2 sm:px-0">
        <div className="w-full bg-white/80 rounded-3xl shadow-2xl p-4 sm:p-10 mt-0 sm:mt-6 border border-white/30 backdrop-blur-xl relative overflow-hidden">
          {/* 上部の神秘的な装飾 */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 opacity-30 rounded-full blur-2xl z-0"></div>
          <div className="relative z-10">
            {/* h1はheaderに移動済み */}
            {!showResult ? (
              <form onSubmit={handleDiagnose} className="space-y-8 px-1 sm:px-0">
                {questions.map((q, idx) => (
                  <div key={q.id} className="flex flex-col gap-2">
                    <div className="font-semibold text-base sm:text-lg text-purple-700 mb-1 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full"></span>
                      {q.text}
                    </div>
                    {q.type === "text" && (
                      <input
                        type="text"
                        placeholder={q.placeholder}
                        value={answers[idx]}
                        onChange={e => handleChange(idx, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-base sm:text-lg bg-white text-black shadow-sm"
                        required
                      />
                    )}
                    {q.type === "date" && (
                      <input
                        type="date"
                        value={answers[idx]}
                        onChange={e => handleChange(idx, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-300 text-base sm:text-lg bg-white text-black shadow-sm min-w-0"
                        required
                      />
                    )}
                    {q.type === "radio" && (
                      <div className="flex flex-wrap gap-3 mt-1">
                        {q.options!.map(opt => (
                          <label key={opt} className={`px-5 py-2 rounded-full border cursor-pointer transition-all text-base font-medium shadow-sm ${answers[idx] === opt ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white border-pink-400 shadow-lg" : "bg-white border-gray-300 text-gray-700 hover:bg-pink-100"}`}>
                            <input
                              type="radio"
                              name={`q${q.id}`}
                              value={opt}
                              checked={answers[idx] === opt}
                              onChange={() => handleChange(idx, opt)}
                              className="hidden"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold py-4 rounded-2xl mt-8 text-lg sm:text-xl shadow-xl hover:scale-105 transition-all tracking-wide border-2 border-white/30 backdrop-blur-md"
                  disabled={answers.some(a => !a)}
                >
                  診断する
                </button>
              </form>
            ) : (
              <div className="mt-4 px-1 sm:px-0">
                <div className="bg-white/90 rounded-2xl p-4 sm:p-6 mb-4 shadow-xl border border-purple-100/40 relative overflow-hidden">
                  {/* 結果上部の装飾 */}
                  <div className="absolute -top-8 right-0 w-24 h-24 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 opacity-30 rounded-full blur-2xl z-0"></div>
                  <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 text-center drop-shadow">{result?.name}さんの診断結果</h2>
                    {/* 結果本体 */}
                  {result && result.kake ? (
                    <div className="space-y-4 text-base">
                      {/* 卦 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                        <span className="text-xs font-bold text-purple-500 mb-1">卦</span>
                        <span className="font-bold text-lg text-black">{result.kake.卦}</span>
                      </div>
                      {/* 卦の象 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                        <span className="text-xs font-bold text-purple-500 mb-1">卦の象</span>
                        <span className="text-black">{result.kake.詳細.卦の象}</span>
                      </div>
                      {/* 病気 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                        <span className="text-xs font-bold text-purple-500 mb-1">病気</span>
                        <span className="text-black">{result.kake.詳細.占いの目安["病気"]}</span>
                      </div>
                      {/* 失せ物 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                        <span className="text-xs font-bold text-purple-500 mb-1">失せ物</span>
                        <span className="text-black">{result.kake.詳細.占いの目安["失せ物"]}</span>
                      </div>
                      {/* 人物 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                        <span className="text-xs font-bold text-purple-500 mb-1">人物</span>
                        <span className="text-black">{result.kake.詳細.占いの目安["人物"]}</span>
                      </div>
                      {/* 恋愛・結婚 */}
                      {(() => {
                        const text = result.kake.詳細.占いの目安["愛情・結婚"] || "";
                        const sentences = text.match(/[^。！？!?\n]+[。！？!?]?/g) || [text];
                        const visible = sentences.slice(0, 2).join("");
                        const hidden = sentences.slice(2).join("");
                        return (
                          <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col relative">
                            <span className="text-xs font-bold text-pink-500 mb-1">恋愛・結婚</span>
                            <span className="text-black">
                              {!session ? (
                                <>
                                  <span>{visible}</span>
                                  {hidden && (
                                    <span className="block mt-4">
                                      <span className="inline-block align-middle w-full text-center" style={{ background: "rgba(255,255,255,0.4)", borderRadius: "14px", padding: "24px 14px", boxShadow: "0 4px 32px 0 rgba(80,0,120,0.10)", border: "1.5px solid rgba(180,180,255,0.25)", backdropFilter: "blur(2px)" }}>
                                        <span className="block text-lg font-semibold text-purple-700 mb-2 flex items-center justify-center gap-2">🔮 <span>神秘のヴェール</span> 🔮</span>
                                        <span className="block text-base font-bold text-pink-600 mb-2">恋愛・結婚の続き</span>
                                        <span className="block text-gray-500 mb-1">ここにはあなたの運命や恋愛・結婚の詳細なアドバイスが隠されています…</span>
                                        <span className="block text-gray-400 italic">（新規登録またはログインで全ての情報が解放されます）</span>
                                        <span className="block mt-4 text-2xl text-purple-300/80">•••</span>
                                        <span className="block mt-4" style={{ filter: "blur(6px)" }}>{hidden}</span>
                                      </span>
                                    </span>
                                  )}
                                </>
                              ) : text}
                            </span>
                            {/* 新規登録・ログインボタンをカード下部に中央配置で表示（未ログイン時のみ） */}
                            {!session && hidden && (
                              <div className="w-full flex justify-center gap-4 mt-6">
                                <Link href="/register?from=lp-tiktok" className="px-7 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:to-indigo-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-purple-200/30">
                                  <span className="drop-shadow glow">新規登録</span>
                                </Link>
                                <Link href="/login?from=lp-tiktok" className="px-7 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-pink-200/30">
                                  <span className="drop-shadow glow">ログイン</span>
                                </Link>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {/* 運勢・交渉・商取引（ガラスモザイク） */}
                      {!session ? (
                        <div className="rounded-xl bg-gradient-to-r from-purple-100/60 to-pink-100/60 border border-purple-200/40 shadow-lg p-6 flex flex-col items-center relative overflow-hidden">
                        
                          <div className="w-full flex flex-col items-center">
                            <span className="inline-block align-middle w-full text-center" style={{ background: "rgba(255,255,255,0.4)", borderRadius: "14px", padding: "24px 14px", boxShadow: "0 4px 32px 0 rgba(80,0,120,0.10)", border: "1.5px solid rgba(180,180,255,0.25)", backdropFilter: "blur(2px)" }}>
                              <span className="block text-lg font-semibold text-purple-700 mb-2 flex items-center justify-center gap-2">🔮 <span>神秘のヴェール</span> 🔮</span>
                              <span className="block text-base font-bold text-pink-600 mb-2">運勢・交渉・商取引</span>
                              <span className="block text-gray-500 mb-1">ここにはあなたの運命や人間関係、仕事・金運の詳細なアドバイスが隠されています…</span>
                              <span className="block text-gray-400 italic">（新規登録またはログインで全ての情報が解放されます）</span>
                              <span className="block mt-4 text-2xl text-purple-300/80">•••</span>
                            </span>
                            
                            <span className="block mt-4 text-black select-none" style={{ filter: "blur(6px)" }}>
                              運勢: {result.kake.詳細.占いの目安.運勢}<br />
                              交渉・商取引: {result.kake.詳細.占いの目安["交渉・商取引"]}
                            </span>
                            <div className="flex justify-center gap-4 mb-4">
                            <Link href="/register?from=lp-tiktok" className="px-7 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:to-indigo-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-purple-200/30">
                              <span className="drop-shadow glow">新規登録</span>
                            </Link>
                            <Link href="/login?from=lp-tiktok" className="px-7 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-pink-200/30">
                              <span className="drop-shadow glow">ログイン</span>
                            </Link>
                          </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                            <span className="text-xs font-bold text-purple-500 mb-1">運勢</span>
                            <span className="text-black">{result.kake.詳細.占いの目安.運勢}</span>
                          </div>
                          <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                            <span className="text-xs font-bold text-purple-500 mb-1">交渉・商取引</span>
                            <span className="text-black">{result.kake.詳細.占いの目安["交渉・商取引"]}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-red-500">誕生日からKINが特定できませんでした。</div>
                  )}
                </div>
              </div>
              <button
                className="w-full mt-8 text-purple-500 underline hover:text-pink-500 font-semibold text-base sm:text-lg tracking-wide"
                onClick={() => setShowResult(false)}
              >
                もう一度診断する
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 
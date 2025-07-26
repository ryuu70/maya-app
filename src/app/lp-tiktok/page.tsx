"use client";
import React from "react";
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
  const [showAdModal, setShowAdModal] = useState(false);
  const { data: session } = useSession();

  const handleChange = (qIdx: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[qIdx] = value;
    setAnswers(newAnswers);
  };
  const handleDiagnose = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAdModal(true);
  };
  const handleAdClose = () => {
    setShowAdModal(false);
    const [name, gender, birthday, uranaiType] = answers;
    const kin = getKinNumber(birthday);
    const kake = kin ? getKakeByKin(kin) : null;
    setResult({ kin, kake, name, gender, birthday, uranaiType });
    setShowResult(true);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-start p-0 sm:p-4">
      <header className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto pt-8 pb-4 px-4 sm:px-8 md:px-12 lg:px-16">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6 sm:mb-8 drop-shadow-lg tracking-tight leading-tight">
          <span role="img" aria-label="crystal-ball">🔮</span> かんたんマヤ診断
        </h1>
      </header>
      <main className="min-h-screen w-full flex-1 flex flex-col items-center justify-start px-2 sm:px-0">
        {/* 広告モーダル */}
        {showAdModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
            <div className="bg-white rounded-lg shadow-lg p-4 relative flex flex-col items-center">
              <button onClick={handleAdClose} className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold">×</button>
              <a href="https://px.a8.net/svt/ejp?a8mat=459VF6+DW45P6+2PEO+C4DVL" rel="nofollow">
                <img style={{border:0}} width="300" height="250" alt="" src="https://www27.a8.net/svt/bgt?aid=250723410840&wid=002&eno=01&mid=s00000012624002036000&mc=1" />
              </a>
              <img style={{border:0}} width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=459VF6+DW45P6+2PEO+C4DVL" alt="" />
              <div className="mt-2 text-center text-sm text-gray-600">広告を閉じると診断結果が表示されます</div>
            </div>
          </div>
        )}
        <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white/80 rounded-3xl shadow-2xl p-4 sm:p-10 md:p-12 lg:p-16 mt-0 sm:mt-6 border border-white/30 backdrop-blur-xl relative overflow-hidden mx-auto">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 opacity-30 rounded-full blur-2xl z-0"></div>
        <div className="relative z-10">
          {!showResult ? (
            <form onSubmit={handleDiagnose} className="space-y-8">
              {questions.map((q, idx) => (
                  <div key={q.id}>
                    <label className="block mb-1 text-sm font-semibold text-purple-700">{q.text}</label>
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
              <div className="mt-4 px-1 sm:px-0 md:px-8 lg:px-16">
                <div className="bg-white/90 rounded-2xl p-4 sm:p-6 md:p-10 mb-4 shadow-xl border border-purple-100/40 relative overflow-hidden max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
                <div className="absolute -top-8 right-0 w-24 h-24 bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 opacity-30 rounded-full blur-2xl z-0"></div>
                <div className="relative z-10">
                    <h2 className="text-xl sm:text-2xl font-bold text-pink-600 mb-4 text-center drop-shadow">{result?.name}さんの診断結果</h2>
                    {result && (
                    <div className="space-y-4 text-base">
                        {/* KINナンバー */}
                        <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                          <span className="text-xs font-bold text-purple-500 mb-1">KINナンバー</span>
                          <span className="font-bold text-lg text-black">{result.kin ?? '不明'}</span>
                        </div>
                        {/* 掛 */}
                        {result.kake && (
                          <>
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                              <span className="text-xs font-bold text-purple-500 mb-1">掛</span>
                        <span className="font-bold text-lg text-black">{result.kake.卦}</span>
                      </div>
                            {/* 掛けの象 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                              <span className="text-xs font-bold text-purple-500 mb-1">掛けの象</span>
                              <span className="text-black">{result.kake.詳細?.卦の象}</span>
                      </div>
                      {/* 病気 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                        <span className="text-xs font-bold text-purple-500 mb-1">病気</span>
                              <span className="text-black">{result.kake.詳細?.占いの目安?.病気}</span>
                      </div>
                      {/* 失せ物 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                        <span className="text-xs font-bold text-purple-500 mb-1">失せ物</span>
                              <span className="text-black">{result.kake.詳細?.占いの目安?.失せ物}</span>
                      </div>
                      {/* 人物 */}
                      <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col">
                        <span className="text-xs font-bold text-purple-500 mb-1">人物</span>
                              <span className="text-black">{result.kake.詳細?.占いの目安?.人物}</span>
                      </div>
                            {/* 愛情・結婚（2行目まで表示） */}
                            <div className="rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100/60 shadow p-4 flex flex-col relative">
                              <span className="text-xs font-bold text-pink-500 mb-1">愛情・結婚</span>
                              <span className="text-black">
                      {(() => {
                                  const text = result.kake.詳細?.占いの目安?.['愛情・結婚'] || '';
                        const sentences = text.match(/[^。！？!?\n]+[。！？!?]?/g) || [text];
                        const visible = sentences.slice(0, 2).join("");
                        const hidden = sentences.slice(2).join("");
                        const canViewDetail = !!session;
                        return (
                                <>
                                  <span>{visible}</span>
                                  {hidden && (
                                        <span className="block mt-2">
                                          {/* blurは本文だけ */}
                                          <span
                                            className="inline-block align-middle w-full select-none"
                                            style={canViewDetail ? {} : { filter: "blur(6px)", background: "rgba(255,255,255,0.4)", borderRadius: "10px", padding: "16px 10px", boxShadow: "0 4px 32px 0 rgba(80,0,120,0.10)", border: "1.5px solid rgba(180,180,255,0.25)", backdropFilter: "blur(2px)" }}
                                          >
                                            {hidden}
                                          </span>
                                          {/* blur外に文言・ボタンを出す */}
                                          <span className="block text-lg font-semibold text-purple-700 mt-2 flex items-center justify-center gap-2">🔒 <span>ログイン限定</span></span>
                                          <span className="block text-base font-bold text-pink-600 mb-2">愛情・結婚の続き</span>
                                          <span className="block text-gray-500 mb-1">ここにはあなたの恋愛・結婚の詳細なアドバイスが隠されています…</span>
                                        <span className="block text-gray-400 italic">（新規登録またはログインで全ての情報が解放されます）</span>
                                          <div className="w-full flex justify-center gap-4 mt-3">
                                            <Link href="/register?from=lp-tiktok" className="px-6 py-2 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:to-indigo-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-purple-200/30">新規登録</Link>
                                            <Link href="/login?from=lp-tiktok" className="px-6 py-2 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-pink-200/30">ログイン</Link>
                                          </div>
                                    </span>
                                  )}
                                </>
                        );
                      })()}
                              </span>
                            </div>
                            {/* 運勢・交渉・商取引（有料部分） */}
                        <div className="rounded-xl bg-gradient-to-r from-purple-100/60 to-pink-100/60 border border-purple-200/40 shadow-lg p-6 flex flex-col items-center relative overflow-hidden">
                            {(() => {
                              const canViewDetail = !!session;
                              return (
                                <span
                                  className="inline-block align-middle w-full text-center"
                                  style={canViewDetail ? {} : { background: "rgba(255,255,255,0.4)", borderRadius: "14px", padding: "24px 14px", boxShadow: "0 4px 32px 0 rgba(80,0,120,0.10)", border: "1.5px solid rgba(180,180,255,0.25)", backdropFilter: "blur(2px)", filter: "blur(6px)" }}
                                >
                                  <span className="block text-lg font-semibold text-purple-700 mb-2 flex items-center justify-center gap-2">🔒 <span>ログイン限定</span></span>
                                  <span className="block text-base font-bold text-pink-600 mb-2">運勢・交渉・商取引</span>
                                  <span className="block text-gray-500 mb-1">ここにはあなたの運命や人間関係、仕事・金運の詳細なアドバイスが隠されています…</span>
                                  <span className="block text-gray-400 italic">（新規登録またはログインで全ての情報が解放されます）</span>
                                  <span className="block mt-4 text-2xl text-purple-300/80">•••</span>
                                </span>
                              );
                            })()}
                              <div className="w-full flex justify-center gap-4 mt-6">
                                <Link href="/register?from=lp-tiktok" className="px-7 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:to-indigo-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-purple-200/30">新規登録</Link>
                                <Link href="/login?from=lp-tiktok" className="px-7 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-pink-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-pink-200/30">ログイン</Link>
                          </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                      <Link href="/" className="px-6 py-3 rounded-full font-bold text-purple-600 bg-white border-2 border-purple-300 hover:bg-purple-50 transition-all duration-200 text-center">トップへ戻る</Link>
                      <Link href="/tarot" className="px-6 py-3 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-purple-200/30 text-center">🔮 タロット占いをする</Link>
                    </div>
                  </div>
                </div>
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
} 
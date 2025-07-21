"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { getKinNumber } from "../lib/kin";
import { getKakeByKin } from "../lib/kake";
// import { useSession } from "next-auth/react";

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
  // const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-start p-0 sm:p-4">
      <header className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto pt-8 pb-4 px-4 sm:px-8 md:px-12 lg:px-16">
        <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6 sm:mb-8 drop-shadow-lg tracking-tight leading-tight">
          <span role="img" aria-label="crystal-ball">🔮</span> TikTok限定！かんたんマヤ診断
        </h1>
      </header>
      <main className="min-h-screen w-full flex-1 flex flex-col items-center justify-start px-2 sm:px-0">
        <div className="w-full max-w-lg md:max-w-2xl lg:max-w-3xl bg-white/80 rounded-3xl shadow-2xl p-4 sm:p-10 md:p-12 lg:p-16 mt-0 sm:mt-6 border border-white/30 backdrop-blur-xl relative overflow-hidden mx-auto">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-300 opacity-30 rounded-full blur-2xl z-0"></div>
          <div className="relative z-10">
            {!showResult ? (
              <form onSubmit={handleDiagnose} className="space-y-8">
                {questions.map((q, idx) => (
                  <div key={q.id}>
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
                    <Link href="/">トップへ戻る</Link>
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
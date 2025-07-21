'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useMemo, useEffect } from 'react'
import {
    getKinNumber,
    getWaveNumber,
    getMirrorKin,
    getOppositeKin,
} from '@/app/lib/kin'
import { getEkiDetail, getEkiDiscDetail, getWaveDetail } from '@/app/lib/eki'
import { getKakeByKin } from '@/app/lib/kake'
import { useSession } from 'next-auth/react'

function formatJapaneseDate(dateStr: string): string {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function calculateAgeDate(birthdayStr: string, age: number): Date {
    const date = new Date(birthdayStr)
    return new Date(date.getFullYear() + age, date.getMonth(), date.getDate())
}

// テキストを2文まで表示し、それ以降はblur＋有料案内
function renderWithBlur(text: string, showButton = false) {
  const sentences = text.match(/[^。！？!?\n]+[。！？!?]?/g) || [text];
  const visible = sentences.slice(0, 2).join("");
  const hidden = sentences.slice(2).join("");
  return (
    <>
      <span>{visible}</span>
      {hidden && (
        <span className="block mt-2">
          <span className="inline-block align-middle w-full text-black select-none" style={{ filter: "blur(6px)", background: "rgba(255,255,255,0.4)", borderRadius: "10px", padding: "8px 10px", boxShadow: "0 4px 32px 0 rgba(80,0,120,0.10)", border: "1.5px solid rgba(180,180,255,0.25)", backdropFilter: "blur(2px)" }}>{hidden}</span>
          {showButton && (
            <div className="w-full flex justify-center gap-4 mt-3">
              <a href="/pricing" className="px-6 py-2 rounded-full font-bold text-white shadow-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-pink-600 hover:to-indigo-600 transition-all duration-200 border-2 border-white/30 backdrop-blur-md ring-2 ring-purple-200/30">有料プラン登録で全て表示</a>
            </div>
          )}
        </span>
      )}
    </>
  );
}

export default function Fortune({ birthday, name }: { birthday: string; name: string }) {
    const { data: session } = useSession();
    const [isPaid, setIsPaid] = useState<boolean | null>(null);
    const router = useRouter()
    const searchParams = useSearchParams()
    const [age, setAge] = useState<number>(Number(searchParams.get('age') ?? 0))
    const [showDetail, setShowDetail] = useState(false)
    const [showEkiDetail, setShowEkiDetail] = useState(false)
    const [showWaveDetail, setShowWaveDetail] = useState(false)
    const [showMirrorDetail, setShowMirrorDetail] = useState(false)
    const [showOppositeDetail, setShowOppositeDetail] = useState(false)

    // メモ化してパフォーマンスを向上
    const fortuneData = useMemo(() => {
        const targetDate = calculateAgeDate(birthday, age)
        const kin = getKinNumber(targetDate.toISOString().split('T')[0])
        
        if (kin === null) {
            return null
        }

        const wave = getWaveNumber(kin)
        const mirror = getMirrorKin(kin)
        const opposite = getOppositeKin(kin)
        const ekiDetail = getEkiDetail(kin)
        const waveDetail = getWaveDetail(wave)
        const mirrorDetail = getEkiDetail(mirror)
        const mirrorEkiDiscDetail = getEkiDiscDetail(mirror)
        const mirrorWaveDetail = getWaveDetail(getWaveNumber(mirror))
        const oppositeDetail = getEkiDetail(opposite)
        const oppositeEkiDiscDetail = getEkiDiscDetail(opposite)
        const oppositeWaveDetail = getWaveDetail(getWaveNumber(opposite))
        const kakeDetail = getKakeByKin(kin)

        return {
            kin,
            wave,
            mirror,
            opposite,
            ekiDetail,
            waveDetail,
            mirrorDetail,
            mirrorEkiDiscDetail,
            mirrorWaveDetail,
            oppositeDetail,
            oppositeEkiDiscDetail,
            oppositeWaveDetail,
            kakeDetail,
            targetDate
        }
    }, [birthday, age])

    // サブスクリプション状態取得
    useEffect(() => {
      async function fetchSubscription() {
        if (!session?.user) return;
        const email = session.user.email;
        // idは型定義上存在しない場合があるため、emailのみでAPIを呼ぶ
        if (!email) return;
        const res = await fetch(`/api/subscriptions/status?email=${encodeURIComponent(email)}`);
        const data = await res.json();
        setIsPaid(!!data?.user?.isPaid);
      }
      fetchSubscription();
    }, [session]);

    // エラー状態の処理
    if (fortuneData === null) {
        return (
            <div className="max-w-3xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="text-center text-red-600">
                        <p className="text-lg font-semibold mb-2">⚠️ エラーが発生しました</p>
                        <p>指定された日付に対応するKINが見つかりませんでした。</p>
                        <p className="text-sm text-gray-600 mt-2">
                            生年月日: {formatJapaneseDate(birthday)}, 年齢: {age}歳
                        </p>
                    </div>
                </div>
            </div>
        )
    }

        const {
        kin,
        wave,
        mirror,
        opposite,
        ekiDetail, 
        waveDetail,
        mirrorDetail,
        oppositeDetail,
    } = fortuneData

    const handleKinClick = () => {
        setShowDetail(true)
        // モーダル表示後に自動スクロール
        setTimeout(() => {
            const modal = document.querySelector('[data-modal="kin-detail"]')
            if (modal) {
                modal.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 100)
    }

    const handleEkiClick = () => {
        setShowEkiDetail(true)
        // モーダル表示後に自動スクロール
        setTimeout(() => {
            const modal = document.querySelector('[data-modal="eki-detail"]')
            if (modal) {
                modal.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 100)
    }

    const handleWaveClick = () => {
        setShowWaveDetail(true)
        // モーダル表示後に自動スクロール
        setTimeout(() => {
            const modal = document.querySelector('[data-modal="wave-detail"]')
            if (modal) {
                modal.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 100)
    }

    const handleMirrorClick = () => {
        setShowMirrorDetail(true)
        // モーダル表示後に自動スクロール
        setTimeout(() => {
            const modal = document.querySelector('[data-modal="mirror-detail"]')
            if (modal) {
                modal.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 100)
    }

    const handleOppositeClick = () => {
        setShowOppositeDetail(true)
        // モーダル表示後に自動スクロール
        setTimeout(() => {
            const modal = document.querySelector('[data-modal="opposite-detail"]')
            if (modal) {
                modal.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 100)
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAge = Number(e.target.value)
        setAge(newAge)
        router.push(`/?age=${newAge}`)
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-8 pt-32">
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{name}さんの暦解き</h2>
                <p className="text-gray-600 mb-4">
                    🎂 生年月日：<strong>{formatJapaneseDate(birthday)}</strong>
                    🎯 年齢：<strong>{age}歳</strong>
                </p>

                <form className="mb-6 text-black">
                    <label htmlFor="age" className="text-gray-700 mr-2">年齢を選択：</label>
                    <select
                        id="age"
                        name="age"
                        value={age}
                        onChange={handleChange}
                        className="border rounded px-3 py-1 text-sm"
                        aria-describedby="age-description"
                    >
                        {[...Array(101).keys()].map((a) => (
                            <option key={a} value={a}>{a}歳</option>
                        ))}
                    </select>
                    <div id="age-description" className="text-xs text-gray-500 mt-1">
                        年齢を選択すると、その年齢の暦解きが表示されます
                    </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                    <button
                        className="bg-blue-50 p-3 rounded shadow cursor-pointer hover:bg-blue-100 active:bg-blue-200 active:scale-95 transition-all duration-150 text-center touch-manipulation relative overflow-hidden group"
                        onClick={handleKinClick}
                        aria-label={`KIN ${kin} の詳細情報を表示`}
                    >
                        <div className="absolute inset-0 bg-blue-300 opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                        <span className="block text-xs text-gray-500">KINナンバー</span>
                        <span className="text-xl font-bold text-red-600">{kin}</span>
                        <span className="block text-xs text-blue-600 mt-1">タップして詳細表示</span>
                    </button>
                    <button
                        className="bg-blue-50 p-3 rounded shadow cursor-pointer hover:bg-blue-100 active:bg-blue-200 active:scale-95 transition-all duration-150 text-center touch-manipulation relative overflow-hidden group"
                        onClick={handleWaveClick}
                        aria-label={`マヤ暦波動数 ${wave} の詳細情報を表示`}
                    >
                        <div className="absolute inset-0 bg-blue-300 opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                        <span className="block text-xs text-gray-500">マヤ暦波動数</span>
                        <span className="text-xl font-bold text-blue-600">{wave}</span>
                        <span className="block text-xs text-blue-600 mt-1">タップして詳細表示</span>
                    </button>
                    <button
                        className="bg-blue-50 p-3 rounded shadow cursor-pointer hover:bg-blue-100 active:bg-blue-200 active:scale-95 transition-all duration-150 text-center touch-manipulation relative overflow-hidden group"
                        onClick={handleMirrorClick}
                        aria-label={`鏡の向こうKIN ${mirror} の詳細情報を表示`}
                    >
                        <div className="absolute inset-0 bg-blue-300 opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                        <span className="block text-xs text-gray-500">鏡の向こうKIN</span>
                        <span className="text-xl font-bold text-blue-600">{mirror}</span>
                        <span className="block text-xs text-blue-600 mt-1">タップして詳細表示</span>
                    </button>
                    <button
                        className="bg-blue-50 p-3 rounded shadow cursor-pointer hover:bg-blue-100 active:bg-blue-200 active:scale-95 transition-all duration-150 text-center touch-manipulation relative overflow-hidden group"
                        onClick={handleOppositeClick}
                        aria-label={`絶対反対KIN ${opposite} の詳細情報を表示`}
                    >
                        <div className="absolute inset-0 bg-blue-300 opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                        <span className="block text-xs text-gray-500">絶対反対KIN</span>
                        <span className="text-xl font-bold text-blue-600">{opposite}</span>
                        <span className="block text-xs text-blue-600 mt-1">タップして詳細表示</span>
                    </button>
                    <button
                        className="bg-green-50 p-3 rounded shadow col-span-1 sm:col-span-2 cursor-pointer hover:bg-green-100 active:bg-green-200 active:scale-95 transition-all duration-150 text-center touch-manipulation relative overflow-hidden group"
                        onClick={handleEkiClick}
                        aria-label={`易 ${ekiDetail?.易 || '情報なし'} の詳細情報を表示`}
                    >
                        <div className="absolute inset-0 bg-green-300 opacity-0 group-active:opacity-20 transition-opacity duration-150"></div>
                        <span className="block text-xs text-gray-500">易（えき）</span>
                        <span className="text-sm">{ekiDetail?.易 || '情報なし'}</span>
                        <span className="block text-xs text-green-600 mt-1">タップして詳細表示</span>
                    </button>
                </div>
            </div>
            
            {showDetail && ekiDetail && (
                <div 
                    data-modal="kin-detail"
                    className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">
                            KIN {kin} の詳細情報
                        </h3>
                        <button
                            onClick={() => setShowDetail(false)}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                            aria-label="詳細情報を閉じる"
                        >
                            ×
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-gray-700 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">紋章</span>
                            <span className="text-base font-semibold text-indigo-700">
                                {ekiDetail.紋章?.join(' × ') || '情報なし'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">概要</span>
                            <p className="text-sm leading-relaxed">{isPaid ? (ekiDetail.概要 || '情報なし') : renderWithBlur(ekiDetail.概要 || '情報なし', true)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">ワンポイント</span>
                            <p className="text-sm leading-relaxed text-green-800 font-medium">
                                {ekiDetail.ワンポイント || '情報なし'}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">著名人</span>
                            <p className="text-sm">{ekiDetail.著名人 || '情報なし'}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {/* 易の詳細モーダル */}
            {showEkiDetail && fortuneData.kakeDetail && (
                <div 
                    data-modal="eki-detail"
                    className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">
                            易の詳細情報
                        </h3>
                        <button
                            onClick={() => setShowEkiDetail(false)}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                            aria-label="易の詳細情報を閉じる"
                        >
                            ×
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-gray-700 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">卦名</span>
                            <span className="text-base font-semibold text-green-700">
                                {fortuneData.kakeDetail.卦} (第{fortuneData.kakeDetail.No}卦)
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">卦の象</span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{renderWithBlur(fortuneData.kakeDetail.詳細.卦の象, false)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">病気</span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{renderWithBlur(fortuneData.kakeDetail.詳細.占いの目安.病気, false)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">失せ物</span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{renderWithBlur(fortuneData.kakeDetail.詳細.占いの目安.失せ物, false)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">人物</span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{renderWithBlur(fortuneData.kakeDetail.詳細.占いの目安.人物, false)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">愛情・結婚</span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{renderWithBlur(fortuneData.kakeDetail.詳細.占いの目安['愛情・結婚'], true)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">運勢</span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{renderWithBlur(fortuneData.kakeDetail.詳細.占いの目安.運勢, false)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">交渉・商取引</span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{renderWithBlur(fortuneData.kakeDetail.詳細.占いの目安['交渉・商取引'], false)}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {showWaveDetail && waveDetail && (
                <div 
                    data-modal="wave-detail"
                    className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">
                            マヤ暦波動数 {wave} の詳細情報
                        </h3>
                        <button
                            onClick={() => setShowWaveDetail(false)}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                            aria-label="マヤ暦波動数の詳細情報を閉じる"
                        >
                            ×
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-gray-700 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">波動数の説明</span>
                            <p className="text-sm leading-relaxed whitespace-pre-line">{isPaid ? (waveDetail.説明 || '情報なし') : renderWithBlur(waveDetail.説明 || '情報なし', true)}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {showMirrorDetail && mirrorDetail && (
                <div 
                    data-modal="mirror-detail"
                    className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">
                            鏡の向こうKIN {mirror} の詳細情報
                        </h3>
                        <button
                            onClick={() => setShowMirrorDetail(false)}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                            aria-label="鏡の向こうKINの詳細情報を閉じる"
                        >
                            ×
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-gray-700 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">紋章</span>
                            <span className="text-base font-semibold text-indigo-700">
                                {mirrorDetail.紋章?.join(' × ') || '情報なし'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">概要</span>
                            <p className="text-sm leading-relaxed">{isPaid ? (mirrorDetail.概要 || '情報なし') : renderWithBlur(mirrorDetail.概要 || '情報なし', true)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">ワンポイント</span>
                            <p className="text-sm leading-relaxed text-green-800 font-medium">
                                {mirrorDetail.ワンポイント || '情報なし'}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">著名人</span>
                            <p className="text-sm">{mirrorDetail.著名人 || '情報なし'}</p>
                        </div>

                    </div>
                </div>
            )}
            
            {showOppositeDetail && oppositeDetail && (
                <div 
                    data-modal="opposite-detail"
                    className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">
                            絶対反対KIN {opposite} の詳細情報
                        </h3>
                        <button
                            onClick={() => setShowOppositeDetail(false)}
                            className="text-gray-500 hover:text-gray-700 text-lg"
                            aria-label="絶対反対KINの詳細情報を閉じる"
                        >
                            ×
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4 text-gray-700 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">紋章</span>
                            <span className="text-base font-semibold text-indigo-700">
                                {oppositeDetail.紋章?.join(' × ') || '情報なし'}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">概要</span>
                            <p className="text-sm leading-relaxed">{isPaid ? (oppositeDetail.概要 || '情報なし') : renderWithBlur(oppositeDetail.概要 || '情報なし', true)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">ワンポイント</span>
                            <p className="text-sm leading-relaxed text-green-800 font-medium">
                                {oppositeDetail.ワンポイント || '情報なし'}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">著名人</span>
                            <p className="text-sm">{oppositeDetail.著名人 || '情報なし'}</p>
                        </div>

                    </div>
                </div>
            )}
        </div>
    )
}

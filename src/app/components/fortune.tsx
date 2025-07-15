'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import {
    getKinNumber,
    getWaveNumber,
    getMirrorKin,
    getOppositeKin,
} from '@/app/lib/kin'
import { getEkiDetail } from '@/app/lib/eki'

function formatJapaneseDate(dateStr: string): string {
    const date = new Date(dateStr)
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

function calculateAgeDate(birthdayStr: string, age: number): Date {
    const date = new Date(birthdayStr)
    return new Date(date.getFullYear() + age, date.getMonth(), date.getDate())
}

export default function Fortune({ birthday, name }: { birthday: string; name: string }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [age, setAge] = useState<number>(Number(searchParams.get('age') ?? 0))
    const [showDetail, setShowDetail] = useState(false)

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

        return {
            kin,
            wave,
            mirror,
            opposite,
            ekiDetail,
            targetDate
        }
    }, [birthday, age])

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

    const { kin, wave, mirror, opposite, ekiDetail } = fortuneData

    const handleKinClick = () => {
        setShowDetail(true)
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newAge = Number(e.target.value)
        setAge(newAge)
        router.push(`/?age=${newAge}`)
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-8">
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
                        className="bg-blue-50 p-3 rounded shadow cursor-pointer hover:bg-blue-100 transition text-left"
                        onClick={handleKinClick}
                        aria-label={`KIN ${kin} の詳細情報を表示`}
                    >
                        <span className="block text-xs text-gray-500">KINナンバー</span>
                        <span className="text-xl font-bold text-red-600">{kin}</span>
                    </button>
                    <div className="bg-blue-50 p-3 rounded shadow">
                        <span className="block text-xs text-gray-500">マヤ暦波動数</span>
                        <span className="text-xl font-bold text-blue-600">{wave}</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded shadow">
                        <span className="block text-xs text-gray-500">鏡の向こうKIN</span>
                        <span className="text-lg font-bold">{mirror}</span>
                    </div>
                    <div className="bg-blue-50 p-3 rounded shadow">
                        <span className="block text-xs text-gray-500">絶対反対KIN</span>
                        <span className="text-lg font-bold">{opposite}</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded shadow col-span-1 sm:col-span-2">
                        <span className="block text-xs text-gray-500">易（えき）</span>
                        <span className="text-sm">{ekiDetail?.易 || '情報なし'}</span>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded shadow col-span-1 sm:col-span-2">
                        <span className="block text-xs text-gray-500">応答掛（おうとかけ）</span>
                        <span className="text-sm text-green-800">{ekiDetail?.音 || '情報なし'}</span>
                    </div>
                </div>
            </div>
            
            {showDetail && ekiDetail && (
                <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all">
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
                            <p className="text-sm leading-relaxed">{ekiDetail.概要 || '情報なし'}</p>
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
        </div>
    )
}

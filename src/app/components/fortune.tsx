'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
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

    const targetDate = calculateAgeDate(birthday, age)
    const kin = getKinNumber(targetDate.toISOString().split('T')[0])
    if (kin === null) {
        return <p>該当するKINが見つかりません</p>
    }
    const wave = getWaveNumber(kin)
    const mirror = getMirrorKin(kin)
    const opposite = getOppositeKin(kin)
    // 安全に利用可能
    console.log({ kin, wave, mirror, opposite })

    const [showDetail, setShowDetail] = useState(false)

    const ekiDetail = getEkiDetail(kin)

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
                    >
                        {[...Array(101).keys()].map((a) => (
                            <option key={a} value={a}>{a}歳</option>
                        ))}
                    </select>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
                    <div
                        className="bg-blue-50 p-3 rounded shadow cursor-pointer hover:bg-blue-100 transition"
                        onClick={handleKinClick}
                    >
                        <span className="block text-xs text-gray-500">KINナンバー</span>
                        <span className="text-xl font-bold text-red-600">{kin}</span>
                    </div>
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
                        <span className="text-sm">{ekiDetail?.易}</span>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded shadow col-span-1 sm:col-span-2">
                        <span className="block text-xs text-gray-500">応答掛（おうとかけ）</span>
                        <span className="text-sm text-green-800">{ekiDetail?.音}</span>
                    </div>
                </div>
            </div>
            {showDetail && ekiDetail && (
                <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">
                        KIN {kin} の詳細情報
                    </h3>
                    <div className="grid grid-cols-1 gap-4 text-gray-700 text-sm">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">紋章</span>
                            <span className="text-base font-semibold text-indigo-700">
                                {ekiDetail.紋章.join(' × ')}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">概要</span>
                            <p className="text-sm leading-relaxed">{ekiDetail.概要}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">ワンポイント</span>
                            <p className="text-sm leading-relaxed text-green-800 font-medium">
                                {ekiDetail.ワンポイント}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500">著名人</span>
                            <p className="text-sm">{ekiDetail.著名人}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

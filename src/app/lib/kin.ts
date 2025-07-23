import { kinTable } from './kinTable'

/**
 * 指定された日付から対応するKINナンバーを取得する
 * @param dateStr - 'YYYY-MM-DD' 形式の日付文字列
 * @returns KINナンバー（1〜260）または null（該当なし）
 */
export function getKinNumber(dateStr: string): number | null {
    const date = new Date(dateStr)
    const year = String(date.getFullYear())
    const month = date.getMonth() + 1 // 月は0始まりなので +1

    const yearData = kinTable[year]
    if (!yearData) return null
    const kin = yearData[month]

    console.log(`📅 入力日: ${dateStr}, 年: ${year}, 月: ${month}, KIN: ${kin}`)

    return kin ?? null
}

/**
 * ウェイブスペル番号（13のサイクル）
 */
export function getWaveNumber(kin: number): number {
    return ((kin - 1) % 13) + 1
}

/**
 * 鏡のKIN（KIN + 129）
 */
export function getMirrorKin(kin: number): number {
    return (261 - kin)
}

/**
 * 向かいのKIN（KIN + 130）
 */
export function getOppositeKin(kin: number): number {
    return ((kin + 130 - 1) % 260) + 1
}
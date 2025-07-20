import kakeData from './kake.json'

interface KakeInfo {
  KIN: number[]
  卦: string
  No: string
  詳細: {
    卦の象: string
    占いの目安: {
      '交渉・商取引': string
      運勢: string
      '愛情・結婚': string
      病気: string
      失せ物: string
      人物: string
    }
  }
}

interface KakeData {
  [key: string]: KakeInfo
}

// KINナンバーから卦を取得する関数
export function getKakeByKin(kinNumber: number): KakeInfo | null {
  const data = kakeData as KakeData
  
  for (const key in data) {
    const kake = data[key]
    if (kake.KIN.includes(kinNumber)) {
      return kake
    }
  }
  
  return null
}

// すべての卦データを取得する関数
export function getAllKake(): KakeData {
  return kakeData as KakeData
}

// KINナンバーの範囲を取得する関数
export function getKinRange(): { min: number; max: number } {
  const data = kakeData as KakeData
  let min = Infinity
  let max = -Infinity
  
  for (const key in data) {
    const kake = data[key]
    for (const kin of kake.KIN) {
      if (kin < min) min = kin
      if (kin > max) max = kin
    }
  }
  
  return { min, max }
}

// 有効なKINナンバーかチェックする関数
export function isValidKin(kinNumber: number): boolean {
  return getKakeByKin(kinNumber) !== null
} 
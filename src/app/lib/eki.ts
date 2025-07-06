import ekiData from './eki.json'

type EkiItem = {
    kin: number
    易: string
    音: string
    紋章: string[]
    概要: string
    ワンポイント: string
    著名人: string
}

const eki: Record<string, EkiItem> = ekiData

export const getEkiDetail = (kin: number): EkiItem | null => {
    return eki[String(kin)] ?? null
}
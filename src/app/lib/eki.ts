import ekiData from './eki.json'
import ekiDiscData from './eki_disc.json'
import waveData from './wave.json'

type EkiItem = {
    kin: number
    易: string
    音: string
    紋章: string[]
    概要: string
    ワンポイント: string
    著名人: string
}

type EkiDiscItem = {
    kin: number
    易: string
    易の説明: string
}

type WaveItem = {
    説明: string
}

const eki: Record<string, EkiItem> = ekiData
const ekiDisc: Record<string, EkiDiscItem> = ekiDiscData
const wave: Record<string, WaveItem> = waveData

export const getEkiDetail = (kin: number): EkiItem | null => {
    return eki[String(kin)] ?? null
}

export const getEkiDiscDetail = (kin: number): EkiDiscItem | null => {
    return ekiDisc[String(kin)] ?? null
}

export const getWaveDetail = (waveNumber: number): WaveItem | null => {
    return wave[String(waveNumber)] ?? null
}
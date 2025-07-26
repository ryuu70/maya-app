'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import tarotData from '@/app/lib/tarot.json'

type TarotCard = {
    id: string
    name: string
    isRevealed: boolean
    isUpright: boolean
}

export default function TarotPage() {
    const { status } = useSession()
    const [cards, setCards] = useState<TarotCard[]>([])
    const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null)
    const [showDetail, setShowDetail] = useState(false)
    const [isShuffling, setIsShuffling] = useState(false)
    const [backImageError, setBackImageError] = useState(false)
    const [isAdViewed, setIsAdViewed] = useState(false)
    const [showAdModal, setShowAdModal] = useState(false)

    // タロットカードの初期化
    useEffect(() => {
        initializeCards()
    }, [])

    const initializeCards = () => {
        const allCards: TarotCard[] = Object.keys(tarotData).map(id => ({
            id,
            name: tarotData[id as keyof typeof tarotData].name,
            isRevealed: false,
            isUpright: Math.random() > 0.5 // 50%の確率で正位置
        }))
        setCards(allCards)
    }

    // カードをシャッフル
    const shuffleCards = () => {
        setIsShuffling(true)
        setTimeout(() => {
            const shuffled = [...cards]
                .sort(() => Math.random() - 0.5)
                .map(card => ({
                    ...card,
                    isRevealed: false,
                    isUpright: Math.random() > 0.5
                }))
            setCards(shuffled)
            setSelectedCard(null)
            setShowDetail(false)
            setIsShuffling(false)
        }, 1000)
    }

    // カードを選択
    const selectCard = (card: TarotCard) => {
        if (isShuffling) return
        
        // 広告を見ていない場合は広告モーダルを表示
        if (!isAdViewed) {
            setShowAdModal(true)
            return
        }
        
        const updatedCards = cards.map(c => 
            c.id === card.id ? { ...c, isRevealed: true } : c
        )
        setCards(updatedCards)
        setSelectedCard({ ...card, isRevealed: true })
        setShowDetail(true)
        
        // モーダル表示後に自動スクロール
        setTimeout(() => {
            const modal = document.querySelector('[data-modal="tarot-detail"]')
            if (modal) {
                modal.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        }, 100)
    }

    const getCardImage = (cardId: string) => {
        const paddedId = cardId.padStart(2, '0')
        return `/tarot/tarot_${paddedId}.png.webp`
    }

    const getBackImage = () => {
        return '/tarot/back.png'
    }

    // デバッグ用: 画像の存在確認
    useEffect(() => {
        const img = new window.Image()
        img.onload = () => {
            console.log('カード裏面画像の存在確認: 成功')
        }
        img.onerror = () => {
            console.error('カード裏面画像の存在確認: 失敗')
        }
        img.src = getBackImage()
    }, [])

    const getCardMeaning = (cardId: string, isUpright: boolean) => {
        const card = tarotData[cardId as keyof typeof tarotData]
        if (!card) return null

        return isUpright ? {
            theme: card.正位置テーマ,
            meaning: card.正位置意味,
            keywords: card.正位置キーワード,
            details: card.正位置悩み別読み解き
        } : {
            theme: card.逆位置テーマ,
            meaning: card.逆位置意味,
            keywords: card.逆位置キーワード,
            details: card.逆位置悩み別読み解き
        }
    }

    // 広告モーダルを閉じる
    const closeAdModal = () => {
        setShowAdModal(false)
        setIsAdViewed(true)
    }

    // ローディング状態
    if (status === 'loading') {
        return (
            <div className="min-h-screen py-8 pt-32 relative">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/tarot/mat.png"
                        alt="タロットマット"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
                        <p className="text-white mt-4">読み込み中...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 pt-32 relative">
            {/* 背景画像 */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/tarot/mat.png"
                    alt="タロットマット"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-4">タロット占い</h1>
                    <p className="text-purple-200 mb-6">
                        カードをシャッフルして、直感で1枚選んでください
                    </p>
                    {!isAdViewed && (
                        <p className="text-yellow-200 mb-4 text-sm">
                            ※ カードを選択する前に広告をご覧ください
                        </p>
                    )}
                    <button
                        onClick={shuffleCards}
                        disabled={isShuffling}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:cursor-not-allowed"
                    >
                        {isShuffling ? 'シャッフル中...' : 'カードをシャッフル'}
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-8">
                    {cards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => selectCard(card)}
                            disabled={isShuffling || card.isRevealed}
                            className="relative group cursor-pointer disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                                {card.isRevealed ? (
                                    <Image
                                        src={getCardImage(card.id)}
                                        alt={card.name}
                                        fill
                                        className={`object-cover ${!card.isUpright ? 'rotate-180' : ''}`}
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                                    />
                                ) : (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={getBackImage()}
                                            alt="カード裏面"
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 12vw"
                                            priority={true}
                                            unoptimized={true}
                                            onLoad={() => {
                                                console.log('カード裏面画像が正常に読み込まれました')
                                            }}
                                            onError={(e) => {
                                                console.error('カード裏面画像の読み込みエラー:', e)
                                                setBackImageError(true)
                                            }}
                                        />
                                        {/* フォールバック背景 - 画像が読み込まれない場合のみ表示 */}
                                        {backImageError && (
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <div className="text-2xl mb-2">🃏</div>
                                                    <div className="text-xs">カード裏面</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {card.isRevealed && (
                                <div className="mt-2 text-center">
                                    <div className="text-xs text-white font-medium drop-shadow-lg">
                                        {card.name}
                                    </div>
                                    <div className={`text-xs font-bold drop-shadow-lg ${card.isUpright ? 'text-green-400' : 'text-red-400'}`}>
                                        {card.isUpright ? '正位置' : '逆位置'}
                                    </div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {showDetail && selectedCard && (
                    <div 
                        data-modal="tarot-detail"
                        className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto"
                    >
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-1/3">
                                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
                                    <Image
                                        src={getCardImage(selectedCard.id)}
                                        alt={selectedCard.name}
                                        fill
                                        className={`object-cover ${!selectedCard.isUpright ? 'rotate-180' : ''}`}
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {selectedCard.name}
                                    </h2>
                                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                                        selectedCard.isUpright 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedCard.isUpright ? '正位置' : '逆位置'}
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-2/3">
                                {(() => {
                                    const meaning = getCardMeaning(selectedCard.id, selectedCard.isUpright)
                                    if (!meaning) return <div>情報が見つかりません</div>

                                    return (
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-2">
                                                    テーマ: {meaning.theme}
                                                </h3>
                                                <p className="text-gray-700 leading-relaxed">
                                                    {meaning.meaning}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-md font-semibold text-gray-800 mb-2">
                                                    キーワード
                                                </h4>
                                                <p className="text-gray-600 text-sm">
                                                    {meaning.keywords}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-md font-semibold text-gray-800 mb-3">
                                                    悩み別読み解き
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {Object.entries(meaning.details).map(([category, detail]) => (
                                                        <div key={category} className="bg-gray-50 p-3 rounded-lg">
                                                            <div className="text-sm font-semibold text-gray-700 mb-1">
                                                                {category}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {detail}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowDetail(false)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                )}

                {/* 広告モーダル */}
                {showAdModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full">
                            <h3 className="text-lg font-bold mb-4">広告をご覧ください</h3>
                            <div className="mb-4">
                                <a href="https://px.a8.net/svt/ejp?a8mat=459VF6+DW45P6+2PEO+C4DVL" rel="nofollow" target="_blank">
                                    <img 
                                        width="300" 
                                        height="250" 
                                        alt="" 
                                        src="https://www27.a8.net/svt/bgt?aid=250723410840&wid=002&eno=01&mid=s00000012624002036000&mc=1"
                                        style={{ border: 0 }}
                                    />
                                </a>
                                <img 
                                    width="1" 
                                    height="1" 
                                    src="https://www17.a8.net/0.gif?a8mat=459VF6+DW45P6+2PEO+C4DVL" 
                                    alt="" 
                                    style={{ border: 0 }}
                                />
                            </div>
                            <button
                                onClick={closeAdModal}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                                広告を確認しました
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 
import { createEmptyCard, fsrs, generatorParameters, Grade, Card } from 'ts-fsrs'

const cards: ({ id: number } & Card)[] = []

const params = generatorParameters({ enable_fuzz: true })
const f = fsrs(params)

export function getNextCard() {
    if (cards.length !== 0) {
        const now = new Date()
        const card = cards.reduce((prev, curr) => (prev.due < curr.due ? prev : curr))
        if (card.due <= now) {
            return card.id
        }
    }
    if (cards.length < 10) {
        const newDate = new Date()
        const card = createEmptyCard(newDate) // createEmptyCard();
        const newCard = { id: cards.length + 1, ...card }
        cards.push(newCard)
        return newCard.id
    }
}

export function reviewCard(grade: Grade, cardIndex: number | undefined) {
    const index = cards.findIndex((obj) => obj.id === cardIndex)
    if (index === -1) {
        throw new Error("Couldn't find Card")
    }
    const now = new Date() // new Date();
    const scheduling_cards = f.repeat(cards[index], now)
    const { card } = scheduling_cards[grade]

    console.log(card)
    const updatedCard = {
        ...cards[index],
        ...card,
    }
    cards[index] = updatedCard
    console.log(cards)
}

import { Exercise } from '@t4/api/src/db/schema'
import { createEmptyCard, fsrs, generatorParameters, Grade, Card } from 'ts-fsrs'

const cards: (Exercise & Card)[] = []

const params = generatorParameters({ enable_fuzz: true })
const f = fsrs(params)

const vocab: Exercise[] = [
  {
    id: 1,
    question: 'le monde',
    answer: 'the world',
    source: 1,
  },
  {
    id: 2,
    question: 'bonjour',
    answer: 'hello (good day)',
    source: 2,
  },
]

export function initCards() {
  if (cards.length !== 0) return cards[0]
  const newDate = new Date()
  for (const v of vocab) {
    const card = createEmptyCard(newDate) // createEmptyCard();
    cards.push({ ...v, ...card })
  }
  return cards[0]
}

export function getNextCard() {
  // find card with the lowest due date
  const now = new Date()
  const card = cards.reduce((prev, curr) => (prev.due < curr.due ? prev : curr))
  if (card.due > now) {
    return null
  }
  return card
}

export function reviewCard(grade: Grade, cardIndex: number) {
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

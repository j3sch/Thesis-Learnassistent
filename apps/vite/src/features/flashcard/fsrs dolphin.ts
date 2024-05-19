import { TRating } from '@t4/types/src'
import { DolphinSR, generateId } from 'dolphinsr'
import type { Master, Review, Card } from 'dolphinsr'

const frenchCombinations = [{ front: [0], back: [1] }]

let card: Card
let d: DolphinSR

// Create the master cards that DolphinSR will use spaced repetition to teach.
// Note: in a real program, you'd want to persist these somewhere (a database, localStorage, etc)
const vocab: Master[] = [
  {
    id: generateId(),
    combinations: frenchCombinations,
    fields: ['le monde', 'the world'],
  },
  {
    id: generateId(),
    combinations: frenchCombinations,
    fields: ['bonjour', 'hello (good day)'],
  },
]

export function initFlashcards() {
  d = new DolphinSR()
  d.addMasters(...vocab)
  return getNextCard()
}

export function getNextCard() {
  card = d.nextCard()
  return card
}

export function reviewCard(rating: TRating) {
  const review: Review = {
    // identify which card we're reviewing
    master: card.master,
    combination: card.combination,

    // store when we reviewed it
    ts: new Date(),

    // store how easy it was to remember
    rating: rating,
  }
  d.addReviews(review)
}

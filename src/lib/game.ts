export type DivisionQuestion = {
  dividend: number
  divisor: number
  answer: number
}

export const TOTAL_QUESTIONS = 10
export const QUESTION_TIME_LIMIT_SECONDS = 10
export const BASE_POINTS = 100
export const BONUS_PER_SECOND = 20

export function createDivisionQuestion(): DivisionQuestion {
  const divisor = randomInt(2, 12)
  const quotient = randomInt(2, 12)
  const dividend = divisor * quotient

  return {
    dividend,
    divisor,
    answer: quotient,
  }
}

export function calculatePoints(responseTimeSeconds: number): number {
  const boundedTime = Math.max(0, Math.min(QUESTION_TIME_LIMIT_SECONDS, responseTimeSeconds))
  const speedBonus = Math.max(
    0,
    Math.floor((QUESTION_TIME_LIMIT_SECONDS - boundedTime) * BONUS_PER_SECOND),
  )
  return BASE_POINTS + speedBonus
}

function randomInt(min: number, max: number): number {
  const span = max - min + 1
  return Math.floor(Math.random() * span) + min
}

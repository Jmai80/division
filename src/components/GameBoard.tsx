import { useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  QUESTION_TIME_LIMIT_SECONDS,
  TOTAL_QUESTIONS,
  calculatePoints,
  createDivisionQuestion,
  type DivisionQuestion,
} from '../lib/game'
import type { NewScoreInput } from '../lib/scores'

type GameBoardProps = {
  onSaveScore: (entry: NewScoreInput) => Promise<{ ok: boolean; message: string }>
}

export function GameBoard({ onSaveScore }: GameBoardProps) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [question, setQuestion] = useState<DivisionQuestion>(() => createDivisionQuestion())
  const [answerText, setAnswerText] = useState('')
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [deadlineMs, setDeadlineMs] = useState(() => Date.now() + QUESTION_TIME_LIMIT_SECONDS * 1000)
  const [playerName, setPlayerName] = useState('')
  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [now, setNow] = useState(Date.now())
  const questionStartMsRef = useRef(Date.now())

  const isRoundFinished = questionIndex >= TOTAL_QUESTIONS
  const secondsLeft = useMemo(() => {
    if (isRoundFinished) return 0
    return Math.max(0, (deadlineMs - now) / 1000)
  }, [deadlineMs, isRoundFinished, now])

  useEffect(() => {
    if (isRoundFinished) return
    const timerId = window.setInterval(() => setNow(Date.now()), 100)
    return () => window.clearInterval(timerId)
  }, [isRoundFinished])

  useEffect(() => {
    if (isRoundFinished) return
    if (secondsLeft <= 0) {
      advanceQuestion(false)
    }
  }, [isRoundFinished, secondsLeft])

  function startNextQuestion() {
    setQuestion(createDivisionQuestion())
    setAnswerText('')
    setFeedback(null)
    const startMs = Date.now()
    questionStartMsRef.current = startMs
    setDeadlineMs(startMs + QUESTION_TIME_LIMIT_SECONDS * 1000)
  }

  function advanceQuestion(wasCorrect: boolean) {
    setQuestionIndex((prev) => prev + 1)
    if (wasCorrect) {
      setCorrectAnswers((prev) => prev + 1)
    } else {
      setFeedback(`Tiden tog slut eller fel svar. Ratt svar var ${question.answer}.`)
    }
    startNextQuestion()
  }

  function handleSubmitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isRoundFinished) return

    const parsed = Number(answerText)
    const isCorrect = Number.isInteger(parsed) && parsed === question.answer

    if (!isCorrect) {
      advanceQuestion(false)
      return
    }

    const responseTimeSeconds = (Date.now() - questionStartMsRef.current) / 1000
    const points = calculatePoints(responseTimeSeconds)
    setScore((prev) => prev + points)
    setFeedback(`Ratt! +${points} poang.`)
    advanceQuestion(true)
  }

  async function handleSaveScore(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isRoundFinished) return

    const trimmedName = playerName.trim()
    if (trimmedName.length < 2 || trimmedName.length > 20) {
      setSaveMessage('Namn maste vara mellan 2 och 20 tecken.')
      return
    }

    setIsSaving(true)
    setSaveMessage(null)
    const result = await onSaveScore({
      player_name: trimmedName,
      score,
      correct_answers: correctAnswers,
      total_questions: TOTAL_QUESTIONS,
    })
    setSaveMessage(result.message)
    setIsSaving(false)
  }

  function restartRound() {
    const startMs = Date.now()
    questionStartMsRef.current = startMs
    setQuestionIndex(0)
    setQuestion(createDivisionQuestion())
    setAnswerText('')
    setScore(0)
    setCorrectAnswers(0)
    setFeedback(null)
    setPlayerName('')
    setSaveMessage(null)
    setDeadlineMs(startMs + QUESTION_TIME_LIMIT_SECONDS * 1000)
  }

  return (
    <section className="panel game-panel">
      <h2>Spelplan</h2>
      {!isRoundFinished && (
        <>
          <div className="stats">
            <p>Fraga: {questionIndex + 1}/{TOTAL_QUESTIONS}</p>
            <p>Poang: {score}</p>
            <p>Tid kvar: {secondsLeft.toFixed(1)} sek</p>
          </div>
          <p className="question">
            {question.dividend} / {question.divisor} = ?
          </p>
          <form onSubmit={handleSubmitAnswer} className="row-form">
            <input
              type="number"
              inputMode="numeric"
              value={answerText}
              onChange={(event) => setAnswerText(event.target.value)}
              placeholder="Skriv ditt svar"
              autoFocus
            />
            <button type="submit">Svara</button>
          </form>
        </>
      )}

      {isRoundFinished && (
        <>
          <div className="stats">
            <p>Rundan ar slut!</p>
            <p>Total poang: {score}</p>
            <p>
              Ratt svar: {correctAnswers}/{TOTAL_QUESTIONS}
            </p>
          </div>
          <form onSubmit={handleSaveScore} className="row-form">
            <input
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              placeholder="Ditt namn"
              minLength={2}
              maxLength={20}
            />
            <button type="submit" disabled={isSaving}>
              {isSaving ? 'Sparar...' : 'Spara poang'}
            </button>
          </form>
          <button type="button" className="secondary-btn" onClick={restartRound}>
            Spela igen
          </button>
        </>
      )}
      {feedback && <p>{feedback}</p>}
      {saveMessage && <p>{saveMessage}</p>}
    </section>
  )
}

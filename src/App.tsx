import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { GameBoard } from './components/GameBoard'
import { HighscorePanel } from './components/HighscorePanel'
import { type NewScoreInput, fetchHighscores, submitScore } from './lib/scores'

function App() {
  const [scores, setScores] = useState<Awaited<ReturnType<typeof fetchHighscores>>>([])
  const [isLoadingScores, setIsLoadingScores] = useState(false)
  const [scoresError, setScoresError] = useState<string | null>(null)

  const loadScores = useCallback(async () => {
    setIsLoadingScores(true)
    setScoresError(null)
    try {
      const nextScores = await fetchHighscores()
      setScores(nextScores)
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Kunde inte hämta highscorelista.'
      setScoresError(message)
    } finally {
      setIsLoadingScores(false)
    }
  }, [])

  useEffect(() => {
    void loadScores()
  }, [loadScores])

  const handleSaveScore = useCallback(
    async (entry: NewScoreInput) => {
      try {
        await submitScore(entry)
        await loadScores()
        return { ok: true as const, message: 'Poängen är sparad.' }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Kunde inte spara poängen.'
        return { ok: false as const, message }
      }
    },
    [loadScores],
  )

  return (
    <main className="app">
      <header className="app-header">
        <h1>Divisionsracet</h1>
        <p>Svara snabbt och korrekt för att samla fler poäng.</p>
      </header>
      <section className="layout">
        <GameBoard onSaveScore={handleSaveScore} />
        <HighscorePanel
          scores={scores}
          isLoading={isLoadingScores}
          errorMessage={scoresError}
        />
      </section>
    </main>
  )
}

export default App

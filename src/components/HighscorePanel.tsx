import type { ScoreEntry } from '../lib/scores'

type HighscorePanelProps = {
  scores: ScoreEntry[]
  isLoading: boolean
  errorMessage: string | null
}

export function HighscorePanel({
  scores,
  isLoading,
  errorMessage,
}: HighscorePanelProps) {
  return (
    <aside className="panel highscore-panel">
      <h2>Highscores</h2>
      <p className="panel-subtitle">Topplistan uppdateras efter varje runda.</p>

      {isLoading && <p>Laddar highscorelista...</p>}
      {errorMessage && <p className="error-text">{errorMessage}</p>}

      {!isLoading && !errorMessage && scores.length === 0 && (
        <p>Inga poäng sparade än.</p>
      )}

      {!isLoading && !errorMessage && scores.length > 0 && (
        <ol className="score-list">
          {scores.map((entry, index) => (
            <li key={`${entry.name}-${entry.score}-${index}`}>
              <div>
                <strong>{entry.name}</strong>
              </div>
              <span>{entry.score} p</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}

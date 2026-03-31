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
        <p>Inga poang sparade an.</p>
      )}

      {!isLoading && !errorMessage && scores.length > 0 && (
        <ol className="score-list">
          {scores.map((entry) => (
            <li key={entry.id}>
              <div>
                <strong>{entry.player_name}</strong>
                <small>
                  {entry.correct_answers}/{entry.total_questions} ratt
                </small>
              </div>
              <span>{entry.score} p</span>
            </li>
          ))}
        </ol>
      )}
    </aside>
  )
}

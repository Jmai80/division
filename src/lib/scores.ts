import { supabase } from './supabase'
const SCORE_TABLE = 'division_highscore'

export type ScoreEntry = {
  name: string
  score: number
}

export type NewScoreInput = {
  name: string
  score: number
}

export async function fetchHighscores(limit = 10): Promise<ScoreEntry[]> {
  if (!supabase) {
    throw new Error('Supabase saknas. Fyll i VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.')
  }

  const { data, error } = await supabase
    .from(SCORE_TABLE)
    .select('name, score')
    .order('score', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Kunde inte hämta highscores: ${error.message}`)
  }

  return data as ScoreEntry[]
}

export async function submitScore(payload: NewScoreInput): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase saknas. Fyll i VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.')
  }

  const { error } = await supabase.from(SCORE_TABLE).insert(payload)

  if (error) {
    throw new Error(`Kunde inte spara poäng: ${error.message}`)
  }
}

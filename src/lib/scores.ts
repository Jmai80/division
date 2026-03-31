import { supabase } from './supabase'

export type ScoreEntry = {
  id: string
  player_name: string
  score: number
  correct_answers: number
  total_questions: number
  created_at: string
}

export type NewScoreInput = {
  player_name: string
  score: number
  correct_answers: number
  total_questions: number
}

export async function fetchHighscores(limit = 10): Promise<ScoreEntry[]> {
  if (!supabase) {
    throw new Error('Supabase saknas. Fyll i VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.')
  }

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    throw new Error(`Kunde inte hamta highscores: ${error.message}`)
  }

  return data as ScoreEntry[]
}

export async function submitScore(payload: NewScoreInput): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase saknas. Fyll i VITE_SUPABASE_URL och VITE_SUPABASE_ANON_KEY.')
  }

  const { error } = await supabase.from('scores').insert(payload)

  if (error) {
    throw new Error(`Kunde inte spara poang: ${error.message}`)
  }
}

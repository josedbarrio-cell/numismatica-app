export const BASE_URL = import.meta.env.DEV 
  ? '' 
  : 'https://dancing-starship-bc2372.netlify.app'
export const COINS_URL = `${BASE_URL}/coins.json`
export const IMG_URL   = (path) => path ? `${BASE_URL}/${path}` : null
export const ANTHROPIC_MODEL = 'claude-opus-4-6'

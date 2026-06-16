// Netlify Build Script
// Schreibt ENV-Variablen als config.js
const fs = require('fs')

const config = {
  SUPABASE_URL:       process.env.SUPABASE_URL        || '',
  SUPABASE_KEY:       process.env.SUPABASE_ANON_KEY   || '',
}

const content = 'window.CLAVIS_CONFIG = ' + JSON.stringify(config) + ';'
fs.writeFileSync('config.js', content)
console.log('config.js created. URL set:', !!config.SUPABASE_URL)

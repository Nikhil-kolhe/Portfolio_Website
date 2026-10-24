import { createRoot } from 'react-dom/client'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/500.css'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import App from './App'
import './styles.css'
createRoot(document.getElementById('root')!).render(<App />)

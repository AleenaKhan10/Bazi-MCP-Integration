/* ===========================================
   main.jsx — Application Entry Point
   ===========================================
   
   This is the first JavaScript file that runs.
   It mounts the React app to the DOM.
   
   React.StrictMode is enabled for development —
   it helps catch bugs by rendering twice in dev.
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Mount the React app into the #root div in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

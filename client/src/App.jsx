// App.jsx - Root component of the application
// Wraps everything with AppProvider (for global state) and AppRoutes (for navigation)

import { AppProvider } from './context/AppContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}

export default App

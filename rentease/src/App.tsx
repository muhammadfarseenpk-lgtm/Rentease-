import { AppRoutes } from "./router"
import { ErrorBoundary } from "./ErrorBoundary"

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  )
}

export default App

import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    // Apply RTL based on language here if needed later
    // document.documentElement.dir = i18n.dir();
  }, []);

  return <RouterProvider router={router} />
}

export default App

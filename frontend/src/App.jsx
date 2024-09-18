import React from 'react'
import Layout from './components/layout/Layout'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
      </Routes>
      <Toaster />
    </Layout>
  )
}

export default App

import React from 'react'
import Layout from './components/layout/Layout'
import { Route, Routes } from 'react-router-dom'
import SignUpPage from './pages/auth/SignUpPage'
import LoginPage from './pages/auth/LoginPage'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'

const App = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        console.log(res.data);
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401){
          return null;
        }
        toast.error(error.response.data.message || "Something went wrong");
      }
    }
  })
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

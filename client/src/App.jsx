import { useState } from 'react'
import './App.css'
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import { TransactionProvider } from './components/context/TransactionContext';


function App() {

  return (
    <div className="min-h-screen" style={{width:'100%', height:'100%'}}>
      <div className="gradient-bg-welcome">
        <TransactionProvider>
        <Navbar />
        <Home />
        </TransactionProvider>
      </div>
    </div>
  )
}

export default App

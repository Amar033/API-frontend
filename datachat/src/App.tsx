import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Example from './page/Hero'
import './index.css'
import Login from './page/Login';
import Dashboard from './page/Dashboard';
import Dither from './components/design/Dither';
function App() {
  const [count, setCount] = useState(0)

  return (
   <Routes>
      <Route path="/" element={<Example />} />
      <Route path="/login" element={<Login />} />
       <Route path="/dashboard" element={<Dashboard onLogout={function (): void {
        throw new Error('Function not implemented.');
      } } />} />
       <Route path="/dither" element={<Dither />} />
    </Routes>
  );
}

export default App

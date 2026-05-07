import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./components/Login"; 
import SelectActivity from "./components/SelectActivity";
import Register from "./components/Register";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protect routes by session control from backend */}
            <Route path="/selectActivity" element={<ProtectedRoute><SelectActivity /></ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
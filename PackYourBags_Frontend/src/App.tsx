import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import ProtectedRoute from './components/ProtectedRoute';
import Login from "./components/Login"; 
import SelectActivity from "./components/SelectActivity";
import Register from "./components/Register";
import MainMenu from "./components/MainMenu";


function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Protect routes by session control from backend */}
            <Route path="/selectActivity" element={<ProtectedRoute> <SelectActivity /> </ProtectedRoute>} />
            <Route path="/mainMenu" element={<ProtectedRoute> <MainMenu /> </ProtectedRoute>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
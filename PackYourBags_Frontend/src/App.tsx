import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./components/Login/login"; 
import SelectActivity from "./components/SelectActivity/selectActivity";
import Register from "./components/Register/register";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/selectActivity" element={<SelectActivity />} />
            <Route path="/register" element={<Register />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
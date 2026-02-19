import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./components/login/Login"; 
import SelectActivity from "./components/selectActivity/SelectActivity";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/SelectActivity" element={<SelectActivity />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
import './index.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Home /> */}
            </Routes>
        </Router>
    )
}

export default App

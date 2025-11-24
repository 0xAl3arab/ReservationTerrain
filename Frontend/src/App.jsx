import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ClientSignupPage from "./pages/Client/ClientSignup.jsx";
import ClientLoginPage from "./pages/Client/ClientLoginPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/signup">Signup</Link> |{" "}
                <Link to="/login">Login</Link>
            </nav>

            <Routes>
                <Route path="/signup" element={<ClientSignupPage />} />
                <Route path="/login" element={<ClientLoginPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ClientSignupPage from "./pages/Client/ClientSignup.jsx";
import ClientLoginPage from "./pages/Client/ClientLoginPage.jsx";
import OwnerDashboard from "./pages/Owner/OwnerDashboard.jsx"; 

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/signup">Signup</Link> |{" "}
                <Link to="/login">Login</Link>
                <Link to="/owner" style={{ fontWeight: "bold", color: "blue" }}> Espace Propriétaire</Link>

            </nav>

            <Routes>
                <Route path="/signup" element={<ClientSignupPage />} />
                <Route path="/login" element={<ClientLoginPage />} />
                <Route path="/owner" element={<OwnerDashboard />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;

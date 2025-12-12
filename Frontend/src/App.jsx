import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import ClientSignupPage from "./pages/Client/ClientSignup.jsx";
import ClientLoginPage from "./pages/Client/ClientLoginPage.jsx";
import ComplexeListPage from "./pages/Client/ComplexeListPage.jsx";

function App() {
    return (
        <BrowserRouter>


            <Routes>
                <Route path="/" element={<ComplexeListPage />} />
                <Route path="/signup" element={<ClientSignupPage />} />
                <Route path="/login" element={<ClientLoginPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

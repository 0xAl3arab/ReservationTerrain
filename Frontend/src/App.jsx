import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import ClientSignupPage from "./pages/Client/ClientSignup.jsx";
import ClientLoginPage from "./pages/Client/ClientLoginPage.jsx";
import ComplexeListPage from "./pages/Client/ComplexeListPage.jsx";
import ClientProfilePage from "./pages/Client/ClientProfilePage.jsx";
import TerrainDetailsPage from "./pages/Client/TerrainDetailsPage.jsx";
import PaiementPage from "./pages/Client/PaiementPage.jsx";
import ConfirmationPage from "./pages/Client/ConfirmationPage.jsx";

function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ComplexeListPage />} />
                <Route path="/signup" element={<ClientSignupPage />} />
                <Route path="/login" element={<ClientLoginPage />} />
                <Route path="/profile" element={<ClientProfilePage />} />
                <Route path="/complexes/:id/terrains" element={<TerrainDetailsPage />} />
                <Route path="/paiement" element={<PaiementPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

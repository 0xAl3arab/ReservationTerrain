import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import ClientSignupPage from "./pages/Client/ClientSignup.jsx";
import ClientLoginPage from "./pages/Client/ClientLoginPage.jsx";
import ComplexeListPage from "./pages/Client/ComplexeListPage.jsx";
import ClientProfilePage from "./pages/Client/ClientProfilePage.jsx";
import HistoryPage from "./pages/Client/HistoryPage.jsx";
import TerrainDetailsPage from "./pages/Client/TerrainDetailsPage.jsx";
import PaiementPage from "./pages/Client/PaiementPage.jsx";
import ConfirmationPage from "./pages/Client/ConfirmationPage.jsx";
import AdminLoginPage from "./pages/Admin/AdminLoginPage.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminComplexesPage from "./pages/Admin/AdminComplexesPage.jsx";
import AdminReservationsPage from "./pages/Admin/AdminReservationsPage.jsx";
import JoinUsPage from "./pages/Client/JoinUsPage.jsx";
import RulesPage from "./pages/Client/RulesPage.jsx";

function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ComplexeListPage />} />
                <Route path="/signup" element={<ClientSignupPage />} />
                <Route path="/login" element={<ClientLoginPage />} />
                <Route path="/profile" element={<ClientProfilePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/complexes/:id/terrains" element={<TerrainDetailsPage />} />
                <Route path="/paiement" element={<PaiementPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/complexes" element={<AdminComplexesPage />} />
                <Route path="/admin/reservations" element={<AdminReservationsPage />} />
                <Route path="/join-us" element={<JoinUsPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

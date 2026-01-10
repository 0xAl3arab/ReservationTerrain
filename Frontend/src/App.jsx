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
import OwnerLoginPage from "./pages/Owner/OwnerLoginPage.jsx";
import OwnerDashboard from "./pages/Owner/OwnerDashboard.jsx";
import OwnerProfilePage from "./pages/Owner/OwnerProfilePage.jsx";
import OwnerReservationsPage from "./pages/Owner/OwnerReservationsPage.jsx";
import OwnerTerrainsPage from "./pages/Owner/OwnerTerrainsPage.jsx";
import OwnerComplexPage from "./pages/Owner/OwnerComplexPage.jsx";
import FindTeamPage from "./pages/Client/FindTeamPage.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ROUTES CLIENT */}
                <Route path="/" element={<ComplexeListPage />} />
                <Route path="/signup" element={<ClientSignupPage />} />
                <Route path="/login" element={<ClientLoginPage />} />
                <Route path="/profile" element={<ClientProfilePage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/complexes/:id/terrains" element={<TerrainDetailsPage />} />
                <Route path="/paiement" element={<PaiementPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />

                {/* ROUTES OWNER */}
                <Route path="/owner/login" element={<OwnerLoginPage />} />
                <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                <Route path="/owner/profile" element={<OwnerProfilePage />} />
                <Route path="/owner/reservations" element={<OwnerReservationsPage />} />
                <Route path="/owner/terrains" element={<OwnerTerrainsPage />} />
                <Route path="/owner/complexe" element={<OwnerComplexPage />} />

                {/* ROUTES ADMIN */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/complexes" element={<AdminComplexesPage />} />
                <Route path="/admin/reservations" element={<AdminReservationsPage />} />
                <Route path="/join-us" element={<JoinUsPage />} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/find-team" element={<FindTeamPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
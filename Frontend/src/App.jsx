import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Client
import ClientSignupPage from "./pages/Client/ClientSignup.jsx";
import ClientLoginPage from "./pages/Client/ClientLoginPage.jsx";
import ComplexeListPage from "./pages/Client/ComplexeListPage.jsx";
import ClientProfilePage from "./pages/Client/ClientProfilePage.jsx";
import ComplexeDetailsPage from "./pages/Client/ComplexeDetailsPage.jsx";

// Owner
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerDashboard from "./pages/Owner/OwnerDashboard";
import OwnerComplexes from "./pages/Owner/OwnerComplexes";
import OwnerLoginPage from "./pages/Owner/OwnerLoginPage";
// 👇 1. VÉRIFIE QUE CET IMPORT EST PRÉSENT
import OwnerComplexDetails from "./pages/Owner/OwnerComplexDetails";
import OwnerReservations from "./pages/Owner/OwnerReservations";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- CLIENT --- */}
                <Route path="/" element={<ComplexeListPage />} />
                <Route path="/signup" element={<ClientSignupPage />} />
                <Route path="/login" element={<ClientLoginPage />} />
                <Route path="/profile" element={<ClientProfilePage />} />
                <Route path="/complexes/:id" element={<ComplexeDetailsPage />} />

                {/* --- OWNER --- */}
                <Route path="/owner/login" element={<OwnerLoginPage />} />

                <Route path="/owner" element={<OwnerLayout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<OwnerDashboard />} />
                    <Route path="complexes" element={<OwnerComplexes />} />
                    
                    {/* 👇 2. VÉRIFIE QUE CETTE ROUTE EXISTE BIEN ICI */}
                    <Route path="complexes/:id" element={<OwnerComplexDetails />} />
                    
                    <Route path="reservations" element={<OwnerReservations />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
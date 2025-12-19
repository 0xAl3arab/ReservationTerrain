import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Client
import ClientSignupPage from "./pages/Client/ClientSignup.jsx";
import ClientLoginPage from "./pages/Client/ClientLoginPage.jsx";
import ComplexeListPage from "./pages/Client/ComplexeListPage.jsx";
import ClientProfilePage from "./pages/Client/ClientProfilePage.jsx";

// Owner
import OwnerLayout from "./layouts/OwnerLayout";
import OwnerComplexes from "./pages/Owner/OwnerComplexes";
import OwnerLoginPage from "./pages/Owner/OwnerLoginPage";
import OwnerComplexDetails from "./pages/Owner/OwnerComplexDetails"; 

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- CLIENT --- */}
                <Route path="/" element={<ComplexeListPage />} />
                <Route path="/signup" element={<ClientSignupPage />} />
                <Route path="/login" element={<ClientLoginPage />} />
                <Route path="/profile" element={<ClientProfilePage />} />

                {/* --- OWNER PUBLIC --- */}
                <Route path="/owner/login" element={<OwnerLoginPage />} />

                {/* --- OWNER PRIVÉ --- */}
                <Route path="/owner" element={<OwnerLayout />}>
                    <Route index element={<Navigate to="complexes" replace />} />
                    <Route path="complexes" element={<OwnerComplexes />} />
                    
                    {/* 👇 VÉRIFIE QUE CETTE LIGNE EST BIEN DANS LA ROUTE OWNER */}
                    <Route path="complexes/:id" element={<OwnerComplexDetails />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
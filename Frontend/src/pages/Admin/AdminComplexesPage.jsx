import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import CreateOwnerModal from "../../components/Admin/CreateOwnerModal";

function AdminComplexesPage() {
    const navigate = useNavigate();
    const [complexes, setComplexes] = useState([]);
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isCreateOwnerModalOpen, setIsCreateOwnerModalOpen] = useState(false);
    const [currentComplex, setCurrentComplex] = useState(null);
    const [formData, setFormData] = useState({
        nom: "",
        ville: "",
        adress: "",
        ownerId: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("admin_access_token");
        if (!token) {
            navigate("/admin/login");
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("admin_access_token");
            const headers = { "Authorization": `Bearer ${token}` };

            const [complexesRes, ownersRes] = await Promise.all([
                fetch("http://localhost:8080/api/complexes", { headers }),
                fetch("http://localhost:8080/api/owners", { headers })
            ]);

            if (!complexesRes.ok || !ownersRes.ok) throw new Error("Failed to fetch data");

            const complexesData = await complexesRes.json();
            const ownersData = await ownersRes.json();

            setComplexes(complexesData);
            setOwners(ownersData);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Could not load data.");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (complex = null) => {
        if (complex) {
            setCurrentComplex(complex);
            setFormData({
                nom: complex.nom,
                ville: complex.ville,
                adress: complex.adress,
                ownerId: complex.owner ? complex.owner.id : ""
            });
        } else {
            setCurrentComplex(null);
            setFormData({ nom: "", ville: "", adress: "", ownerId: "" });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentComplex(null);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("admin_access_token");
            const headers = {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            const url = currentComplex
                ? `http://localhost:8080/api/complexes/${currentComplex.id}`
                : "http://localhost:8080/api/complexes";

            const method = currentComplex ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Operation failed");

            await fetchData();
            handleCloseModal();
        } catch (err) {
            console.error("Error saving complex:", err);
            alert("Failed to save complex");
        }
    };

    const handleDeleteClick = (complex) => {
        setCurrentComplex(complex);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("admin_access_token");
            const res = await fetch(`http://localhost:8080/api/complexes/${currentComplex.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Delete failed");

            await fetchData();
            setIsDeleteModalOpen(false);
            setCurrentComplex(null);
        } catch (err) {
            console.error("Error deleting complex:", err);
            alert("Failed to delete complex");
        }
    };

    const handleOwnerCreated = (newOwner) => {
        setOwners([...owners, newOwner]);
        setFormData({ ...formData, ownerId: newOwner.id });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <AdminNavbar />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">Complexes Management</h2>
                        <p className="text-gray-500">View and manage all registered sports complexes.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#0B2CFF] hover:bg-[#001B87] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                        + Add New Complexe
                    </button>
                </div>

                {/* Complexes Table Section */}
                <div className="bg-[#141414] border border-[#222] rounded-3xl overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="p-24 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF] mx-auto mb-6"></div>
                            <p className="text-gray-500 font-medium">Fetching data...</p>
                        </div>
                    ) : error ? (
                        <div className="p-24 text-center text-red-500">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[#1a1a1a] text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                                        <th className="px-8 py-5">Name & ID</th>
                                        <th className="px-8 py-5">Location</th>
                                        <th className="px-8 py-5">Owner Details</th>
                                        <th className="px-8 py-5">Contact Info</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#222]">
                                    {complexes.map((complex) => (
                                        <tr key={complex.id} className="hover:bg-[#1a1a1a] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="font-bold text-white text-lg">{complex.nom}</div>
                                                <div className="text-xs text-gray-500 font-mono">ID: #{complex.id}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-medium">{complex.ville}</div>
                                                <div className="text-xs text-gray-500 mt-1">{complex.adress}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#222] flex items-center justify-center text-[10px] font-bold text-[#0B2CFF]">
                                                        {complex.owner?.prenom?.[0] || "?"}{complex.owner?.nom?.[0] || "?"}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium">
                                                            {complex.owner ? `${complex.owner.prenom} ${complex.owner.nom}` : "No Owner"}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 uppercase tracking-tighter">Owner</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm">{complex.owner?.email || "N/A"}</div>
                                                <div className="text-xs text-gray-500 mt-1">{complex.owner?.numTele || "N/A"}</div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleOpenModal(complex)}
                                                        className="p-2 text-gray-500 hover:text-white hover:bg-[#222] rounded-lg transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(complex)}
                                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141414] border border-[#222] rounded-3xl p-8 w-full max-w-lg">
                        <h3 className="text-2xl font-bold mb-6">{currentComplex ? "Edit Complex" : "New Complex"}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Name</label>
                                <input
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">City</label>
                                <input
                                    name="ville"
                                    value={formData.ville}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Address</label>
                                <input
                                    name="adress"
                                    value={formData.adress}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Owner</label>
                                <div className="flex gap-2">
                                    <select
                                        name="ownerId"
                                        value={formData.ownerId}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0B2CFF]"
                                        required
                                    >
                                        <option value="">Select an Owner</option>
                                        {owners.map(owner => (
                                            <option
                                                key={owner.id}
                                                value={owner.id}
                                                disabled={owner.hasComplexe && owner.id !== currentComplex?.owner?.id}
                                            >
                                                {owner.prenom} {owner.nom} ({owner.email})
                                                {owner.hasComplexe && owner.id !== currentComplex?.owner?.id ? " - Taken" : ""}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOwnerModalOpen(true)}
                                        className="bg-[#222] hover:bg-[#333] text-white px-4 rounded-xl font-bold transition-all border border-[#333] whitespace-nowrap"
                                        title="Create New Owner"
                                    >
                                        + New
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 bg-[#222] hover:bg-[#333] text-white py-3 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#0B2CFF] hover:bg-[#001B87] text-white py-3 rounded-xl font-bold transition-all"
                                >
                                    Save Complex
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Create Owner Modal */}
            <CreateOwnerModal
                isOpen={isCreateOwnerModalOpen}
                onClose={() => setIsCreateOwnerModalOpen(false)}
                onSuccess={handleOwnerCreated}
            />

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#141414] border border-[#222] rounded-3xl p-8 w-full max-w-md text-center">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Delete Complex?</h3>
                        <p className="text-gray-500 mb-8">Are you sure you want to delete <span className="text-white font-bold">{currentComplex?.nom}</span>? This action cannot be undone.</p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="flex-1 bg-[#222] hover:bg-[#333] text-white py-3 rounded-xl font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-all"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminComplexesPage;

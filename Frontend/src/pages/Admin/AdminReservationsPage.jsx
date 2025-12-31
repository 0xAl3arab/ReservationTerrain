import React, { useState, useEffect } from "react";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import ReservationsTable from "../../components/Admin/ReservationsTable";
import EditReservationModal from "../../components/Admin/EditReservationModal";

const AdminReservationsPage = () => {
    const [reservations, setReservations] = useState([]);
    const [complexes, setComplexes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(true);
    const [selectedIds, setSelectedIds] = useState([]);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingReservation, setEditingReservation] = useState(null);

    const [filters, setFilters] = useState({
        complexId: "",
        clientQuery: "",
        dateFrom: "",
        dateTo: "",
        status: "",
        durationRange: "" // <60, 60-180, 180-360, >360
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReservations();
        }, 300); // Debounce for search inputs
        return () => clearTimeout(timer);
    }, [filters]);

    const fetchInitialData = async () => {
        const token = localStorage.getItem("admin_access_token");
        try {
            const complexRes = await fetch("http://localhost:8080/api/complexes", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (complexRes.ok) {
                setComplexes(await complexRes.json());
            }
        } catch (error) {
            console.error("Error fetching initial data:", error);
        }
    };

    const fetchReservations = async () => {
        setLoading(true);
        const token = localStorage.getItem("admin_access_token");
        try {
            const queryParams = new URLSearchParams();
            if (filters.complexId) queryParams.append("complexId", filters.complexId);
            if (filters.clientQuery) queryParams.append("clientQuery", filters.clientQuery);
            if (filters.dateFrom) queryParams.append("dateFrom", filters.dateFrom);
            if (filters.dateTo) queryParams.append("dateTo", filters.dateTo);
            if (filters.status) queryParams.append("status", filters.status);

            // Handle Duration Logic
            if (filters.durationRange) {
                if (filters.durationRange === "<60") {
                    queryParams.append("maxDuration", "59");
                } else if (filters.durationRange === "60-180") {
                    queryParams.append("minDuration", "60");
                    queryParams.append("maxDuration", "180");
                } else if (filters.durationRange === "180-360") {
                    queryParams.append("minDuration", "180");
                    queryParams.append("maxDuration", "360");
                } else if (filters.durationRange === ">360") {
                    queryParams.append("minDuration", "361");
                }
            }

            const response = await fetch(`http://localhost:8080/api/reservations/filter?${queryParams.toString()}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                setReservations(await response.json());
            }
        } catch (error) {
            console.error("Error fetching reservations:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const resetFilters = () => {
        setFilters({
            complexId: "",
            clientQuery: "",
            dateFrom: "",
            dateTo: "",
            status: "",
            durationRange: ""
        });
    };

    const handleAction = async (action, reservation) => {
        if (action === 'edit') {
            setEditingReservation(reservation);
            setIsEditModalOpen(true);
        } else if (action === 'cancel') { // This is actually delete
            if (window.confirm('Are you sure you want to delete this reservation?')) {
                await deleteReservation(reservation.id);
            }
        }
    };

    const deleteReservation = async (id) => {
        const token = localStorage.getItem("admin_access_token");
        try {
            const response = await fetch(`http://localhost:8080/api/reservations/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (response.ok) {
                fetchReservations(); // Refresh list
            } else {
                alert("Failed to delete reservation");
            }
        } catch (error) {
            console.error("Error deleting reservation:", error);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} reservations?`)) return;

        const token = localStorage.getItem("admin_access_token");
        try {
            const response = await fetch(`http://localhost:8080/api/reservations`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(selectedIds)
            });

            if (response.ok) {
                setSelectedIds([]); // Clear selection
                fetchReservations(); // Refresh list
            } else {
                alert("Failed to delete reservations");
            }
        } catch (error) {
            console.error("Error deleting reservations:", error);
        }
    };

    const handleUpdateSuccess = (updatedReservation) => {
        fetchReservations(); // Refresh list to show updated data
        setIsEditModalOpen(false); // Close modal after successful update
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
            <AdminNavbar />

            <div className="flex flex-1 max-w-[1600px] mx-auto w-full px-6 py-8 gap-8">
                {/* Sidebar Filters */}
                <aside className={`w-72 flex-shrink-0 transition-all duration-300 ${showFilters ? 'translate-x-0' : '-translate-x-full absolute'}`}>
                    <div className="bg-[#141414] border border-[#222] rounded-2xl p-6 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-white">Filters</h3>
                            <button onClick={resetFilters} className="text-xs text-red-500 hover:text-red-400 font-bold uppercase tracking-wider">Clear All</button>
                        </div>

                        <div className="space-y-6">
                            {/* Date Range */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block tracking-wider">From</label>
                                    <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-xs focus:border-[#0B2CFF] outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block tracking-wider">To</label>
                                    <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-xs focus:border-[#0B2CFF] outline-none transition-colors" />
                                </div>
                            </div>

                            {/* Complex */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-wider">Complex</label>
                                <select name="complexId" value={filters.complexId} onChange={handleFilterChange} className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm focus:border-[#0B2CFF] outline-none transition-colors">
                                    <option value="">All Complexes</option>
                                    {complexes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
                                </select>
                            </div>

                            {/* Client Search */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-wider">Client</label>
                                <input
                                    type="text"
                                    name="clientQuery"
                                    value={filters.clientQuery}
                                    onChange={handleFilterChange}
                                    placeholder="Search name or email..."
                                    className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm focus:border-[#0B2CFF] outline-none transition-colors placeholder-gray-600"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-wider">Status</label>
                                <select name="status" value={filters.status} onChange={handleFilterChange} className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm focus:border-[#0B2CFF] outline-none transition-colors">
                                    <option value="">All Statuses</option>
                                    <option value="CONFIRMEE">Confirmed</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="ANNULEE">Cancelled</option>
                                    <option value="COMPLETED">Completed</option>
                                </select>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-wider">Duration</label>
                                <select name="durationRange" value={filters.durationRange} onChange={handleFilterChange} className="w-full bg-[#0a0a0a] border border-[#333] rounded px-3 py-2 text-sm focus:border-[#0B2CFF] outline-none transition-colors">
                                    <option value="">Any Duration</option>
                                    <option value="<60">Less than 1h</option>
                                    <option value="60-180">1h - 3h</option>
                                    <option value="180-360">3h - 6h</option>
                                    <option value=">360">More than 6h</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 w-full overflow-hidden">
                    <div className="mb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Reservations</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage and track all bookings</p>
                        </div>
                        <div className="flex items-center gap-4">
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Delete Selected ({selectedIds.length})
                                </button>
                            )}
                            <div className="bg-[#141414] border border-[#222] px-4 py-2 rounded-lg text-sm text-gray-400">
                                <span className="text-white font-bold">{reservations.length}</span> results found
                            </div>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden bg-[#1a1a1a] border border-[#333] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#252525] transition-colors"
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <ReservationsTable
                        reservations={reservations}
                        loading={loading}
                        onAction={handleAction}
                        onSelectionChange={setSelectedIds}
                    />
                </main>
            </div>

            {/* Edit Modal */}
            <EditReservationModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                reservation={editingReservation}
                onUpdate={handleUpdateSuccess}
            />
        </div>
    );
};

export default AdminReservationsPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";
import OwnerNavbar from "../../components/OwnerNavbar";
import { Modal, Form, Input, Select, message, Tag } from 'antd';
import { terrainImages } from "../../assets/terrains";

function OwnerTerrainsPage() {
    const [terrains, setTerrains] = useState([]);
    const [owner, setOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTerrain, setEditingTerrain] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [terrainsData, profileData] = await Promise.all([
                ownerService.getMyTerrains(),
                ownerService.getProfile()
            ]);
            setTerrains(terrainsData);
            setOwner(profileData);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) navigate("/owner/login");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (terrain = null) => {
        setEditingTerrain(terrain);
        if (terrain) {
            form.setFieldsValue(terrain);
            setImagePreview(terrain.image || null);
        } else {
            form.resetFields();
            setImagePreview(null);
        }
        setIsModalOpen(true);
    };


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                message.error('Image trop grande! Maximum 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String);
                form.setFieldsValue({ image: base64String });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = async (values) => {
        try {
            if (editingTerrain) {
                await ownerService.updateTerrain(editingTerrain.id, values);
                message.success("Terrain mis à jour avec succès");
            } else {
                await ownerService.addTerrain(values);
                message.success("Terrain ajouté avec succès");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error(err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                message.error("Session expirée. Veuillez vous reconnecter.");
                navigate("/owner/login");
            } else {
                message.error("Une erreur est survenue");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("owner_token");
        navigate("/owner/login");
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
            <OwnerNavbar owner={owner} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">Mes Terrains</h2>
                        <p className="text-gray-500 font-medium">Gérez vos installations sportives.</p>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-[#0B2CFF] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        + Ajouter un terrain
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {terrains.map(terrain => (
                        <div key={terrain.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-500">
                            <div className="h-56 bg-gray-100 relative overflow-hidden">
                                <img
                                    src={terrain.image || terrainImages[terrain.nom] || terrainImages.default}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    alt={terrain.nom}
                                />
                                <div className="absolute top-4 right-4">
                                    <Tag color={terrain.status === "OUVERT" ? "green" : "red"} className="rounded-lg font-black uppercase tracking-widest text-[10px] px-3 py-1 m-0 border-none shadow-lg">
                                        {terrain.status}
                                    </Tag>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <h3 className="text-xl font-bold text-white tracking-tight">{terrain.nom}</h3>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Prix par heure</p>
                                        <span className="text-3xl font-black text-[#0B2CFF]">{terrain.prixTerrain} <span className="text-sm">MAD</span></span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleOpenModal(terrain)}
                                    className="w-full py-4 bg-gray-50 hover:bg-gray-900 hover:text-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-gray-100"
                                >
                                    Modifier le terrain
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {terrains.length === 0 && (
                    <div className="bg-white rounded-[3rem] border border-gray-100 p-20 text-center shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-100">
                            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun terrain</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mb-10">Vous n'avez pas encore ajouté de terrain à votre complexe sportif.</p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="bg-[#0B2CFF] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
                        >
                            Ajouter mon premier terrain
                        </button>
                    </div>
                )}
            </main>

            <Modal
                title={
                    <div className="pb-4 border-b border-gray-100">
                        <h3 className="text-xl font-black text-[#0B2CFF] uppercase italic">Installation</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                            {editingTerrain ? "Modifier le terrain" : "Ajouter un nouveau terrain"}
                        </p>
                    </div>
                }
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                styles={{
                    mask: { backdropFilter: 'blur(4px)' },
                    content: { borderRadius: '2rem', padding: '2rem' }
                }}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                    className="mt-6"
                    initialValues={{ status: 'OUVERT' }}
                >
                    {/* Image Upload Section */}
                    <div className="mb-8">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 block mb-3">
                            Image du terrain
                        </label>
                        <div className="relative group cursor-pointer" onClick={() => document.getElementById('terrain-image-upload').click()}>
                            <div className="h-64 w-full rounded-[2rem] overflow-hidden bg-gray-100 border-2 border-gray-100 relative">
                                <img
                                    src={imagePreview || (editingTerrain ? (terrainImages[editingTerrain.nom] || terrainImages.default) : terrainImages.default)}
                                    alt="Terrain Preview"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-[#0B2CFF]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-sm">
                                    <div className="bg-white/20 p-4 rounded-full mb-3 backdrop-blur-md">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-white font-bold text-sm uppercase tracking-widest">Changer l'image</span>
                                </div>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                style={{ display: 'none' }}
                                id="terrain-image-upload"
                            />
                        </div>
                        <Form.Item name="image" hidden>
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item
                            name="nom"
                            label={<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nom du terrain</span>}
                            rules={[{ required: true, message: 'Requis' }]}
                        >
                            <Input placeholder="Ex: Terrain A" className="p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white transition-all font-bold" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Form.Item
                            name="prixTerrain"
                            label={<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Prix (MAD/h)</span>}
                            rules={[{ required: true, message: 'Requis' }]}
                        >
                            <Input type="number" placeholder="200" className="p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white transition-all font-bold" />
                        </Form.Item>
                        <Form.Item
                            name="status"
                            label={<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Statut</span>}
                            rules={[{ required: true, message: 'Requis' }]}
                        >
                            <Select className="h-[58px] rounded-2xl font-bold">
                                <Select.Option value="OUVERT">Ouvert</Select.Option>
                                <Select.Option value="FERME">Fermé</Select.Option>
                                <Select.Option value="MAINTENANCE">Maintenance</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>


                    <button
                        type="submit"
                        className="w-full bg-[#0B2CFF] text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-widest text-xs"
                    >
                        {editingTerrain ? "Enregistrer les modifications" : "Ajouter le terrain"}
                    </button>
                </Form>
            </Modal>
        </div>
    );
}

export default OwnerTerrainsPage;

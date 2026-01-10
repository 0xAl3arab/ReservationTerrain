import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ownerService from "../../services/ownerService";
import OwnerNavbar from "../../components/OwnerNavbar";
import { Modal, Form, Input, message } from 'antd';

function OwnerProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ nom: "", prenom: "", numTele: "" });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm] = Form.useForm();
    const [passwordLoading, setPasswordLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await ownerService.getProfile();
            setProfile(data);
            setForm({ nom: data.nom, prenom: data.prenom, numTele: data.numTele });
        } catch (err) {
            console.error(err);
            navigate("/owner/login");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await ownerService.updateProfile(form);
            setProfile({ ...profile, ...form });
            setIsEditing(false);
        } catch (err) {
            console.error("Update failed");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("owner_token");
        navigate("/owner/login");
    };

    const handlePasswordChange = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error("Les nouveaux mots de passe ne correspondent pas");
            return;
        }

        setPasswordLoading(true);
        try {
            await ownerService.changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            });
            message.success("Mot de passe mis à jour avec succès");
            setShowPasswordModal(false);
            passwordForm.resetFields();
        } catch (err) {
            console.error("Password change error:", err);
            message.error(err.response?.data?.message || err.response?.data || "Erreur lors du changement de mot de passe");
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2CFF]"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
            <OwnerNavbar owner={profile} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-6 py-12 w-full">
                <div className="mb-10 flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-bold mb-2">Mon Profil</h2>
                        <p className="text-gray-500 font-medium">Gérez vos accès et les informations de votre complexe.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Colonne Gauche : Infos Perso */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 text-[#0B2CFF] flex items-center justify-center font-bold text-2xl">
                                    {profile?.prenom?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{profile?.prenom} {profile?.nom}</h2>
                                    <p className="text-sm font-medium text-gray-400">{profile?.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowPasswordModal(true)}
                                        className="px-6 py-2 rounded-xl font-bold text-sm bg-white border-2 border-gray-100 text-gray-900 hover:border-[#0B2CFF] hover:text-[#0B2CFF] transition-all"
                                    >
                                        Changer le mot de passe
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${isEditing ? 'bg-gray-50 text-gray-400' : 'bg-[#0B2CFF] text-white shadow-lg shadow-blue-500/10'}`}
                                    >
                                        {isEditing ? "Annuler" : "Modifier"}
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prénom</label>
                                        <input
                                            disabled={!isEditing}
                                            value={form.prenom}
                                            onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                                            className={`w-full p-4 rounded-xl border font-bold text-sm transition-all ${isEditing ? 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent' : 'bg-[#fafafa] border-transparent cursor-not-allowed text-gray-400'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nom</label>
                                        <input
                                            disabled={!isEditing}
                                            value={form.nom}
                                            onChange={(e) => setForm({ ...form, nom: e.target.value })}
                                            className={`w-full p-4 rounded-xl border font-bold text-sm transition-all ${isEditing ? 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent' : 'bg-[#fafafa] border-transparent cursor-not-allowed text-gray-400'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Téléphone</label>
                                    <input
                                        disabled={!isEditing}
                                        value={form.numTele}
                                        onChange={(e) => setForm({ ...form, numTele: e.target.value })}
                                        className={`w-full p-4 rounded-xl border font-bold text-sm transition-all ${isEditing ? 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-[#0B2CFF] focus:border-transparent' : 'bg-[#fafafa] border-transparent cursor-not-allowed text-gray-400'}`}
                                    />
                                </div>
                                {isEditing && (
                                    <button type="submit" className="w-full bg-[#0B2CFF] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 hover:bg-[#001B87] transition-all">
                                        Enregistrer les modifications
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Colonne Droite : Mon Complexe */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                            <div className="h-44 bg-gray-50 relative overflow-hidden">
                                <img src="https://i.pinimg.com/736x/0e/bf/e8/0ebfe849481ebf3972634812d9859cc8.jpg" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt="Complexe" />
                                <div className="absolute top-4 right-4 bg-green-500 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg">Vérifié</div>
                            </div>
                            <div className="p-8">
                                <p className="text-[10px] font-black text-[#0B2CFF] uppercase tracking-widest mb-2">Mon Complexe</p>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">{profile?.nomComplexe}</h2>
                                <div className="flex items-start gap-2 text-gray-400 text-sm mb-8 font-medium">
                                    <svg className="w-5 h-5 mt-0.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <span>{profile?.adresse}, {profile?.ville}</span>
                                </div>
                                <button
                                    onClick={() => navigate("/owner/terrains")}
                                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200"
                                >
                                    Gérer les terrains
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Modal
                title={
                    <div className="pb-4 border-b border-gray-100">
                        <h3 className="text-xl font-black text-[#0B2CFF] uppercase italic">Sécurité</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Changer votre mot de passe</p>
                    </div>
                }
                open={showPasswordModal}
                onCancel={() => {
                    setShowPasswordModal(false);
                    passwordForm.resetFields();
                }}
                footer={null}
                centered
                styles={{
                    mask: { backdropFilter: 'blur(4px)' },
                    content: { borderRadius: '2rem', padding: '2rem' }
                }}
                width={500}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={handlePasswordChange}
                    className="mt-6"
                >
                    <Form.Item
                        name="currentPassword"
                        label={<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mot de passe actuel</span>}
                        rules={[{ required: true, message: 'Veuillez saisir votre mot de passe actuel' }]}
                    >
                        <Input.Password className="p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white transition-all font-bold" />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label={<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nouveau mot de passe</span>}
                        rules={[
                            { required: true, message: 'Veuillez saisir votre nouveau mot de passe' },
                            { min: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' }
                        ]}
                    >
                        <Input.Password className="p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white transition-all font-bold" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label={<span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirmer le nouveau mot de passe</span>}
                        rules={[{ required: true, message: 'Veuillez confirmer votre nouveau mot de passe' }]}
                    >
                        <Input.Password className="p-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white transition-all font-bold" />
                    </Form.Item>

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full bg-[#0B2CFF] text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 uppercase tracking-widest text-xs disabled:opacity-50"
                    >
                        {passwordLoading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                    </button>
                </Form>
            </Modal>
        </div>
    );
}

export default OwnerProfilePage;

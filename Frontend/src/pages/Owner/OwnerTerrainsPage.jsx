import React, { useEffect, useState } from 'react';
import { Layout, Typography, Card, Button, Modal, Form, Input, InputNumber, Row, Col, Badge, message, Spin, Avatar, Select } from 'antd';
import {
    PlusOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    UserOutlined,
    LogoutOutlined,
    TrophyOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const OwnerTerrainsPage = () => {
    const [terrains, setTerrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTerrain, setEditingTerrain] = useState(null);
    const [profile, setProfile] = useState(null);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('owner_token');
            if (!token) { navigate('/login/owner'); return; }

            const [profRes, terrRes] = await Promise.all([
                axios.get('http://localhost:8080/api/owners/profile', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:8080/api/owners/terrains', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setProfile(profRes.data);
            setTerrains(terrRes.data);
        } catch (error) {
            console.error("Erreur:", error);
            message.error("Erreur de connexion aux données");
            if (error.response?.status === 401) navigate('/login/owner');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (terrain = null) => {
        setEditingTerrain(terrain);
        if (terrain) {
            form.setFieldsValue(terrain);
        } else {
            form.resetFields();
            form.setFieldsValue({ status: 'OUVERT' }); // Valeur par défaut
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingTerrain(null);
    };

    const handleSave = async (values) => {
        try {
            const token = localStorage.getItem('owner_token');
            const url = editingTerrain
                ? `http://localhost:8080/api/owners/terrains/${editingTerrain.id}`
                : 'http://localhost:8080/api/owners/terrains';

            const method = editingTerrain ? 'put' : 'post';

            await axios[method](url, values, {
                headers: { Authorization: `Bearer ${token}` }
            });

            message.success(editingTerrain ? "Terrain mis à jour !" : "Terrain ajouté avec succès !");
            handleCancel();
            fetchData();
        } catch (error) {
            message.error("Erreur lors de l'enregistrement");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('owner_token');
        navigate('/login/owner');
    };

    if (loading) return <div className="h-screen flex justify-center items-center bg-white"><Spin size="large" /></div>;

    return (
        <Layout className="min-h-screen bg-[#F8F9FA]">
            {/* Header Style WePlay */}
            <Header className="bg-[#0047FF] h-auto py-6 px-10 flex flex-col items-center border-none">
                <div className="w-full max-w-6xl flex justify-between items-center mb-8">
                    <Title level={2} className="text-white m-0 font-black italic tracking-tighter cursor-pointer" onClick={() => navigate('/owner/profile')}>
                        WePlay
                    </Title>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex gap-8 text-white font-medium">
                            <Text className="text-white cursor-pointer hover:opacity-80" onClick={() => navigate('/owner/profile')}>Mon Profil</Text>
                            <Text className="text-white cursor-pointer font-bold border-b-2 border-white" onClick={() => navigate('/owner/terrains')}>Mes Terrains</Text>
                            <Text className="text-white cursor-pointer hover:opacity-80" onClick={() => navigate('/owner/reservations')}>Réservations</Text>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 p-1 px-3 rounded-full border border-white/20">
                            <Avatar size="small" icon={<UserOutlined />} className="bg-white text-[#0047FF]" />
                            <Text className="text-white font-bold">{profile?.prenom}</Text>
                            <LogoutOutlined className="text-white cursor-pointer ml-2" onClick={handleLogout} />
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-6xl flex justify-between items-end pb-4">
                    <div>
                        <Title level={1} className="text-white m-0 mb-2 font-bold">Mes Terrains</Title>
                        <Text className="text-blue-100">Gérez vos surfaces de jeu et tarifs</Text>
                    </div>
                    <Button
                        icon={<PlusOutlined />}
                        size="large"
                        className="bg-white text-[#0047FF] font-bold border-none rounded-2xl h-14 px-8 shadow-lg hover:scale-105 transition-transform"
                        onClick={() => handleOpenModal()}
                    >
                        Ajouter un terrain
                    </Button>
                </div>
            </Header>

            <Content className="p-10 -mt-8">
                <div className="max-w-6xl mx-auto">
                    <Row gutter={[32, 32]}>
                        {terrains.map(terrain => (
                            <Col xs={24} md={12} key={terrain.id}>
                                <Card className="shadow-xl rounded-[2rem] border-none overflow-hidden hover:shadow-2xl transition-all">
                                    <div className="flex flex-col sm:flex-row h-full">
                                        <div className="sm:w-1/3 bg-gray-100 min-h-[160px] relative">
                                            <img
                                                src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=400"
                                                className="absolute inset-0 w-full h-full object-cover"
                                                alt="terrain"
                                            />
                                            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white ${terrain.status === 'OUVERT' ? 'bg-green-500' : 'bg-red-500'}`}>
                                                {terrain.status}
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <Title level={3} className="m-0 font-bold mb-2">{terrain.nom}</Title>
                                                <div className="flex gap-2 mb-4">
                                                    <Badge className="bg-blue-50 text-[#0047FF] border-none px-3 py-1 rounded-lg text-xs font-bold">
                                                        <TrophyOutlined /> {terrain.dureeCreneau} min
                                                    </Badge>
                                                    <Badge className="bg-gray-100 text-gray-500 border-none px-3 py-1 rounded-lg text-xs font-bold">
                                                        <ClockCircleOutlined /> {terrain.heureOuverture}h - {terrain.heureFermeture}h
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center mt-4">
                                                <div>
                                                    <Text className="text-2xl font-bold text-[#0047FF]">{terrain.prixTerrain} MAD</Text>
                                                    <Text type="secondary" className="text-[10px] block uppercase tracking-wider">Par Heure</Text>
                                                </div>
                                                <Button
                                                    type="primary"
                                                    ghost
                                                    className="border-[#0047FF] text-[#0047FF] rounded-xl font-bold hover:bg-blue-50"
                                                    onClick={() => handleOpenModal(terrain)}
                                                >
                                                    Modifier
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </Content>

            {/* Modal Ajout/Modif */}
            <Modal
                title={<Title level={3} className="m-0">{editingTerrain ? "Modifier le Terrain" : "Nouveau Terrain"}</Title>}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                className="rounded-[2rem] overflow-hidden"
            >
                <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
                    <Form.Item name="nom" label="NOM DU TERRAIN" rules={[{ required: true, message: 'Nom obligatoire' }]}>
                        <Input placeholder="Ex: Terrain Alpha" className="rounded-xl h-12" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="prixTerrain" label="PRIX (MAD / H)" rules={[{ required: true }]}>
                                <Input className="rounded-xl h-12" placeholder="Ex: 250" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="dureeCreneau" label="DURÉE (MIN)" rules={[{ required: true }]}>
                                <InputNumber className="w-full rounded-xl h-12 flex items-center" step={30} min={30} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="heureOuverture" label="OUVERTURE (H)" rules={[{ required: true }]}>
                                <InputNumber className="w-full rounded-xl h-12 flex items-center" min={0} max={23} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="heureFermeture" label="FERMETURE (H)" rules={[{ required: true }]}>
                                <InputNumber className="w-full rounded-xl h-12 flex items-center" min={0} max={23} />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* ✅ Champ Statut avec Liste Déroulante */}
                    <Form.Item name="status" label="STATUT DU TERRAIN">
                        <Select className="w-full rounded-xl h-12" dropdownClassName="rounded-xl">
                            <Option value="OUVERT">OUVERT</Option>
                            <Option value="FERME">FERME</Option>
                        </Select>
                    </Form.Item>

                    <div className="flex justify-end gap-3 mt-8">
                        <Button onClick={handleCancel} className="rounded-xl h-12 px-6">Annuler</Button>
                        <Button type="primary" htmlType="submit" className="bg-[#0047FF] border-none rounded-xl h-12 px-10 font-bold shadow-lg">
                            Enregistrer
                        </Button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default OwnerTerrainsPage;
// src/screens/NutritionPlansScreen.tsx
import React, { useState } from 'react';
import {
  List,
  Card,
  Tag,
  Button,
  Spin,
  Alert,
  Modal,
  Form,
  Input,
  Popconfirm,
  message
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined
} from '@ant-design/icons';
import useNutritionPlans, { NutritionPlanType } from '../../../hooks/useNutritionPlans';
import { planImages } from '../../../utils/planImages';
import { useAuth } from '../../../Context/AuthContext';

const NutritionPlansScreen: React.FC = () => {
  const {
    nutritionPlans,
    loading,
    error,
    createNutritionPlan,
    updateNutritionPlan,
    deleteNutritionPlan
  } = useNutritionPlans();
  const { state } = useAuth();

  const [searchText, setSearchText] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlanType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Filtrar por nombre
  const filtered = nutritionPlans.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Abrir modal de creación
  const showCreate = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Abrir modal de edición
  const showEdit = (plan: NutritionPlanType) => {
    setIsEditing(true);
    setSelectedPlan(plan);
    form.setFieldsValue(plan);
    setIsModalOpen(true);
  };

  // Guardar (create o update)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && selectedPlan) {
        const ok = await updateNutritionPlan({ ...selectedPlan, ...values });
        ok
          ? message.success('Plan actualizado.')
          : message.error('Error al actualizar.');
      } else {
        const ok = await createNutritionPlan(values);
        ok
          ? message.success('Plan creado.')
          : message.error('Error al crear.');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      message.error('Completa todos los campos.');
    }
  };

  // Eliminar
  const onDelete = async (id: number) => {
    const ok = await deleteNutritionPlan(id);
    ok
      ? message.success('Plan eliminado.')
      : message.error('Error al eliminar.');
  };

  if (loading) return <Spin tip="Cargando..." />;
  if (error)   return <Alert type="error" message={error} />;

  return (
    <div style={{ padding: 24, background: '#111' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar plan por nombre"
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        {(state.user?.userType === 1 || state.user?.userType === 5) && (
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
            Agregar Plan
          </Button>
        )}
      </div>

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={filtered}
        renderItem={plan => {
          const img = planImages[plan.nutritionPlansId] ?? '/images/default-plan.jpg';
          return (
            <List.Item>
              <Card
                hoverable
                cover={<img alt={plan.name} src={img} style={{ height: 140, objectFit: 'cover' }} />}
                actions={
                  state.user?.userType === 1
                    ? [
                        <EditOutlined key="edit" onClick={() => showEdit(plan)} />,
                        <Popconfirm
                          key="del"
                          title="¿Eliminar este plan?"
                          onConfirm={() => onDelete(plan.nutritionPlansId)}
                          okText="Sí"
                          cancelText="No"
                        >
                          <DeleteOutlined />
                        </Popconfirm>
                      ]
                    : []
                }
              >
                <Card.Meta
                  title={plan.name}
                  description={
                    <>
                      <Tag color="blue">{plan.goal}</Tag>
                      <Tag color="green">{plan.dalyCalories.toLocaleString()} kcal</Tag>
                    </>
                  }
                />
                <Button
                  type="link"
                  style={{ marginTop: 8, padding: 0 }}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Ver detalles
                </Button>
              </Card>
            </List.Item>
          );
        }}
      />

      {/* Detalles modal */}
      <Modal
        visible={!!selectedPlan && !isModalOpen}
        title={selectedPlan?.name}
        footer={null}
        onCancel={() => setSelectedPlan(null)}
      >
        <p><strong>Descripción:</strong> {selectedPlan?.description}</p>
        <p><strong>Meta:</strong> {selectedPlan?.goal}</p>
        <p>
          <strong>Calorías diarias:</strong> {selectedPlan?.dalyCalories.toLocaleString()} kcal
        </p>
      </Modal>

      {/* Crear/editar modal */}
      <Modal
        visible={isModalOpen}
        title={isEditing ? 'Editar Plan' : 'Agregar Plan'}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        okText={isEditing ? 'Actualizar' : 'Crear'}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="goal" label="Meta" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="dalyCalories"
            label="Calorías diarias"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NutritionPlansScreen;

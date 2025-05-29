// src/screens/MealsScreen.tsx
import React, { useState,  } from 'react';
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
import useMeals, { MealType } from '../../../hooks/useMeals';
import { mealImages } from '../../../utils/mealImages';
import { useAuth } from '../../../Context/AuthContext';

const MealsScreen: React.FC = () => {
  const { meals, loading, error, createMeal, updateMeal, deleteMeal } = useMeals();
  const { state } = useAuth();
  const [searchText, setSearchText] = useState('');
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Filtrar
  const filtered = meals.filter(m =>
    m.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Abrir modal crear
  const showCreate = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Abrir modal editar
  const showEdit = (meal: MealType) => {
    setIsEditing(true);
    setSelectedMeal(meal);
    form.setFieldsValue(meal);
    setIsModalOpen(true);
  };

  // Guardar (create o update)
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && selectedMeal) {
        const ok = await updateMeal({ ...selectedMeal, ...values });
        ok
          ? message.success('Comida actualizada.')
          : message.error('Error al actualizar.');
      } else {
        const ok = await createMeal(values);
        ok
          ? message.success('Comida creada.')
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
    const ok = await deleteMeal(id);
    ok
      ? message.success('Comida eliminada.')
      : message.error('Error al eliminar.');
  };

  if (loading) return <Spin tip="Cargando..." />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div style={{ padding: 24, background: '#111' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar por nombre"
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        {(state.user?.userType === 1 || state.user?.userType === 5) && (
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
            Agregar Comida
          </Button>
        )}
      </div>

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={filtered}
        renderItem={meal => {
          const img = mealImages[meal.mealsId] ?? '/images/default-meal.jpg';
          return (
            <List.Item>
              <Card
                hoverable
                cover={<img alt={meal.name} src={img} style={{ height: 140, objectFit: 'cover' }} />}
                actions={
                  state.user?.userType === 1
                    ? [
                        <EditOutlined key="edit" onClick={() => showEdit(meal)} />,
                        <Popconfirm
                          key="del"
                          title="Eliminar esta comida?"
                          onConfirm={() => onDelete(meal.mealsId)}
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
                  title={meal.name}
                  description={
                    <>
                      <Tag color="volcano">{meal.calories} kcal</Tag>
                      <Tag color="green">{meal.protein} g Prot</Tag>
                      <Tag color="blue">{meal.carbs} g Carb</Tag>
                      <Tag color="purple">{meal.flat} g Gras</Tag>
                    </>
                  }
                />
                <Button
                  type="link"
                  style={{ marginTop: 8, padding: 0 }}
                  onClick={() => setSelectedMeal(meal)}
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
        visible={!!selectedMeal && !isModalOpen}
        title={selectedMeal?.name}
        footer={null}
        onCancel={() => setSelectedMeal(null)}
      >
        <p><strong>Descripción:</strong> {selectedMeal?.description}</p>
        <p>
          <strong>Calorías:</strong> {selectedMeal?.calories} kcal<br/>
          <strong>Proteína:</strong> {selectedMeal?.protein} g<br/>
          <strong>Carbohidratos:</strong> {selectedMeal?.carbs} g<br/>
          <strong>Grasa:</strong> {selectedMeal?.flat} g
        </p>
      </Modal>

      {/* Crear/editar modal */}
      <Modal
        visible={isModalOpen}
        title={isEditing ? 'Editar Comida' : 'Agregar Comida'}
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
          <Form.Item name="calories" label="Calorías" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="protein" label="Proteína" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="carbs" label="Carbohidratos" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="flat" label="Grasa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MealsScreen;

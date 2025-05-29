// src/screens/ExercisesScreen.tsx
import React, { useState } from 'react';
import {
  List,
  Card,
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
import useExercises, { ExerciseType } from '../../../hooks/useExercises';

import { exerciseImages } from '../../../utils/exerciseImages';
import { useAuth } from '../../../Context/AuthContext';

const ExercisesScreen: React.FC = () => {
  const {
    exercises,
    loading,
    error,
    createExercise,
    updateExercise,
    deleteExercise
  } = useExercises();
  const { state } = useAuth();

  const [searchText, setSearchText] = useState('');
  const [selected, setSelected] = useState<ExerciseType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // Filtrado por nombre
  const filtered = exercises.filter(e =>
    e.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Crear
  const showCreate = () => {
    setIsEditing(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Editar
  const showEdit = (ex: ExerciseType) => {
    setIsEditing(true);
    setSelected(ex);
    form.setFieldsValue(ex);
    setIsModalOpen(true);
  };

  // Guardar
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing && selected) {
        const ok = await updateExercise({ ...selected, ...values });
        ok ? message.success('Ejercicio actualizado') : message.error('Error al actualizar');
      } else {
        const ok = await createExercise(values);
        ok ? message.success('Ejercicio creado') : message.error('Error al crear');
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      message.error('Completa todos los campos');
    }
  };

  // Borrar
  const onDelete = async (id: number) => {
    const ok = await deleteExercise(id);
    ok ? message.success('Ejercicio eliminado') : message.error('Error al eliminar');
  };

  if (loading) return <Spin tip="Cargando ejercicios..." />;
  if (error)   return <Alert type="error" message={error} />;

  return (
    <div style={{ padding: 24, background: '#111' }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input.Search
          placeholder="Buscar ejercicio"
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        {(state.user?.userType === 1 || state.user?.userType === 5) && (
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
            Agregar Ejercicio
          </Button>
        )}
      </div>

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={filtered}
        renderItem={ex => {
          const img = exerciseImages[ex.exercisesId] ?? '/images/default-ex.jpg';
          return (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    alt={ex.name}
                    src={img}
                    style={{ height: 140, objectFit: 'cover' }}
                  />
                }
                actions={
                  state.user?.userType === 1
                    ? [
                        <EditOutlined key="edit" onClick={() => showEdit(ex)} />,
                        <Popconfirm
                          key="del"
                          title="Eliminar este ejercicio?"
                          onConfirm={() => onDelete(ex.exercisesId)}
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
                  title={ex.name}
                  description={ex.muscleGroup}
                />
                <Button
                  type="link"
                  style={{ marginTop: 8, padding: 0 }}
                  onClick={() => setSelected(ex)}
                >
                  Ver detalles
                </Button>
              </Card>
            </List.Item>
          );
        }}
      />

      {/* Modal Detalles */}
      <Modal
        visible={!!selected && !isModalOpen}
        title={selected?.name}
        footer={null}
        onCancel={() => setSelected(null)}
      >
        <p><strong>Descripción:</strong> {selected?.description}</p>
        <p><strong>Grupo muscular:</strong> {selected?.muscleGroup}</p>
      </Modal>

      {/* Modal Crear/Editar */}
      <Modal
        visible={isModalOpen}
        title={isEditing ? 'Editar Ejercicio' : 'Agregar Ejercicio'}
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
          <Form.Item name="muscleGroup" label="Grupo Muscular" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExercisesScreen;

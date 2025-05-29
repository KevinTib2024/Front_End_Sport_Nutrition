// src/screens/WorkoutScreen.tsx
import React, { useState } from "react";
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
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useWorkouts, { WorkoutType } from "../../../hooks/useWorkout";
import { workoutImages } from "../../../utils/workoutImages";
import { useAuth } from "../../../Context/AuthContext";

const WorkoutScreen: React.FC = () => {
  const {
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  } = useWorkouts();
  const { state } = useAuth();
  const canEdit = [1, 5].includes(state.user?.userType ?? 0);

  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutType | null>(null);
  const [form] = Form.useForm<WorkoutType>();

  // Filtrado por nombre
  const filtered = workouts.filter(w =>
    w.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Abrir modal creación
  const showCreate = () => {
    setIsEditing(false);
    setEditingWorkout(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  // Abrir modal edición
  const showEdit = (w: WorkoutType) => {
    setIsEditing(true);
    setEditingWorkout(w);
    form.setFieldsValue(w);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingWorkout(null);
  };

  // Guardar
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const success = isEditing && editingWorkout
        ? await updateWorkout({ ...editingWorkout, ...values })
        : await createWorkout(values as Omit<WorkoutType, "workoutId">);

      if (success) {
        message.success(isEditing ? "Actualizado" : "Creado");
        closeModal();
      } else {
        message.error(isEditing ? "Error al actualizar" : "Error al crear");
      }
    } catch {
      message.error("Completa todos los campos");
    }
  };

  // Borrar
  const handleDelete = async (id: number) => {
    const ok = await deleteWorkout(id);
    ok ? message.success("Eliminado") : message.error("Error al eliminar");
  };

  if (loading) return <Spin tip="Cargando entrenamientos..." />;
  if (error) return <Alert type="error" message={error} style={{ marginBottom:16 }} />;

  return (
    <div style={{ padding: 24, background: '#111' }}>
      <div style={{ marginBottom:16, display:'flex', justifyContent:'space-between' }}>
        <Input.Search
          placeholder="Buscar entrenamiento"
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        {canEdit && (
          <Button type="primary" icon={<PlusOutlined />} onClick={showCreate}>
            Agregar Entrenamiento
          </Button>
        )}
      </div>

      <List
        grid={{ gutter: [32,32], xs:1, sm:2, md:3, lg:4 }}
        dataSource={filtered}
        renderItem={w => {
          const img = workoutImages[w.workoutId] ?? '/images/default-workout.jpg';
          return (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    alt={w.name}
                    src={img}
                    style={{ height: 140, objectFit: 'cover' }}
                  />
                }
                actions={
                  canEdit
                    ? [
                        <EditOutlined key="edit" onClick={() => showEdit(w)} />,
                        <Popconfirm
                          key="del"
                          title="¿Eliminar este entrenamiento?"
                          onConfirm={() => handleDelete(w.workoutId)}
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
                  title={w.name}
                  description={w.difficultyLevel + " · " + w.duration}
                />
                <p style={{ marginTop:8 }}>{w.goal}</p>
              </Card>
            </List.Item>
          );
        }}
      />

      <Modal
        title={isEditing ? "Editar Entrenamiento" : "Agregar Entrenamiento"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Crear"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="difficultyLevel" label="Dificultad" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="duration" label="Duración" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="goal" label="Objetivo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutScreen;

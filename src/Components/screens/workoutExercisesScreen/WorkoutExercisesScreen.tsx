// src/screens/WorkoutExercisesScreen.tsx
import React, { useState } from "react";
import {
  List,
  Card,
  Button,
  Spin,
  Alert,
  Modal,
  Form,
  //Select,
  InputNumber,
  Popconfirm,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import useWorkoutExercises, { WorkoutExercise } from "../../../hooks/useWorkoutExercises";
import useExercises from "../../../hooks/useExercises";
import { exerciseImages } from "../../../utils/exerciseImages";
import { useAuth } from "../../../Context/AuthContext";

//const { Option } = Select;

const WorkoutExercisesScreen: React.FC = () => {
  const {
    workoutExercises,
    loading,
    error,
    createWorkoutExercise,
    updateWorkoutExercise,
    deleteWorkoutExercise,
  } = useWorkoutExercises();

  const { exercises } = useExercises();  // Asegúrate de que aquí el tipo realmente exporta `exercisesId`
  const { state } = useAuth();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkoutExercise | null>(null);
  const [form] = Form.useForm<WorkoutExercise>();

  const canEdit = [1, 5].includes(state.user?.userType ?? 0);

  // Modales
  const showCreate = () => {
    setIsEditing(false);
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };
  const showEdit = (item: WorkoutExercise) => {
    setIsEditing(true);
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    form.resetFields();
  };

  // Submit
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const success = isEditing && editingItem
        ? await updateWorkoutExercise({ ...editingItem, ...values })
        : await createWorkoutExercise(values as Omit<WorkoutExercise, "workoutExercisesId">);

      if (success) {
        message.success(isEditing ? "Actualizado" : "Agregado");
        closeModal();
      } else {
        message.error(isEditing ? "Error al actualizar" : "Error al agregar");
      }
    } catch {
      message.error("Completa todos los campos");
    }
  };

  // Delete
  const onDelete = async (id: number) => {
    const ok = await deleteWorkoutExercise(id);
    ok ? message.success("Eliminado") : message.error("Error al eliminar");
  };

  if (loading) return <Spin tip="Cargando ejercicios de rutina..." />;
  if (error) return <Alert type="error" message={error} style={{ marginBottom: 16 }} />;

  return (
    <div style={{ padding: 24, background: "#111" }}>
      {canEdit && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginBottom: 16 }}
          onClick={showCreate}
        >
          Agregar Ejercicio a Rutina
        </Button>
      )}

      <List
        grid={{ gutter: [32, 32], xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={workoutExercises}
        renderItem={we => {
          // Ajuste: si ExerciseType usa `exercisesId`
          const ex = exercises.find(e => e.exercisesId === we.exercises_Id);
          const img = ex
            ? exerciseImages[ex.exercisesId] ?? "/images/default-ex.jpg"
            : "/images/default-ex.jpg";

          return (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    alt={ex?.name ?? ""}
                    src={img}
                    style={{ height: 140, objectFit: "cover" }}
                  />
                }
                actions={
                  canEdit && we.workoutExercisesId
                    ? [
                        <EditOutlined key="edit" onClick={() => showEdit(we)} />,
                        <Popconfirm
                          key="del"
                          title="Eliminar este ejercicio?"
                          onConfirm={() => onDelete(we.workoutExercisesId!)}
                          okText="Sí"
                          cancelText="No"
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]
                    : []
                }
              >
                <Card.Meta
                  title={ex?.name ?? `Ejercicio ${we.exercises_Id}`}
                  description={`Series: ${we.sets} · Reps: ${we.reps}`}
                />
                <p style={{ marginTop: 8 }}>Descanso: {we.restSeconds}s</p>
              </Card>
            </List.Item>
          );
        }}
      />

      <Modal
        title={isEditing ? "Editar Ejercicio en Rutina" : "Agregar Ejercicio a Rutina"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Crear"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="workout_Id"
            label="Workout ID"
            rules={[{ required: true, message: "Obligatorio" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="exercises_Id"
            label="Exercise ID"
            rules={[{ required: true, message: "Obligatorio" }]}
          >
            <InputNumber style={{ width: "100%" }} />
            {/*
            // Si prefieres Select con los nombres:
            <Select placeholder="Selecciona ejercicio">
              {exercises.map(e => (
                <Option key={e.exercisesId} value={e.exercisesId}>
                  {e.name}
                </Option>
              ))}
            </Select>
            */}
          </Form.Item>

          <Form.Item
            name="sets"
            label="Series"
            rules={[{ required: true, message: "Obligatorio" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="reps"
            label="Repeticiones"
            rules={[{ required: true, message: "Obligatorio" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="restSeconds"
            label="Descanso (s)"
            rules={[{ required: true, message: "Obligatorio" }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutExercisesScreen;

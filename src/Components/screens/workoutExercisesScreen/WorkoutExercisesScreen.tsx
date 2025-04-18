import { useState } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Modal,
  Form,
  InputNumber,
  message,
  Spin,
  Alert,
} from "antd";
import useWorkoutExercises, { WorkoutExercise } from "../../../hooks/useWorkoutExercises";
import { useAuth } from "../../../Context/AuthContext";

const WorkoutExercisesTable = () => {
  const {
    workoutExercises,
    loading,
    error,
    createWorkoutExercise,
    updateWorkoutExercise,
    deleteWorkoutExercise,
  } = useWorkoutExercises();
  const { state } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<WorkoutExercise>();
  const [editingItem, setEditingItem] = useState<WorkoutExercise | null>(null);

  const filtered = workoutExercises.filter((we) =>
    `${we.workout_Id}-${we.exercises_Id}`.includes(searchText.trim())
  );

  const showModal = () => {
    setIsEditing(false);
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const showEditModal = (item: WorkoutExercise) => {
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

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = isEditing && editingItem
        ? await updateWorkoutExercise({ ...editingItem, ...values })
        : await createWorkoutExercise(values as Omit<WorkoutExercise, "workoutExercisesId">);

      if (success) {
        message.success(isEditing ? "Ejercicio actualizado." : "Ejercicio agregado.");
        closeModal();
      } else {
        message.error(isEditing ? "Error al actualizar." : "Error al agregar.");
      }
    } catch {
      message.error("Por favor completa todos los campos.");
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteWorkoutExercise(id);
    if (success) {
      message.success("Ejercicio eliminado.");
    } else {
      message.error("No se pudo eliminar.");
    }
  };

  const canEdit = [1, 5].includes(state.user?.userType ?? 0);

  const columns = [
    { title: "Workout ID", dataIndex: "workout_Id", key: "workout_Id" },
    { title: "Exercise ID", dataIndex: "exercises_Id", key: "exercises_Id" },
    { title: "Series", dataIndex: "sets", key: "sets" },
    { title: "Repeticiones", dataIndex: "reps", key: "reps" },
    {
      title: "Descanso (s)",
      dataIndex: "restSeconds",
      key: "restSeconds",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: WorkoutExercise) =>
        canEdit && record.workoutExercisesId! > 0 && (
          <>
            <Button type="link" onClick={() => showEditModal(record)}>
              Editar
            </Button>
            <Popconfirm
              title="¿Eliminar este ejercicio?"
              onConfirm={() => handleDelete(record.workoutExercisesId!)}
              okText="Sí"
              cancelText="No"
            >
              <Button type="link" danger>
                Eliminar
              </Button>
            </Popconfirm>
          </>
        ),
    },
  ];

  return (
    <div>
      <Input.Search
        placeholder="Buscar Workout‑Exercise"
        onSearch={setSearchText}
        style={{ width: 300, marginBottom: 16 }}
        allowClear
      />

      {canEdit && (
        <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
          Agregar Ejercicio a Rutina
        </Button>
      )}

      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="workoutExercisesId"
          pagination={{ pageSize: 5 }}
        />
      )}

      <Modal
        title={isEditing ? "Editar Ejercicio en Rutina" : "Agregar Ejercicio a Rutina"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="workout_Id"
            label="ID de Rutina"
            rules={[{ required: true, message: "Obligatorio" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="exercises_Id"
            label="ID de Ejercicio"
            rules={[{ required: true, message: "Obligatorio" }]}
          >
            <InputNumber style={{ width: "100%" }} />
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

export default WorkoutExercisesTable;

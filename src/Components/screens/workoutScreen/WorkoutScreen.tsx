import { useState } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form } from "antd";
import useWorkouts from "../../../hooks/useWorkout";
import { useAuth } from "../../../Context/AuthContext";

export interface Workout {
  workoutId: number;
  name: string;
  description: string;
  difficultyLevel: string;
  duration: string;
  goal: string;
}

const WorkoutTable = () => {
  const { workouts, deleteWorkout, updateWorkout, createWorkout } = useWorkouts();
  const { state } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const filteredWorkouts = workouts.filter((w) =>
    w.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const showEditModal = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsEditing(true);
    setIsModalOpen(true);
    form.setFieldsValue(workout);
  };

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
    form.resetFields();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingWorkout(null);
  };

  const handleAddWorkout = async () => {
    try {
      const newWorkout = await form.validateFields();
      const success = await createWorkout(newWorkout);
      if (success) {
        message.success("Entrenamiento agregado correctamente.");
        closeModal();
      } else {
        message.error("Error al agregar el entrenamiento.");
      }
    } catch {
      message.error("Por favor complete todos los campos.");
    }
  };

  const handleUpdateWorkout = async () => {
    try {
      const updatedWorkout = await form.validateFields();
      if (editingWorkout) {
        const success = await updateWorkout({ ...editingWorkout, ...updatedWorkout });
        if (success) {
          message.success("Entrenamiento actualizado correctamente.");
          closeModal();
        } else {
          message.error("Error al actualizar el entrenamiento.");
        }
      }
    } catch {
      message.error("Por favor complete todos los campos.");
    }
  };

  const handleDelete = async (id: number) => {
    const success = await deleteWorkout(id);
    if (success) {
      message.success("Entrenamiento eliminado correctamente.");
    } else {
      message.error("Error al eliminar el entrenamiento.");
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Dificultad", dataIndex: "difficultyLevel", key: "difficultyLevel" },
    { title: "Duración", dataIndex: "duration", key: "duration" },
    { title: "Objetivo", dataIndex: "goal", key: "goal" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Workout) => (
        <>
          {state.user?.userType === 1 && (
            <>
              <Button type="link" onClick={() => showEditModal(record)}>Editar</Button>
              <Popconfirm
                title="¿Eliminar este entrenamiento?"
                onConfirm={() => handleDelete(record.workoutId)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="link" danger>Eliminar</Button>
              </Popconfirm>
            </>
          )}
        </>
      )
    }
  ];

  return (
    <div>
      <Input
        placeholder="Buscar entrenamiento por nombre"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />

      {(state.user?.userType === 1 || state.user?.userType === 5) && (
        <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
          Agregar Entrenamiento
        </Button>
      )}

      <Table
        columns={columns}
        dataSource={filteredWorkouts}
        rowKey="workoutId"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditing ? "Editar Entrenamiento" : "Agregar Entrenamiento"}
        open={isModalOpen}
        onOk={isEditing ? handleUpdateWorkout : handleAddWorkout}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Ingrese el nombre del entrenamiento" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: "Ingrese la descripción" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="difficultyLevel"
            label="Nivel de Dificultad"
            rules={[{ required: true, message: "Ingrese la dificultad" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duración"
            rules={[{ required: true, message: "Ingrese la duración" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="goal"
            label="Objetivo"
            rules={[{ required: true, message: "Ingrese el objetivo" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkoutTable;

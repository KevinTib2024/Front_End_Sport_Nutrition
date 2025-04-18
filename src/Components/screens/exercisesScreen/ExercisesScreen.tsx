import { useState } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form } from "antd";
import useExercises from "../../../hooks/useExercises";
import { useAuth } from "../../../Context/AuthContext";

export interface Exercise {
  exerciseId: number;
  name: string;
  description: string;
  muscleGroup: string;
}

const ExerciseTable = () => {
  const { exercises, deleteExercise, updateExercise, createExercise } = useExercises();
  const { state } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const showEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsEditing(true);
    setIsModalOpen(true);
    form.setFieldsValue(exercise);
  };

  const handleUpdateExercise = async () => {
    try {
      const updatedExercise = await form.validateFields();
      if (editingExercise) {
        const success = await updateExercise({ ...editingExercise, ...updatedExercise });
        if (success) {
          message.success("Ejercicio actualizado correctamente.");
          closeModal();
        } else {
          message.error("Error al actualizar el ejercicio.");
        }
      }
    } catch {
      message.error("Por favor complete todos los campos requeridos.");
    }
  };

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleAddExercise = async () => {
    try {
      const newExercise = await form.validateFields();
      const success = await createExercise(newExercise);  // ← ahora sí capturas el boolean
      if (success) {
        message.success("Ejercicio agregado correctamente.");
        closeModal();
      } else {
        message.error("Error al agregar el ejercicio.");
      }
    } catch {
      message.error("Por favor complete todos los campos requeridos.");
    }
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingExercise(null);
  };

  const handleDelete = async (exerciseId: number) => {
    const success = await deleteExercise(exerciseId);
    if (success) {
      message.success("Ejercicio eliminado correctamente.");
    } else {
      message.error("No se pudo eliminar el ejercicio.");
    }
  };

  const exerciseColumns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Grupo Muscular", dataIndex: "muscleGroup", key: "muscleGroup" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Exercise) => (
        <>
          {state.user?.userType === 1 && (
            <>
              <Button type="link" onClick={() => showEditModal(record)}>
                Editar
              </Button>
              <Popconfirm
                title="¿Estás seguro de eliminar este ejercicio?"
                onConfirm={() => handleDelete(record.exerciseId)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="link" danger>
                  Eliminar
                </Button>
              </Popconfirm>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Buscar ejercicio por nombre"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />

      {(state.user?.userType === 1 || state.user?.userType === 5) && (
        <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
          Agregar Ejercicio
        </Button>
      )}

      <Table
        columns={exerciseColumns}
        dataSource={filteredExercises}
        rowKey="exerciseId"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditing ? "Editar Ejercicio" : "Agregar Nuevo Ejercicio"}
        open={isModalOpen}
        onOk={isEditing ? handleUpdateExercise : handleAddExercise}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Por favor ingrese el nombre del ejercicio" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: "Por favor ingrese la descripción" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="muscleGroup"
            label="Grupo Muscular"
            rules={[{ required: true, message: "Por favor ingrese el grupo muscular" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExerciseTable;

import { useState } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form } from "antd";
import useMeals, { MealType } from "../../../hooks/useMeals";
import { useAuth } from "../../../Context/AuthContext";

const MealsTable: React.FC = () => {
  const { meals, deleteMeal, updateMeal, createMeal } = useMeals();
  const { state } = useAuth();
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editingMeal, setEditingMeal] = useState<MealType | null>(null);

  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const showEditModal = (meal: MealType) => {
    setEditingMeal(meal);
    setIsEditing(true);
    setIsModalOpen(true);
    form.setFieldsValue(meal);
  };

  const handleUpdateMeal = async () => {
    try {
      const values = await form.validateFields();
      if (editingMeal) {
        const success = await updateMeal({ ...editingMeal, ...values });
        if (success) {
          message.success("Comida actualizada correctamente.");
          closeModal();
        } else {
          message.error("Error al actualizar la comida.");
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

  const handleAddMeal = async () => {
    try {
      const values = await form.validateFields();
      const success = await createMeal(values);
      if (success) {
        message.success("Comida agregada correctamente.");
        closeModal();
      } else {
        message.error("Error al agregar la comida.");
      }
    } catch {
      message.error("Por favor complete todos los campos requeridos.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingMeal(null);
  };

  const handleDelete = async (mealsId: number) => {
    const success = await deleteMeal(mealsId);
    if (success) {
      message.success("Comida eliminada correctamente.");
    } else {
      message.error("No se pudo eliminar la comida.");
    }
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Calorías", dataIndex: "calories", key: "calories" },
    { title: "Proteína", dataIndex: "protein", key: "protein" },
    { title: "Carbohidratos", dataIndex: "carbs", key: "carbs" },
    { title: "Grasa", dataIndex: "flat", key: "flat" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: MealType) => (
        <>
          {state.user?.userType === 1 && (
            <>
              <Button type="link" onClick={() => showEditModal(record)}>
                Editar
              </Button>
              <Popconfirm
                title="¿Seguro que quieres eliminar esta comida?"
                onConfirm={() => handleDelete(record.mealsId)}
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
        placeholder="Buscar comida por nombre"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />

      {(state.user?.userType === 1 || state.user?.userType === 5) && (
        <Button type="primary" onClick={showModal} style={{ marginBottom: 20 }}>
          Agregar Comida
        </Button>
      )}

      <Table
        columns={columns}
        dataSource={filteredMeals}
        rowKey="mealsId"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditing ? "Editar Comida" : "Agregar Nueva Comida"}
        open={isModalOpen}
        onOk={isEditing ? handleUpdateMeal : handleAddMeal}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
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
            name="calories"
            label="Calorías"
            rules={[{ required: true, message: "Por favor ingrese las calorías" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="protein"
            label="Proteína"
            rules={[{ required: true, message: "Por favor ingrese la proteína" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="carbs"
            label="Carbohidratos"
            rules={[{ required: true, message: "Por favor ingrese los carbohidratos" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="flat"
            label="Grasa"
            rules={[{ required: true, message: "Por favor ingrese la grasa" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MealsTable;

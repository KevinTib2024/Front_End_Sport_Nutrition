import { useState } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form } from "antd";
import useNutritionPlans, { NutritionPlanType } from "../../../hooks/useNutritionPlans";
import { useAuth } from "../../../Context/AuthContext";

const NutritionPlansTable: React.FC = () => {
  const {
    nutritionPlans,
    deleteNutritionPlan,
    updateNutritionPlan,
    createNutritionPlan,
  } = useNutritionPlans();
  const { state } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [editingPlan, setEditingPlan] = useState<NutritionPlanType | null>(null);

  // Filtrar planes por nombre
  const filteredPlans = nutritionPlans.filter(plan =>
    plan.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Mostrar modal de edición
  const showEditModal = (plan: NutritionPlanType) => {
    setEditingPlan(plan);
    setIsEditing(true);
    setIsModalOpen(true);
    form.setFieldsValue(plan);
  };

  // Agregar nuevo plan
  const handleAddPlan = async () => {
    try {
      const values = await form.validateFields();
      const success = await createNutritionPlan(values);
      if (success) {
        message.success("Plan de nutrición agregado correctamente.");
        closeModal();
      } else {
        message.error("Error al agregar el plan.");
      }
    } catch {
      message.error("Por favor completa todos los campos.");
    }
  };

  // Actualizar plan existente
  const handleUpdatePlan = async () => {
    try {
      const values = await form.validateFields();
      if (editingPlan) {
        const success = await updateNutritionPlan({ ...editingPlan, ...values });
        if (success) {
          message.success("Plan de nutrición actualizado correctamente.");
          closeModal();
        } else {
          message.error("Error al actualizar el plan.");
        }
      }
    } catch {
      message.error("Por favor completa todos los campos.");
    }
  };

  // Eliminar plan
  const handleDelete = async (id: number) => {
    const success = await deleteNutritionPlan(id);
    if (success) {
      message.success("Plan eliminado correctamente.");
    } else {
      message.error("No se pudo eliminar el plan.");
    }
  };

  // Abrir modal de creación
  const showCreateModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
    form.resetFields();
  };

  // Cerrar modal
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingPlan(null);
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Meta", dataIndex: "goal", key: "goal" },
    {
      title: "Calorías diarias",
      dataIndex: "dalyCalories",
      key: "dalyCalories",
      render: (cal: number) => cal.toLocaleString(),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: NutritionPlanType) => (
        <>
          {state.user?.userType === 1 && (
            <>
              <Button type="link" onClick={() => showEditModal(record)}>
                Editar
              </Button>
              <Popconfirm
                title="¿Seguro que quieres eliminar este plan?"
                onConfirm={() => handleDelete(record.nutritionPlansId)}
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
        placeholder="Buscar plan por nombre"
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        style={{ width: 300, marginBottom: 20 }}
      />

      {(state.user?.userType === 1 || state.user?.userType === 5) && (
        <Button type="primary" onClick={showCreateModal} style={{ marginBottom: 20 }}>
          Agregar Plan de Nutrición
        </Button>
      )}

      <Table
        columns={columns}
        dataSource={filteredPlans}
        rowKey="nutritionPlansId"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isEditing ? "Editar Plan de Nutrición" : "Agregar Nuevo Plan"}
        open={isModalOpen}
        onOk={isEditing ? handleUpdatePlan : handleAddPlan}
        onCancel={closeModal}
        okText={isEditing ? "Actualizar" : "Agregar"}
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Descripción"
            rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="goal"
            label="Meta"
            rules={[{ required: true, message: "Por favor ingresa la meta" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dalyCalories"
            label="Calorías diarias"
            rules={[{ required: true, message: "Por favor ingresa las calorías diarias" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NutritionPlansTable;

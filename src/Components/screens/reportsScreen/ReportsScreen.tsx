// src/components/screens/reportsScreen/ReportsScreen.tsx
import React from "react";
import {
  Spin,
  Alert,
  Row,
  Col,
  Card,
  Typography,
  Button,
} from "antd";
import useReports, {
  AdminReportData,
  UserReportData,
} from "../../../hooks/useReports";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const { Title, Text } = Typography;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ReportCard = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => (
  <Card
    style={{
      textAlign: "center",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >
    <Text type="secondary">{title}</Text>
    <Title level={2}>{value}</Title>
  </Card>
);

const AdminDashboard = ({
  report,
  onRefresh,
}: {
  report: AdminReportData;
  onRefresh: () => void;
}) => {
  // Solo géneros con al menos un usuario
  const genderData = report.usersByGender.filter((g) => g.count > 0);

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3}>Dashboard Administrador</Title>
        <Button onClick={onRefresh}>Refrescar</Button>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Total usuarios */}
        <Col xs={24} md={8}>
          <ReportCard title="Total de Usuarios" value={report.totalUsers} />
        </Col>

        {/* Pie Chart de Género */}
        <Col xs={24} md={8}>
          <Card
            title="Usuarios por Género"
            bodyStyle={{ padding: 0 }}
            style={{ borderRadius: 12 }}
          >
            <div style={{ width: "100%", height: 250 }}>
              {genderData.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 100 }}>
                  <Text type="secondary">No hay datos disponibles</Text>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey="count"
                      nameKey="gender"
                      innerRadius={50}
                      outerRadius={80}
                      label
                    >
                      {genderData.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={COLORS[idx % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ReTooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </Col>

        {/* Bar Chart de Rango de Peso */}
        <Col xs={24} md={8}>
          <Card
            title="Usuarios por Rango de Peso"
            bodyStyle={{ padding: 0 }}
            style={{ borderRadius: 12 }}
          >
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={report.usersByWeightRange}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="count" fill={COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const UserDashboard = ({
  report,
  onRefresh,
}: {
  report: UserReportData;
  onRefresh: () => void;
}) => {
  const barData = [
    { name: "Ejercicios", value: report.totalExercises },
    { name: "Comidas", value: report.totalMeals },
    { name: "Rutinas", value: report.totalWorkouts },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Title level={3}>Mi Resumen</Title>
        <Button onClick={onRefresh}>Refrescar</Button>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <ReportCard title="Ejercicios Disponibles" value={report.totalExercises} />
        </Col>
        <Col xs={24} md={8}>
          <ReportCard title="Comidas Disponibles" value={report.totalMeals} />
        </Col>
        <Col xs={24} md={8}>
          <ReportCard title="Rutinas Disponibles" value={report.totalWorkouts} />
        </Col>
      </Row>

      <Row style={{ marginTop: 32 }} gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title="Comparativo de Entidades"
            bodyStyle={{ padding: 0 }}
            style={{ borderRadius: 12 }}
          >
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip />
                  <Bar dataKey="value" fill={COLORS[2]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const ReportsScreen: React.FC = () => {
  const { data, loading, error, refresh } = useReports();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message="Error al cargar reportes"
        description={error}
        showIcon
        style={{ margin: 20 }}
      />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div style={{ padding: 24 }}>
      {"totalUsers" in data ? (
        <AdminDashboard report={data as AdminReportData} onRefresh={refresh} />
      ) : (
        <UserDashboard report={data as UserReportData} onRefresh={refresh} />
      )}
    </div>
  );
};

export default ReportsScreen;

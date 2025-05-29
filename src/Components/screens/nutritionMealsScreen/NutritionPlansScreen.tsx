// src/components/NutritionPlansGrid.tsx
import React, { useState } from 'react';
import { List, Card, Tag, Button, Spin, Alert, Modal } from 'antd';
//import { EyeOutlined } from '@ant-design/icons';
import useNutritionPlans, { NutritionPlanType } from '../../../hooks/useNutritionPlans';
import { planImages } from '../../../utils/planImages';

const NutritionPlansGrid: React.FC = () => {
  const { nutritionPlans, loading, error } = useNutritionPlans();
  const [selectedPlan, setSelectedPlan] = useState<NutritionPlanType | null>(null);

  if (loading) return <Spin tip="Cargando planes..." />;
  if (error)   return <Alert type="error" message={error} />;

  return (
    <>
      <List
        grid={{
          gutter: 24,
          xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 6,
        }}
        dataSource={nutritionPlans}
        renderItem={(plan) => {
          // Escogemos la URL de imagen según el ID
          const imgSrc = planImages[plan.nutritionPlansId] 
            ?? '/images/default-plan.jpg';

          return (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    alt={plan.name}
                    src={imgSrc}
                    style={{ height: 140, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={plan.name}
                  description={(
                    <>
                      <Tag color="blue">{plan.goal}</Tag>
                      <Tag color="green">{plan.dalyCalories.toLocaleString()} kcal</Tag>
                    </>
                  )}
                />

                <Button
                  type="link"
                  style={{ marginTop: 16, padding: 0 }}
                  onClick={() => setSelectedPlan(plan)}
                >
                  Ver detalles
                </Button>
              </Card>
            </List.Item>
          );
        }}
      />

      <Modal
        visible={!!selectedPlan}
        title={selectedPlan?.name}
        footer={null}
        onCancel={() => setSelectedPlan(null)}
      >
        <p><strong>Descripción:</strong></p>
        <p>{selectedPlan?.description}</p>
        <p><strong>Meta:</strong> {selectedPlan?.goal}</p>
        <p><strong>Calorías diarias:</strong> {selectedPlan?.dalyCalories.toLocaleString()} kcal</p>
      </Modal>
    </>
  );
};

export default NutritionPlansGrid;

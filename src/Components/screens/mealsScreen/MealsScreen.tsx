// src/screens/MealsScreen.tsx
import React, { useState } from 'react';
import { List, Card, Tag, Button, Spin, Alert, Modal } from 'antd';
import useMeals, { MealType } from '../../../hooks/useMeals';
import { mealImages } from '../../../utils/mealImages'; // tu mapa de imágenes

const MealsScreen: React.FC = () => {
  const { meals, loading, error } = useMeals();
  const [selectedMeal, setSelectedMeal] = useState<MealType | null>(null);

  if (loading) return <Spin tip="Cargando comidas..." />;
  if (error)   return <Alert type="error" message={error} />;

  return (
    <div style={{ padding: 24, background: '#111' }}>
      <h1 style={{ color: '#fff', marginBottom: 24 }}>Comidas</h1>

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={meals}
        renderItem={(meal) => {
          const imgSrc = mealImages[meal.mealsId] ?? '/images/default-meal.jpg';
          return (
            <List.Item>
              <Card
                hoverable
                cover={
                  <img
                    alt={meal.name}
                    src={imgSrc}
                    style={{ height: 140, objectFit: 'cover' }}
                  />
                }
              >
                <Card.Meta
                  title={meal.name}
                  description={
                    <>
                      <Tag color="volcano">{meal.calories} kcal</Tag>
                      <Tag color="green">{meal.protein} g Prot</Tag>
                      <Tag color="blue">{meal.carbs} g Carb</Tag>
                      <Tag color="purple">{meal.flat} g Gras</Tag>
                    </>
                  }
                />
                <Button
                  type="link"
                  style={{ marginTop: 16, padding: 0 }}
                  onClick={() => setSelectedMeal(meal)}
                >
                  Ver detalles
                </Button>
              </Card>
            </List.Item>
          );
        }}
      />

      <Modal
        visible={!!selectedMeal}
        title={selectedMeal?.name}
        footer={null}
        onCancel={() => setSelectedMeal(null)}
      >
        <p><strong>Descripción:</strong></p>
        <p>{selectedMeal?.description}</p>
        <p>
          <strong>Calorías:</strong> {selectedMeal?.calories} kcal<br/>
          <strong>Proteína:</strong> {selectedMeal?.protein} g<br/>
          <strong>Carbohidratos:</strong> {selectedMeal?.carbs} g<br/>
          <strong>Grasa:</strong> {selectedMeal?.flat} g
        </p>
      </Modal>
    </div>
  );
};

export default MealsScreen;

// src/hooks/useMeals.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define el tipo que esperas de la API
export type MealType = {
  mealsId: number;
  name: string;
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  flat: string;
};

// URL base para la entidad Meals
const BASE_URL = 'https://sportnutrition.somee.com/api/Meals';

const useMeals = () => {
  const [meals, setMeals] = useState<MealType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carga inicial de meals
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<MealType[]>(BASE_URL);
        setMeals(resp.data);
      } catch (err) {
        setError('Error al cargar las comidas.');
        console.error('Error al cargar las comidas:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Crear una nueva meal
  const createMeal = async (
    meal: Omit<MealType, 'mealsId'>
  ): Promise<boolean> => {
    try {
      const resp = await axios.post<MealType>(
        BASE_URL,
        meal,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMeals(prev => [...prev, resp.data]);
      return true;
    } catch (err) {
      setError('Error al crear la comida.');
      console.error('Error al crear la comida:', err);
      return false;
    }
  };

  // Actualizar una meal existente
  const updateMeal = async (
    meal: MealType
  ): Promise<boolean> => {
    try {
      await axios.put(
        BASE_URL,
        meal,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setMeals(prev =>
        prev.map(m =>
          m.mealsId === meal.mealsId ? meal : m
        )
      );
      return true;
    } catch (err) {
      setError('Error al actualizar la comida.');
      console.error('Error al actualizar la comida:', err);
      return false;
    }
  };

  // Eliminar una meal
  const deleteMeal = async (
    mealsId: number
  ): Promise<boolean> => {
    try {
      await axios.delete(`${BASE_URL}/${mealsId}`);
      setMeals(prev => prev.filter(m => m.mealsId !== mealsId));
      return true;
    } catch (err) {
      setError('Error al eliminar la comida.');
      console.error('Error al eliminar la comida:', err);
      return false;
    }
  };

  return {
    meals,
    loading,
    error,
    createMeal,
    updateMeal,
    deleteMeal,
  };
};

export default useMeals;

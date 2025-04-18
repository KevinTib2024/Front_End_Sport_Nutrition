import { useEffect, useState } from 'react';
import axios from 'axios';

// Define el tipo que esperas de la API
export type NutritionPlanType = {
  nutritionPlansId: number;
  name: string;
  description: string;
  goal: string;
  dalyCalories: number;
};

// URL base para la entidad NutritionPlans
const BASE_URL = 'https://sportnutrition.somee.com/api/NutritionPlans';

const useNutritionPlans = () => {
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlanType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Carga inicial de planes de nutrición
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<NutritionPlanType[]>(BASE_URL);
        setNutritionPlans(resp.data);
      } catch (err) {
        setError('Error al cargar los planes de nutrición.');
        console.error('Error al cargar planes de nutrición:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Crear un nuevo plan de nutrición
  const createNutritionPlan = async (
    plan: Omit<NutritionPlanType, 'nutritionPlansId'>
  ): Promise<boolean> => {
    try {
      const resp = await axios.post<NutritionPlanType>(
        BASE_URL,
        plan,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setNutritionPlans(prev => [...prev, resp.data]);
      return true;
    } catch (err) {
      setError('Error al crear el plan de nutrición.');
      console.error('Error al crear plan de nutrición:', err);
      return false;
    }
  };

  // 3. Actualizar un plan de nutrición existente
  const updateNutritionPlan = async (
    plan: NutritionPlanType
  ): Promise<boolean> => {
    try {
      await axios.put(
        BASE_URL,
        plan,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setNutritionPlans(prev =>
        prev.map(p =>
          p.nutritionPlansId === plan.nutritionPlansId ? plan : p
        )
      );
      return true;
    } catch (err) {
      setError('Error al actualizar el plan de nutrición.');
      console.error('Error al actualizar plan de nutrición:', err);
      return false;
    }
  };

  // 4. Eliminar un plan de nutrición
  const deleteNutritionPlan = async (
    nutritionPlansId: number
  ): Promise<boolean> => {
    try {
      await axios.delete(`${BASE_URL}/${nutritionPlansId}`);
      setNutritionPlans(prev => prev.filter(p => p.nutritionPlansId !== nutritionPlansId));
      return true;
    } catch (err) {
      setError('Error al eliminar el plan de nutrición.');
      console.error('Error al eliminar plan de nutrición:', err);
      return false;
    }
  };

  return {
    nutritionPlans,
    loading,
    error,
    createNutritionPlan,
    updateNutritionPlan,
    deleteNutritionPlan,
  };
};

export default useNutritionPlans;

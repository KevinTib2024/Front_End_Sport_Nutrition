// src/hooks/useExercises.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define el tipo que esperas de la API
export type ExerciseType = {
  exerciseId: number;
  name: string;
  description: string;
  muscleGroup: string;
};

const BASE_URL = 'https://sportnutrition.somee.com/api/Exercises';

const useExercises = () => {
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Carga inicial de ejercicios
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<ExerciseType[]>(BASE_URL);
        setExercises(resp.data);
      } catch (err) {
        setError('Error al cargar los ejercicios');
        console.error('Error al cargar los ejercicios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
// hooks/useExercises.ts

// 1) Ajusta createExercise:
const createExercise = async (
    exercise: Omit<ExerciseType, 'exerciseId'>
  ): Promise<boolean> => {
    try {
      const resp = await axios.post<ExerciseType>(BASE_URL, exercise, {
        headers: { 'Content-Type': 'application/json' }
      });
      setExercises(prev => [...prev, resp.data]);
      return true;                             // <— DEVUELVE true
    } catch (err) {
      setError('Error al crear el ejercicio');
      console.error('Error al crear el ejercicio:', err);
      return false;                            // <— DEVUELVE false
    }
  };
  
  // 2) Ajusta updateExercise:
  const updateExercise = async (
    exercise: ExerciseType
  ): Promise<boolean> => {
    try {
      await axios.put(BASE_URL, exercise, {
        headers: { 'Content-Type': 'application/json' }
      });
      setExercises(prev =>
        prev.map(ex =>
          ex.exerciseId === exercise.exerciseId ? exercise : ex
        )
      );
      return true;
    } catch (err) {
      setError('Error al actualizar el ejercicio');
      console.error('Error al actualizar el ejercicio:', err);
      return false;
    }
  };
  
  // 3) Ajusta deleteExercise:
  const deleteExercise = async (exerciseId: number): Promise<boolean> => {
    try {
      await axios.delete(`${BASE_URL}/${exerciseId}`);
      setExercises(prev => prev.filter(ex => ex.exerciseId !== exerciseId));
      return true;
    } catch (err) {
      setError('Error al eliminar el ejercicio');
      console.error('Error al eliminar el ejercicio:', err);
      return false;
    }
  };
  
  // Y asegúrate de exportar estas funciones:
  return {
    exercises,
    loading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
  };
}  

export default useExercises;

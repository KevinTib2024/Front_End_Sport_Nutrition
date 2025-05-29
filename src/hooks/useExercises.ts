// src/hooks/useExercises.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define el tipo que esperas de la API
export type ExerciseType = {
  exercisesId: number;
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

  // 2. Crear un ejercicio
  const createExercise = async (
    exercise: Omit<ExerciseType, 'exerciseId'>
  ): Promise<boolean> => {
    try {
      const resp = await axios.post<ExerciseType>(
        BASE_URL,
        exercise,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setExercises(prev => [...prev, resp.data]);
      return true;
    } catch (err) {
      setError('Error al crear el ejercicio');
      console.error('Error al crear el ejercicio:', err);
      return false;
    }
  };

  // 3. Actualizar un ejercicio existente
  const updateExercise = async (
    exercise: ExerciseType
  ): Promise<boolean> => {
    try {
      await axios.put(
        BASE_URL,
        exercise,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setExercises(prev =>
        prev.map(ex =>
          ex.exercisesId === exercise.exercisesId ? exercise : ex
        )
      );
      return true;
    } catch (err) {
      setError('Error al actualizar el ejercicio');
      console.error('Error al actualizar el ejercicio:', err);
      return false;
    }
  };

  // 4. Eliminar un ejercicio
  const deleteExercise = async (exerciseId: number): Promise<boolean> => {
    try {
      await axios.delete(`${BASE_URL}/${exerciseId}`);
      setExercises(prev => prev.filter(ex => ex.exercisesId !== exerciseId));
      return true;
    } catch (err) {
      setError('Error al eliminar el ejercicio');
      console.error('Error al eliminar el ejercicio:', err);
      return false;
    }
  };

  return {
    exercises,
    loading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
  };
};

export default useExercises;

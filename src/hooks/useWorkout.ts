// src/hooks/useWorkouts.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

export type WorkoutType = {
  workoutId: number;
  name: string;
  description: string;
  difficultyLevel: string;
  duration: string;
  goal: string;
};

const BASE_URL = 'https://sportnutrition.somee.com/api/Workout';

const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Carga inicial
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setLoading(true);
      try {
        const resp = await axios.get<WorkoutType[]>(BASE_URL);
        setWorkouts(resp.data);
      } catch (err) {
        console.error('Error al cargar workouts:', err);
        setError('Error al cargar los entrenamientos.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Crear
  const createWorkout = async (
    workout: Omit<WorkoutType, 'workoutId'>
  ): Promise<boolean> => {
    setError(null);
    try {
      const resp = await axios.post<WorkoutType>(
        BASE_URL,
        workout,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setWorkouts(prev => [...prev, resp.data]);
      return true;
    } catch (err) {
      console.error('Error al crear workout:', err);
      setError('Error al crear el entrenamiento.');
      return false;
    }
  };

  // 3. Actualizar
  const updateWorkout = async (
    workout: WorkoutType
  ): Promise<boolean> => {
    setError(null);
    try {
      await axios.put(
        `${BASE_URL}/${workout.workoutId}`,
        workout,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setWorkouts(prev =>
        prev.map(w => (w.workoutId === workout.workoutId ? workout : w))
      );
      return true;
    } catch (err) {
      console.error('Error al actualizar workout:', err);
      setError('Error al actualizar el entrenamiento.');
      return false;
    }
  };

  // 4. Eliminar
  const deleteWorkout = async (workoutId: number): Promise<boolean> => {
    setError(null);
    try {
      await axios.delete(`${BASE_URL}/${workoutId}`);
      setWorkouts(prev => prev.filter(w => w.workoutId !== workoutId));
      return true;
    } catch (err) {
      console.error('Error al eliminar workout:', err);
      setError('Error al eliminar el entrenamiento.');
      return false;
    }
  };

  return {
    workouts,
    loading,
    error,
    createWorkout,
    updateWorkout,
    deleteWorkout,
  };
};

export default useWorkouts;

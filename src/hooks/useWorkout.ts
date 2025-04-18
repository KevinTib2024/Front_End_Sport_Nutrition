import { useEffect, useState } from 'react';
import axios from 'axios';

// Define el tipo que esperas de la API
export type WorkoutType = {
  workoutId: number;
  name: string;
  description: string;
  difficultyLevel: string;
  duration: string;
  goal: string;
};

// URL base para la entidad Workouts
const BASE_URL = 'https://sportnutrition.somee.com/api/Workout';

const useWorkouts = () => {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Carga inicial de workouts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resp = await axios.get<WorkoutType[]>(BASE_URL);
        setWorkouts(resp.data);
      } catch (err) {
        setError('Error al cargar los entrenamientos.');
        console.error('Error al cargar workouts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Crear un nuevo workout
  const createWorkout = async (
    workout: Omit<WorkoutType, 'workoutId'>
  ): Promise<boolean> => {
    try {
      const resp = await axios.post<WorkoutType>(
        BASE_URL,
        workout,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setWorkouts(prev => [...prev, resp.data]);
      return true;
    } catch (err) {
      setError('Error al crear el entrenamiento.');
      console.error('Error al crear workout:', err);
      return false;
    }
  };

  // 3. Actualizar un workout existente
  const updateWorkout = async (
    workout: WorkoutType
  ): Promise<boolean> => {
    try {
      await axios.put(
        BASE_URL,
        workout,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setWorkouts(prev =>
        prev.map(w =>
          w.workoutId === workout.workoutId ? workout : w
        )
      );
      return true;
    } catch (err) {
      setError('Error al actualizar el entrenamiento.');
      console.error('Error al actualizar workout:', err);
      return false;
    }
  };

  // 4. Eliminar un workout
  const deleteWorkout = async (
    workoutId: number
  ): Promise<boolean> => {
    try {
      await axios.delete(`${BASE_URL}/${workoutId}`);
      setWorkouts(prev => prev.filter(w => w.workoutId !== workoutId));
      return true;
    } catch (err) {
      setError('Error al eliminar el entrenamiento.');
      console.error('Error al eliminar workout:', err);
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

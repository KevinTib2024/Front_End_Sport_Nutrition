import { useEffect, useState, useCallback } from "react";
import axios from "axios";

export interface WorkoutExercise {
  workoutExercisesId?: number;
  workout_Id: number;
  exercises_Id: number;
  sets: number;
  reps: number;
  restSeconds: number;
}

const API_URL = "https://sportnutrition.somee.com/api/WorkoutExercises";

const useWorkoutExercises = () => {
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkoutExercises = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get<WorkoutExercise[]>(API_URL);
      setWorkoutExercises(data);
      setError(null);
    } catch (err: any) {
      console.error("Error al obtener los ejercicios de rutinas:", err);
      setError("Error al obtener los ejercicios de rutinas");
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkoutExercise = useCallback(
    async (payload: Omit<WorkoutExercise, "workoutExercisesId">): Promise<boolean> => {
      try {
        await axios.post(API_URL, payload);
        await fetchWorkoutExercises();
        return true;
      } catch (err: any) {
        console.error("Error al crear ejercicio en rutina:", err);
        setError("Error al crear ejercicio en rutina");
        return false;
      }
    },
    [fetchWorkoutExercises]
  );

  const updateWorkoutExercise = useCallback(
    async (payload: WorkoutExercise): Promise<boolean> => {
      if (!payload.workoutExercisesId) return false;
      try {
        await axios.put(`${API_URL}/${payload.workoutExercisesId}`, payload);
        await fetchWorkoutExercises();
        return true;
      } catch (err: any) {
        console.error("Error al actualizar ejercicio en rutina:", err);
        setError("Error al actualizar ejercicio en rutina");
        return false;
      }
    },
    [fetchWorkoutExercises]
  );

  const deleteWorkoutExercise = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        await axios.delete(`${API_URL}/${id}`);
        await fetchWorkoutExercises();
        return true;
      } catch (err: any) {
        console.error("Error al eliminar ejercicio de rutina:", err);
        setError("Error al eliminar ejercicio de rutina");
        return false;
      }
    },
    [fetchWorkoutExercises]
  );

  useEffect(() => {
    fetchWorkoutExercises();
  }, [fetchWorkoutExercises]);

  return {
    workoutExercises,
    loading,
    error,
    createWorkoutExercise,
    updateWorkoutExercise,
    deleteWorkoutExercise,
  };
};

export default useWorkoutExercises;

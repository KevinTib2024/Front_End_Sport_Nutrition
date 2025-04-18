// src/hooks/useReports.ts
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

export interface AdminReportData {
  totalUsers: number;
  usersByGender: { gender: string; count: number }[];
  usersByWeightRange: { range: string; count: number }[];
}

export interface UserReportData {
  totalExercises: number;
  totalMeals: number;
  totalWorkouts: number;
}

export type ReportData = AdminReportData | UserReportData;

const useReports = () => {
  const { state } = useAuth();
  const userType = state.user?.userType;

  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Llamadas paralelas
      const [
        usersRes,
        gendersRes,
        exercisesRes,
        mealsRes,
        workoutsRes,
      ] = await Promise.all([
        axios.get<User[]>   ("https://sportnutrition.somee.com/api/User"),
        axios.get<Gender[]> ("https://sportnutrition.somee.com/api/Gender"),
        axios.get<any[]>    ("https://sportnutrition.somee.com/api/Exercises"),
        axios.get<any[]>    ("https://sportnutrition.somee.com/api/Meals"),
        axios.get<any[]>    ("https://sportnutrition.somee.com/api/Workout"),
      ]);

      if (userType === 1) {
        // --- ADMIN ---
        const users = usersRes.data;
        const genders = gendersRes.data;
        const totalUsers = users.length;

        // count users by gender
        const usersByGender = genders.map((g) => ({
          gender: g.gender,
          count: users.filter(u => u.gender_Id === g.genderId).length,
        }));

        // define rangos de peso y cuenta
        const ranges = [
          { label: "<50kg",   min: 0,  max: 49.99 },
          { label: "50-70kg", min: 50, max: 70    },
          { label: ">70kg",   min: 70.01, max: Infinity },
        ];
        const usersByWeightRange = ranges.map(r => ({
          range: r.label,
          count: users.filter(u => u.weight >= r.min && u.weight <= r.max).length,
        }));

        setData({ totalUsers, usersByGender, usersByWeightRange });
      } else {
        // --- USUARIO NORMAL ---
        setData({
          totalExercises: exercisesRes.data.length,
          totalMeals:     mealsRes.data.length,
          totalWorkouts:  workoutsRes.data.length,
        });
      }
    } catch (err: any) {
      console.error("Error al obtener reportes:", err);
      setError("No se pudieron cargar los reportes");
    } finally {
      setLoading(false);
    }
  }, [userType]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { data, loading, error, refresh: fetchReports };
};

export default useReports;

// auxiliares de tipos (añádelos si hace falta):
interface User {
  gender_Id: number;
  weight: number;
  // ...otros campos que no usamos aquí
}
interface Gender {
  genderId: number;
  gender: string;
}

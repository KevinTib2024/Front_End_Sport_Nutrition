import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';

import App from './App';
import HomeScreen from './Components/screens/homeScreen/HomeScreen';
import ExercisesScreen from './Components/screens/exercisesScreen/ExercisesScreen';
import MealsScreen from './Components/screens/mealsScreen/MealsScreen';
import NutritionPlansScreen from './Components/screens/nutritionMealsScreen/NutritionPlansScreen';
import WorkoutExercisesScreen from './Components/screens/workoutExercisesScreen/WorkoutExercisesScreen';
import LoginScreen from './Components/screens/loginScreen/LoginScreen';
import WorkoutScreen from './Components/screens/workoutScreen/WorkoutScreen';
import ReportsScreen from './Components/screens/reportsScreen/ReportsScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<HomeScreen />} />
      <Route path="exercises"        element={<ExercisesScreen />} />
      <Route path="meals"  element={<MealsScreen />} />
      <Route path="nutritionMeals"           element={<NutritionPlansScreen />} />
      <Route path="workoutExercises" element={<WorkoutExercisesScreen />} />
      <Route path="login"             element={<LoginScreen />} />
      <Route path="workout"          element={<WorkoutScreen />} />
      <Route path="reports"          element={<ReportsScreen />} />
    </Route>
  )
);

const container = document.getElementById('root');
if (!container) throw new Error('Root container missing in index.html');

createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

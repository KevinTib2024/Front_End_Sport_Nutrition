import { Menu } from "antd";
import type { MenuProps } from "antd";
import styled from 'styled-components';
import { HomeOutlined, UnorderedListOutlined, AppstoreAddOutlined, UsergroupAddOutlined, FileDoneOutlined, LoginOutlined, AppstoreOutlined } from '@ant-design/icons';
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";  // Importa useNavigate

const StyledMenu = styled(Menu)`
  background-color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .ant-menu-item {
    color: #333;
    font-weight: bold;
    transition: transform 0.3s, box-shadow 0.3s;

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      color: #1890ff;
    }
  }

  .ant-menu-item a {
    text-decoration: none;
    display: flex;
    align-items: center;
  }

  .ant-menu-item svg {
    margin-right: 8px;
  }
`;

type MenuItem = Required<MenuProps>["items"][number];

function Navbar() {
  const { logOut, state } = useAuth();
  const navigate = useNavigate();  // Usamos useNavigate para redirigir
  const itemsNavbar: MenuItem[] = [
    { key: "/", label: <a href="/"><HomeOutlined />Inicio</a> },
    { key: "login", label: <a href="/login"><LoginOutlined />Iniciar Sesión</a> },
  ];
  const itemsNavbarLogged: MenuItem[] = [
    { key: "/", label: <a href="/"><HomeOutlined />Inicio</a> },
    { key: "/exercises", label: <a href="/exercises"><UnorderedListOutlined />Exercises</a> },
    { key: "/meals", label: <a href="/meals"><AppstoreAddOutlined />Meals</a> },
    { key: "nutritionMeals", label: <a href="/nutritionMeals"><UsergroupAddOutlined />Nutrition Meals</a> },
    { key: "workoutExercises", label: <a href="/workoutExercises"><FileDoneOutlined />Workout Exercises</a> },
    { key: "workout", label: <a href="/workout"><AppstoreOutlined />Workout</a> },
    { key: "reports", label: <a href="/reports"><AppstoreOutlined />Reports</a> },
    { key: "logOut", label: <button onClick={() => { logOut(); navigate('/'); }}><LoginOutlined />Cerrar Sesión</button> }, // Redirigir a inicio
  ];

  const handleOnClick: MenuProps["onClick"] = (e) => {
    console.log(e);
  };

  return (
    <StyledMenu mode="horizontal" items={state.user ? itemsNavbarLogged : itemsNavbar} onClick={handleOnClick} />
  );
}

export default Navbar;

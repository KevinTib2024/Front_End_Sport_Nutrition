import React, { useState } from "react";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../assets/lib/zod/validations";
import { useAuth } from "../../../Context/AuthContext"; // Importa el contexto
import './LoginScreen.css';
import myApi from "../../../assets/lib/axios/miApi";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";  // Importa el formulario de registro

interface IloginForm {
  email: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const { login } = useAuth(); // Usa el contexto de autenticación
  const { control, handleSubmit, formState: { errors } } = useForm<IloginForm>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });
  const [isModalVisible, setIsModalVisible] = useState(false);  // Estado para controlar el modal
  const navigate = useNavigate();

  // Realiza la autenticación del usuario
  const validatedLogin = async (formLogin: IloginForm) => {
    try {
      const response = await myApi.post("/login", formLogin); // Llamada al backend
      console.log("Respuesta del backend:", response.data); // Imprime la respuesta completa
      return response.data; // Retorna todos los detalles del usuario
    } catch (error) {
      console.log(error);
      return null; // Si la autenticación falla
    }
  };
  

  // Maneja el inicio de sesión
  const handleLogin = async (formLogin: IloginForm) => {
    const userData = await validatedLogin(formLogin);

    if (!userData) {
      message.error("Credenciales Invalidas");
      return;
    }

    const user = {
      email: userData.email,
      userType: userData.userTypeId,  // Cambia `user_Type_Id` a `userTypeId`
    };
    

    console.log("userType asignado desde el backend:", user.userType);

    // Guardar el usuario y tipo de usuario en el contexto
    login(user);
    // Navegar a la página principal
    navigate("/");
  };

  // Mostrar el modal de registro
  const handleRegister = () => {
    setIsModalVisible(true);  // Muestra el modal
  };

  const handleCancel = () => {
    setIsModalVisible(false);  // Cierra el modal
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>
          <UserOutlined className="user-icon" /> Bienvenido
        </h2>
        <p className="subtitle">Inicia sesión en tu cuenta</p>
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="input-group">
            <label htmlFor="email">
              <MailOutlined className="icon" /> Correo Electrónico
            </label>
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input {...field} placeholder="pedroelcapito@gmail.com" />
              )}
            />
            {errors.email ? <p>{errors.email.message}</p> : null}
          </div>
          <div className="input-group">
            <label htmlFor="password">
              <LockOutlined className="icon" /> Contraseña
            </label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input.Password {...field} placeholder="*****" />
              )}
            />
            {errors.password ? <p>{errors.password.message}</p> : null}
          </div>
          <Button type="primary" htmlType="submit" className="login-button">
            Ingresar
          </Button>
        </form>
        <p className="register-text">¿No tienes cuenta?</p>
        <Button type="link" onClick={handleRegister} className="register-button">
          Registrarse
        </Button>
      </div>

      {/* Modal de Registro */}
      <Modal
        title="Registrarse"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <RegisterForm />  {/* Aquí se renderiza el formulario de registro */}
      </Modal>
    </div>
  );
};

export default LoginScreen;

import React, { useState } from "react";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../assets/lib/zod/validations";
import { useAuth, User } from "../../../Context/AuthContext";
import "./LoginScreen.css";
import myApi from "../../../assets/lib/axios/miApi";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

interface IloginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  userId: number;
  email: string;
  userTypeId: number;
  // …otros campos si los hay
}

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IloginForm>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  const validatedLogin = async (formLogin: IloginForm): Promise<LoginResponse | null> => {
    try {
      const response = await myApi.post<LoginResponse>("/login", formLogin);
      return response.data;
    } catch {
      return null;
    }
  };

  const handleLogin = async (formLogin: IloginForm) => {
    const userData = await validatedLogin(formLogin);
    if (!userData) {
      message.error("Credenciales inválidas");
      return;
    }

    const user: User = {
      id: userData.userId,
      email: userData.email,
      userType: userData.userTypeId,
    };

    login(user);
    navigate("/");
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
            {errors.email && <p>{errors.email.message}</p>}
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
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <Button type="primary" htmlType="submit" className="login-button">
            Ingresar
          </Button>
        </form>

        <p className="register-text">¿No tienes cuenta?</p>
        <Button
          type="link"
          onClick={() => setIsModalVisible(true)}
          className="register-button"
        >
          Registrarse
        </Button>
      </div>

      {/* Modal de Registro */}
      <Modal
        title="Registrarse"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        className="register-modal"
      >
        <RegisterForm />
      </Modal>
    </div>
  );
};

export default LoginScreen;

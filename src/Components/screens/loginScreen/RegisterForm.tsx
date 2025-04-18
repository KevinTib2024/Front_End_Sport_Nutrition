import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Checkbox,
  Modal,
  InputNumber,
} from 'antd';
import { ZodError } from 'zod';
import { registerSchema } from '../../../assets/lib/zod/register';
import axios from 'axios';
import './LoginScreen.css'; // Asegura que las reglas de color se apliquen

const { Option } = Select;

interface Gender { genderId: number; gender: string }
interface IdentificationType { identificationTypeId: number; identification_Type: string }
interface UserType { userTypeId: number; userType: string }

const RegisterForm: React.FC = () => {
  const [form] = Form.useForm();
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [genders, setGenders] = useState<Gender[]>([]);
  const [identificationTypes, setIdentificationTypes] = useState<IdentificationType[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);

  useEffect(() => {
    axios.get<Gender[]>('https://sportnutrition.somee.com/api/Gender')
      .then(r => setGenders(r.data))
      .catch(() => message.error('Error al cargar los géneros'));

    axios.get<IdentificationType[]>('https://sportnutrition.somee.com/api/IdentificationType')
      .then(r => setIdentificationTypes(r.data))
      .catch(() => message.error('Error al cargar tipos de identificación'));

    axios.get<UserType[]>('https://sportnutrition.somee.com/api/UserType')
      .then(r => setUserTypes(r.data))
      .catch(() => message.error('Error al cargar tipos de usuario'));
  }, []);

  const onFinish = async (values: any) => {
    try {
      const adjusted = {
        ...values,
        genero: String(values.genero),
        tipoIdentificacion: String(values.tipoIdentificacion),
        tipoUsuario: String(values.tipoUsuario),
        fechaNacimiento: values.fechaNacimiento.format('YYYY-MM-DD'),
        workout_Id: Number(values.workout_Id),
        nutritionPlans_Id: Number(values.nutritionPlans_Id),
        height: Number(values.height),
        weight: Number(values.weight),
      };
      await registerSchema.parseAsync(adjusted);

      const userData = {
        gender_Id: adjusted.genero,
        identificationType_Id: adjusted.tipoIdentificacion,
        user_Type_Id: adjusted.tipoUsuario,
        workout_Id: adjusted.workout_Id,
        nutritionPlans_Id: adjusted.nutritionPlans_Id,
        names: adjusted.nombres,
        lastNames: adjusted.apellidos,
        identificationNumber: adjusted.noIdentificacion,
        birthDate: adjusted.fechaNacimiento,
        email: adjusted.email,
        password: adjusted.password,
        contact: adjusted.contacto,
        height: adjusted.height,
        weight: adjusted.weight,
      };

      await axios.post('https://sportnutrition.somee.com/api/User', userData);
      message.success('Registro exitoso');
      form.resetFields();
      setAcceptedTerms(false);
    } catch (err: any) {
      if (err instanceof ZodError) {
        const fields = err.issues.map(issue => ({
          name: issue.path,
          errors: [issue.message],
        }));
        form.setFields(fields);
      } else if (axios.isAxiosError(err)) {
        message.error(err.response?.data?.message || err.message);
      } else {
        console.error(err);
        message.error('Error inesperado, inténtalo de nuevo');
      }
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="register-form"
      initialValues={{ workout_Id: 0, nutritionPlans_Id: 0, height: 0, weight: 0 }}
    >
      <Form.Item label="Nombres" name="nombres" rules={[{ required: true, message: 'Por favor ingrese sus nombres' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Apellidos" name="apellidos" rules={[{ required: true, message: 'Por favor ingrese sus apellidos' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Género" name="genero" rules={[{ required: true, message: 'Por favor seleccione su género' }]}
      >
        <Select placeholder="Seleccione su género">
          {genders.map(g => (
            <Option key={g.genderId} value={g.genderId}>{g.gender}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Tipo de Identificación" name="tipoIdentificacion" rules={[{ required: true, message: 'Por favor seleccione tipo de identificación' }]}
      >
        <Select placeholder="Seleccione tipo de identificación">
          {identificationTypes.map(i => (
            <Option key={i.identificationTypeId} value={i.identificationTypeId}>
              {i.identification_Type}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Número de Identificación" name="noIdentificacion" rules={[{ required: true, message: 'Por favor ingrese su número de identificación' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Tipo de Usuario" name="tipoUsuario" rules={[{ required: true, message: 'Seleccione su tipo de usuario' }]}
      >
        <Select placeholder="Seleccione tipo de usuario">
          {userTypes.map(u => (
            <Option key={u.userTypeId} value={u.userTypeId}>{u.userType}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Fecha de Nacimiento" name="fechaNacimiento" rules={[{ required: true, message: 'Por favor ingrese su fecha de nacimiento' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Por favor ingrese un correo válido' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Por favor ingrese una contraseña segura' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label="Confirmar Contraseña" name="confirmPassword" dependencies={["password"]} hasFeedback rules={[
        { required: true, message: 'Por favor confirme su contraseña' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) return Promise.resolve();
            return Promise.reject(new Error('Las contraseñas no coinciden'));
          },
        }),
      ]}>
        <Input.Password />
      </Form.Item>

      <Form.Item label="Contacto" name="contacto" rules={[{ required: true, message: 'Por favor ingrese su número de contacto' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="ID Rutina" name="workout_Id" rules={[{ required: true, message: 'Requerido' }]}
      >
        <InputNumber style={{ width: '100%' }} min={0} />
      </Form.Item>

      <Form.Item label="ID Plan Nutricional" name="nutritionPlans_Id" rules={[{ required: true, message: 'Requerido' }]}
      >
        <InputNumber style={{ width: '100%' }} min={0} />
      </Form.Item>

      <Form.Item label="Altura (cm)" name="height" rules={[{ required: true, message: 'Requerido' }]}
      >
        <InputNumber style={{ width: '100%' }} min={0} />
      </Form.Item>

      <Form.Item label="Peso (kg)" name="weight" rules={[{ required: true, message: 'Requerido' }]}
      >
        <InputNumber style={{ width: '100%' }} min={0} />
      </Form.Item>

      <Form.Item name="terminos" valuePropName="checked" rules={[{ validator: (_, val) => val ? Promise.resolve() : Promise.reject('Debes aceptar') }]}
      >
        <Checkbox onChange={e => setAcceptedTerms(e.target.checked)}>
          Acepto los 
          <a onClick={() => setTermsModalVisible(true)}>términos y condiciones</a>.
        </Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={!acceptedTerms}>
          Registrarse
        </Button>
      </Form.Item>

      <Modal title="Términos y Condiciones" open={termsModalVisible} footer={null} onCancel={() => setTermsModalVisible(false)} width={700}>
        {/* Contenido de términos aquí */}
      </Modal>
    </Form>
  );
};

export default RegisterForm;

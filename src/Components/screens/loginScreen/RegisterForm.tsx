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
interface Workout { workoutId: number; name: string }
interface NutritionPlan { nutritionPlansId: number; name: string }

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [genders, setGenders] = useState<Gender[]>([]);
  const [identificationTypes, setIdentificationTypes] = useState<IdentificationType[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);

  useEffect(() => {
    // Carga de datos para selects
    axios.get<Gender[]>('https://sportnutrition.somee.com/api/Gender')
      .then(r => setGenders(r.data))
      .catch(() => message.error('Error al cargar los géneros'));

    axios.get<IdentificationType[]>('https://sportnutrition.somee.com/api/IdentificationType')
      .then(r => setIdentificationTypes(r.data))
      .catch(() => message.error('Error al cargar tipos de identificación'));

    axios.get<UserType[]>('https://sportnutrition.somee.com/api/UserType')
      .then(r => setUserTypes(r.data))
      .catch(() => message.error('Error al cargar tipos de usuario'));

    // Carga de rutinas y planes nutricionales
    axios.get<Workout[]>('https://sportnutrition.somee.com/api/Workout')
      .then(r => setWorkouts(r.data))
      .catch(() => message.error('Error al cargar rutinas'));

    axios.get<NutritionPlan[]>('https://sportnutrition.somee.com/api/NutritionPlans')
      .then(r => setNutritionPlans(r.data))
      .catch(() => message.error('Error al cargar planes nutricionales'));
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
      onSuccess?.();
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
      initialValues={{ workout_Id: undefined, nutritionPlans_Id: undefined, height: 0, weight: 0 }}
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

      <Form.Item label="Rutina" name="workout_Id" rules={[{ required: true, message: 'Seleccione una rutina' }]}
      >
        <Select placeholder="Seleccione rutina">
          {workouts.map(w => (
            <Option key={w.workoutId} value={w.workoutId}>{w.name}</Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Plan Nutricional" name="nutritionPlans_Id" rules={[{ required: true, message: 'Seleccione un plan nutricional' }]}
      >
        <Select placeholder="Seleccione plan nutricional">
          {nutritionPlans.map(n => (
            <Option key={n.nutritionPlansId} value={n.nutritionPlansId}>{n.name}</Option>
          ))}
        </Select>
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

      <Modal 
        title="Términos y Condiciones"
        open={termsModalVisible} 
        footer={null} 
        onCancel={() => setTermsModalVisible(false)} 
        width={700}>
        
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <h3>Política de Privacidad</h3>
          <p><strong>1. Introducción</strong></p>
          <p>La sitio web Sport Nutrition de Colombia se compromete a proteger la privacidad y la seguridad de los datos personales de nuestros usuarios, visitantes y participantes. Estos términos y condiciones explican cómo recopilamos, utilizamos y protegemos sus datos personales de conformidad con la Ley 1581 de 2012 y demás normativas vigentes sobre protección de datos personales en Colombia.</p>

          <p><strong>2. Responsable del Tratamiento de Datos</strong></p>
          <p>El responsable del tratamiento de los datos personales es Sport Nutrition de Colombia, ubicado en [Chia], y con contacto a través del correo electrónico [sportnutrition184@gmail.com].</p>

          <p><strong>3. Finalidad del Tratamiento de Datos</strong></p>
          <p>Los datos personales que recopilamos serán utilizados con las siguientes finalidades:</p>
          <ul>
            <li>Registro de visitantes: Para llevar un control de los visitantes y participantes en actividades del SportNutrition.</li>
            <li>Comunicación: Para enviar información sobre actividades, eventos y exposiciones futuras del SportNutrition, así como boletines informativos.</li>
            <li>Evaluación de la experiencia: Para recibir comentarios y sugerencias que nos permitan mejorar nuestros servicios y la experiencia de los visitantes.</li>
            <li>Cumplimiento legal: Para cumplir con obligaciones legales y normativas relacionadas con la operación del SportNutrition.</li>
          </ul>

          <p><strong>4. Tipos de Datos Recopilados</strong></p>
          <ul>
            <li>Datos de contacto: Nombre, correo electrónico, número de teléfono, dirección, etc.</li>
            <li>Datos de identificación: Tipo de documento de identidad, número de documento, etc.</li>
            <li>Datos de actividad en SportNutrition: Información sobre las visitas, participación en eventos, y preferencias relacionadas con las actividades de SportNutrition.</li>
            <li>Datos sensibles (si aplica): En caso de que SportNutrition reciba datos sensibles, como información sobre discapacidad, se solicitará el consentimiento expreso para su tratamiento.</li>
          </ul>

          <p><strong>5. Derechos de los Titulares de los Datos</strong></p>
          <ul>
            <li>Acceder: A sus datos personales de forma gratuita y obtener información sobre cómo se están utilizando.</li>
            <li>Rectificar y actualizar: Sus datos personales cuando estos sean inexactos o estén desactualizados.</li>
            <li>Suprimir: Sus datos personales en caso de que ya no sean necesarios para las finalidades del tratamiento.</li>
            <li>Revocar la autorización: Para el tratamiento de sus datos personales en cualquier momento, sin efectos retroactivos.</li>
            <li>Oponerse: Al tratamiento de sus datos en los casos previstos por la ley.</li>
          </ul>

          <p><strong>6. Autorización del Titular</strong></p>
          <p>Al ingresar SportNutrition, inscribirse en nuestras actividades o interactuar con nuestros servicios, los usuarios dan su consentimiento expreso para el tratamiento de sus datos personales, conforme a los términos expuestos en este documento.</p>

          <p><strong>7. Modificaciones a la Política de Privacidad</strong></p>
          <p>ESportNutrition se reserva el derecho de modificar esta política de privacidad en cualquier momento. Las modificaciones serán publicadas en el sitio web oficial y estarán disponibles para consulta por los usuarios.</p>

          <p><strong>8. Contacto</strong></p>
          <p>Si tiene alguna duda, comentario o solicitud sobre el tratamiento de sus datos personales, puede contactar SportNutrition de Colombia a través del correo electrónico [sportnutrition184@gmail.com].</p>

          <div style={{ marginTop: '20px' }}>
            <Checkbox>
              Acepto los términos y condiciones
            </Checkbox>
          </div>
        </div>

      </Modal>
    </Form>
  );
};

export default RegisterForm;

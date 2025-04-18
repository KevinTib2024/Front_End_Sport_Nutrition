import { object, string, boolean } from "zod";

export const registerSchema = object({
  nombres: string().min(1, "Por favor ingrese sus nombres"),
  apellidos: string().min(1, "Por favor ingrese sus apellidos"),
  genero: string().nonempty("Por favor seleccione su género"),
  tipoIdentificacion: string().nonempty("Seleccione su tipo de identificación"),
  noIdentificacion: string().min(1, "Por favor ingrese su número de identificación"),
  tipoUsuario: string().nonempty("Seleccione su tipo de usuario"),
  fechaNacimiento: string().min(1, "Por favor ingrese su fecha de nacimiento"),
  email: string().email("Correo inválido").min(1, "Email requerido"),
  password: string()
    .min(8, "Contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe tener al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe tener al menos una letra minúscula")
    .regex(/[0-9]/, "Debe tener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe tener un carácter especial"),
  contacto: string().min(1, "Por favor ingrese su número de contacto"),
  terminos: boolean().refine(val => val === true, {
    message: "Debes aceptar los términos y condiciones",
  }),
});

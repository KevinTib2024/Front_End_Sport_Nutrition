
import {object, string} from "zod"

export const  loginSchema = object({email: string().trim().email("email invalido").min(1, "email requerido"),password:string().min(1, "Contraseña requerida")
    .min(8, "Contraseña necesita mas de 8 caracteres")
    .regex(/[A-Z]/, {
      message: "La contraseña debe tener al menos una letra mayúscula.",
    })
    .regex(/[a-z]/, {
      message: "La contraseña debe tener al menos una letra minúscula.",
    })
    .regex(/[0-9]/, { message: "La contraseña debe tener al menos un número." })
    .regex(/[^A-Za-z0-9]/, {
      message: "La contraseña debe tener al menos un carácter especial.",
    }), 

})
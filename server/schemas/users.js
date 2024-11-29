import z from 'zod'

const userSchema = z.object({
    name: z.string('El nombre debe tener al menos 3 caracteres').trim().min(3,'El nombre debe tener al menos 3 caracteres').max(30,'El nombre no puede tener mas de 30 caracteres'),
    lastname: z.string().trim().min(3,'El apellido debe tener al menos 3 caracteres').max(30,'El apellido no puede tener mas de 30 caracteres'),
    identityCard: z.number('La C.I debe tener al menos 7 digitos').min(1000000,'La C.I debe tener al menos 7 digitos').max(50000000, 'la C.I no puede tener mas de 8 digitos'),
    charge: z.enum(['Estudiante', 'Profesor'], {message:'Escoga una opcion entre Profesor o Estudiante'}),
    password: z.string({ message: 'EL password debe ser un string' }).trim().min(8, { message: 'EL password debe tenes al menos 8 caracteres'} )
})

export const validateUser = (user) => {
    return userSchema.safeParse(user)
}

export const validatePartialUser = (user) => {
    return userSchema.partial().safeParse(user)
}
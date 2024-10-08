import z from 'zod'

const userSchema = z.object({
    name: z.string().trim().min(3,'El nombre debe tener al menos 3 caracteres').max(30,'El nombre no puede tener mas de 30 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo se permiten letras y espacios'),
    lastname: z.string().trim().min(3,'El apellido debe tener al menos 3 caracteres').max(30,'El apellido no puede tener mas de 30 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo se permiten letras y espacios'),
    identityCard: z.number().min(1000000,'La C.I debe tener al menos 7 digitos').max(50000000, 'la C.I no puede tener mas de 8 digitos'),
    charge: z.string(),
    password: z.string({ message: 'EL password debe ser un string' }).trim().min(8, { message: 'EL password debe tenes al menos 8 caracteres'} )
})

export const validateUser = (user) => {
    return userSchema.safeParse(user)
}

export const validatePartialUser = (user) => {
    return userSchema.partial().safeParse(user)
}
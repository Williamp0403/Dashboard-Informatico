import z from 'zod'

const userSchema = z.object({
    name: z.string().trim().min(3,'El nombre debe tener al menos 3 caracteres').max(30,'El nombre no puede tener mas de 30 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo se permiten letras y espacios'),
    lastname: z.string().trim().min(3,'El apellido debe tener al menos 3 caracteres').max(30,'El apellido no puede tener mas de 30 caracteres').regex(/^[A-Za-z\s]+$/, 'Solo se permiten letras y espacios'),
    identityCard: z.number().min(7,'La C.I debe tener al menos 7 numeros').max(8, 'la C.I no puede tener mas de 8 numeros'),
    charge: z.string()
})

export const validateUser = (user) => {
    return userSchema.safeParse(user)
}
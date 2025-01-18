import z from 'zod'

const userSchema = z.object({
    name: z.string('El nombre debe tener al menos 3 caracteres').trim().min(3,'El nombre debe tener al menos 3 caracteres').max(30,'El nombre no puede tener más de 30 caracteres'),
    lastname: z.string().trim().min(3,'El apellido debe tener al menos 3 caracteres').max(30,'El apellido no puede tener mas de 30 caracteres'),
    identityCard: z.number({ message:'La C.I debe tener al menos 7 digitos' }).min(1000000,'La C.I debe tener al menos 7 digitos').max(50000000, 'la C.I no puede tener mas de 8 digitos'),
    charge: z.enum(['Students', 'Teachers'], { message:'Escoga una opcion entre Profesor o Estudiante' }),
    semester: z.enum (
        ['01S-2630-D1', '02S-2630-D1', '02S-2630-D2', '03S-2630-D1', '04S-2630-D1', '04S-2630-D2', '04S-2630-D3', '05S-2630-D1', '06S-2630-D1', '06S-2630-D2', '06S-2630-D3', '07S-2630-D1', '08S-2630-D1', '08S-2630-D2'], 
        { message: 'Escoga un semestre' }),
    password: z.string({ message: 'EL password debe ser un string' }).trim().min(8, { message: 'EL password debe tenes al menos 8 caracteres'} )
})

const activitieSchema = z.object ({
    title: z.string().trim().min(5, 'El titulo debe tener al menor 5 caracteres').max(30, 'El titulo no puede tener más de 20 caracteres'),
    description : z.string().min(5, 'La descripcion debe tener al menor 5 caracteres'),
    court: z.enum (['I Corte', 'II Corte', 'III Corte', 'IV Corte'], { message: 'Escoga un corte' }),
    date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "La fecha no es válida", }),
    value: z.number({message: 'Ingrese un porcentaje'}).min(1, 'El porcentaje no puede ser menor a 1').max(25, 'El porcentaje no puede ser mayor a 25')
})

const objetoEsquema = z.object ({ 
    rating: z.number({message: "Ingrese una nota"}).min(0, { message: "La nota debe ser mayor o igual a 0"} ).max(20, {message: "La nota debe ser menor o igual a 20"})
})

const arrayEsquema = z.object({ 
    listNotes: z.array(objetoEsquema), 
})

export const validatePartialUser = (user) => {
    return userSchema.partial().safeParse(user)
}

export const validateActivitie = (activitie) => {
    return activitieSchema.safeParse(activitie)
}

export const validateNotes = (notes) => {
    return arrayEsquema.safeParse(notes)
}
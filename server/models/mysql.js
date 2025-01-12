import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'
import { format } from 'date-fns'

const config = {
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '1234',
    database: 'dashboard_informatico'
}

const connection = await mysql.createConnection(config)

export class userModel {
    static async register ({ name,lastname,identityCard,section,idSection,matter,idMatter,charge,password  }) {
        try {
            const [result] = await connection.query (
                `SELECT * FROM ${charge} WHERE identityCard = ?`, [identityCard]
            )

            if(result.length != 0) return false

            const hashedPassword = await bcrypt.hash(password, 10)

            if (charge == "Students") await connection.query (
                `INSERT INTO ${charge} (name,lastname,identityCard,id_section,password)
                VALUES (?,?,?,?,?)`, [name,lastname,identityCard,idSection,hashedPassword] ) 
            

            if (charge == "Teachers")  await connection.query (
                `INSERT INTO ${charge} (name,lastname,id_matter,identityCard,password)
                VALUES (?,?,?,?,?)`, [name,lastname,idMatter,identityCard,hashedPassword] )

            return {
                name: name,
                lastname: lastname,
                id_section: idSection,
                id_matter: idMatter,
                identityCard: identityCard,
                charge: charge
            }
       
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async login ({ identityCard,password,charge }) {
        try {
            const [result] = await connection.query (
                `SELECT * FROM ${charge} WHERE identityCard = ?`, [identityCard]
            )
            if(result.length == 0) return false

            const isValid = await bcrypt.compare(password, result[0].password)
            if(!isValid) return false

            return {
                id_student: result[0].id_student,
                id_teacher: result[0].id_teacher,
                name: result[0].name,
                lastname: result[0].lastname,
                id_section: result[0].id_section,
                id_matter: result[0].id_matter,
                charge: charge
            }
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async joinRooms ({ id_section,id_matter }) {
        try {
            if (id_section != 'undefined') {
                const [matters] = await connection.query (
                    `SELECT id_matter, matter_name FROM Sections s JOIN Matters m 
                    ON s.id_semester = m.id_semester WHERE id_section = ?`, [id_section]
                )
                return matters
            }
            if (id_matter != 'undefined') {
                const [matter] = await connection.query (
                    `SELECT id_matter, matter_name FROM Matters WHERE id_matter = ?`, [id_matter]
                )
                return matter
            }
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async getAllMatters () {
        try {   
            const [matters] = await connection.query(`SELECT id_matter id_data, matter_name data_name FROM Matters`)
            console.log(matters)
            return matters
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async getSemesters () {
        try {
            const [semesters] = await connection.query(`SELECT id_section id_data, section data_name FROM Sections`)
            return semesters
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async addActivitie ({title,description,court,id_matter,date,value }) {
        try {
            await connection.query(
                `INSERT INTO Activities (title,description,court,id_matter,date,value) VALUES
                (?,?,?,?,?,?)`, [title,description,court,id_matter,date,value]
            )
            return 'Actividad agregada'
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async getActivitie ({ id_matter, id_section }) {
        try {
            if (id_matter != 'undefined') {
                const [activities] = await connection.query (
                    `SELECT a.id_matter, a.id_activitie , matter_name, title, description, court, DATE_FORMAT(date, '%Y-%m-%d') as date, value FROM Activities a JOIN Matters m 
                    ON a.id_matter = m.id_matter WHERE m.id_matter = ?`, [id_matter]
                )
                if (activities.length == 0) return false
                return activities
            } 

            if (id_section != 'undefined') {
                const [activities] = await connection.query (
                    `SELECT a.id_matter, matter_name, title, description, court, DATE_FORMAT(date, '%Y-%m-%d') as date, value FROM Sections s JOIN Matters m 
                    ON s.id_semester = m.id_semester JOIN Activities a ON m.id_matter = a.id_matter
                   WHERE s.id_section = ?`, [id_section]
                )
                if (activities.length == 0) return false             
                return activities
            }

        } catch(e) {
            console.log(e)
            return
        }
    }

    static async getNotes ({ id_matter, id_activitie }) {
        try {
            const [ notes ] = await connection.query(
                `SELECT id_note, stu.id_student ,name, lastname, identityCard, rating FROM Students stu 
                LEFT JOIN Sections sec ON stu.id_section = sec.id_section 
                LEFT JOIN Matters m ON m.id_semester = sec.id_semester 
                LEFT JOIN Notes n ON stu.id_student = n.id_student AND n.id_activitie = ?
                WHERE m.id_matter = ?`, [id_activitie, id_matter]
            )
            return notes
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async createNotes ({ listNotes, activitie }) {
        try {
            const date = new Date()
            const currentDate = format(date, 'yyyy-MM-dd')

            for (const note of listNotes) {
                const { id_student, rating } = note
                await connection.query (
                    `INSERT INTO Notes (id_student, id_activitie, rating, date) VALUES (?,?,?,?)`,
                    [id_student, activitie, rating, currentDate]
                )
            }

            return 'Notas registradas correctamente'
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async updateNotes ({ listNotes, activitie  }) {
        try {
            const date = new Date()
            const currentDate = format(date, 'yyyy-MM-dd')

            for (const note of listNotes) {
                const { id_note ,id_student, rating } = note
                console.log( id_note ,id_student, rating)
                await connection.query (
                    `UPDATE Notes SET rating = ?, date = ? WHERE id_note = ?`,
                    [rating, currentDate, id_note]
                )
            }

            return 'Notas actualizadas correctamente'
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async getMatters ({ id_section }) {
        try {
            const [matters] = await connection.query (
                `SELECT id_matter, matter_name, section FROM Sections s JOIN Matters m 
                ON s.id_semester = m.id_semester WHERE id_section = ?`, [id_section]
            )
            return matters
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async getNotesStudent ({ id_matter, id_student }) {
        try {
            const [ notes ] = await connection.query (
                `SELECT title, court, value, rating, id_matter FROM Activities a JOIN Notes n 
                ON a.id_activitie = n.id_activitie
                WHERE id_student = ? AND id_matter = ?`, [id_student, id_matter]
            )
            return notes

        } catch(e) {
            console.log(e)
            return
        }
    }

    static async insertMessages ({msg}) {
        try {
            const date = new Date()
            const currentDate = format(date, 'yyyy-MM-dd')
            const [ message ] = await connection.query (
                 `INSERT INTO Messages (content, username, id_matter, date, hour)
                 VALUES (?,?,?,?,?)`, [msg.content, msg.username, msg.group, currentDate, msg.hour]
                )
            return message
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async getMessages ({ room }) {
        try {
            const [messages] = await connection.query (
                `SELECT * FROM Messages WHERE id_matter = ?`, [room]
            )
            return messages
        } catch(e) {
            console.log(e)
            return
        }
    }
}
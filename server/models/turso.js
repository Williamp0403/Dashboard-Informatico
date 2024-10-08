import { createClient } from '@libsql/client'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const db = createClient ({
    url: 'libsql://leading-night-williamp0403.turso.io',
    authToken: process.env.DB_TOKEN
})

export class userModel {
    static async register ({ name,lastname,identityCard,charge,password }) {
        try {
            const result = await db.execute ({
                sql: `SELECT * FROM users WHERE identityCard = ?`,
                args: [identityCard]
            })
            if(result.rows.length != 0) return false

            const hashedPassword = await bcrypt.hash(password, 10)
            await db.execute({
                sql: `INSERT INTO users (name,lastname,identityCard,charge,password) VALUES (?,?,?,?,?)`,
                args: [name,lastname,identityCard,charge,hashedPassword]
            })
            return {
                name: name,
                lastname: lastname,
                identityCard: identityCard,
                charge: charge
            }
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async login ({ identityCard,password }) {
        try {
            const result = await db.execute ({
                sql: `SELECT * FROM users WHERE identityCard = ?`,
                args: [identityCard]
            })
            if(result.rows == 0) return false

            let isValid = await bcrypt.compare(password, result.rows[0].password)
            if (!isValid) return false

            return {
                name: result.rows[0].name,
                lastname: result.rows[0].lastname,
                charge: result.rows[0].charge
            }
        } catch (e) {
            console.log(e)
            return
        }
    }
}
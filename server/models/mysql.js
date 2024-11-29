import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

const config = {
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: '1234',
    database: 'dashboard_informatico'
}

const connection = await mysql.createConnection(config)

export class userModel {
    static async register ({ name,lastname,identityCard,charge,password }) {
        try {
            const [result] = await connection.query (
                `SELECT * FROM users WHERE identityCard = ?`, [identityCard]
            )
            if(result.length != 0) return false

            const hashedPassword = await bcrypt.hash(password, 10)

            await connection.query (
                `INSERT INTO users (name,lastname,identityCard,charge,password)
                VALUES (?,?,?,?,?)`,
                [name,lastname,identityCard,charge,hashedPassword]
            )
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
            const [result] = await connection.query (
                `SELECT * FROM users WHERE identityCard = ?`, [identityCard]
            )

            if(result.length == 0) return false

            const isValid = await bcrypt.compare(password, result[0].password)
            if(!isValid) return false

            return {
                name: result[0].name,
                lastname: result[0].lastname,
                charge: result[0].charge
            }
        } catch (e) {
            console.log(e)
            return
        }
    }
}
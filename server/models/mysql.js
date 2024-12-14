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
    static async register ({ name,lastname,identityCard,charge,matter,password }) {
        try {
            const [result] = await connection.query (
                `SELECT * FROM ${charge} WHERE identityCard = ?`, [identityCard]
            )
            if(result.length != 0) return false

            const hashedPassword = await bcrypt.hash(password, 10)

            if (charge == "Students") { await connection.query (
                `INSERT INTO ${charge} (name,lastname,identityCard,password)
                VALUES (?,?,?,?)`, [name,lastname,identityCard,hashedPassword] ) 
                return {
                    name: name,
                    lastname: lastname,
                    matter: matter,
                    identityCard: identityCard,
                    charge: charge
                }
            }

            if (charge == "Teachers") { await connection.query (
                `INSERT INTO ${charge} (name,lastname,id_matter,identityCard,password)
                VALUES (?,?,?,?,?)`, [name,lastname,matter,identityCard,hashedPassword] )
                return {
                    name: name,
                    lastname: lastname,
                    matter: matter,
                    identityCard: identityCard,
                    charge: charge
                }
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
            console.log(result)
            return {
                name: result[0].name,
                lastname: result[0].lastname,
                matter: result[0].id_matter,
                charge: charge
            }
        } catch (e) {
            console.log(e)
            return
        }
    }

    static async getMatters () {
        try {   
            const [matters] = await connection.query(`SELECT * FROM Matters`)
            console.log(matters)
            return matters
        } catch (e) {
            console.log(e)
            return
        }
    }
}
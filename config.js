import mysql from 'promise-mysql'
const host = "localhost"
const user = "admin"
const admin_id = ""
const database = "DATABASENAME"
const password = "PASSWORD"
const botToken = "TOKEN"

const conn = async () => {
  return await mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database
  })
}

export {
  conn, host, user, database, password, botToken, admin_id
}
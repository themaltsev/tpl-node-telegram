import mysql from 'promise-mysql'

const privateKey = "private_key"
const host = "localhost"
const user = "LOGIN_MYSQL"
const database = "YOUR_BASENAME"
const password = "YOUR_PASS"
const botToken = 'YOUR_BOT_TOKEN';


const conn = async () => {
    return await mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database
    })
  }


const generateOTP = () => {

      let digits = '0123456789abcdefghijklmnopqrstuvwxyz';
      let otpLength = 12;
      let otp = '';
  
      for(let i=1; i<=otpLength; i++) {
          let index = Math.floor(Math.random()*(digits.length));
          otp = otp + digits[index];
      }
      return otp;
}

  
export {
    conn, generateOTP, fromMail, 
    privateKey, host, user, database, password, botToken
}
import { conn, botToken, admin_id } from './config.js'
import TelegramBot from 'node-telegram-bot-api';
import { debug, updateUserData, deleteMessage, getUserData } from "./helpers.js"


const walletFinish = chat_id => {
    return "Тут текст уведомления!"
}

let db, users
try {
    db = await conn()
} catch (error) {
    console.log(error);
}

let query = `SELECT * FROM users`
// console.log(query);
try {
    users = await db.query(query)
} catch (error) {
    console.log(error);
}
await db.end()

let countUsers = users.length - 1

users.forEach( async (user, index) => {

    let wallet = +user.wallet

    if (wallet > 0) {
        // отнимаем каждый день
        wallet = wallet - 1
        await updateUserData(user.chat_id, 'wallet', wallet)
        console.log(wallet)
    }
    if (wallet == 0) {
      console.log(walletFinish(user.chat_id));
    }

    if (index == countUsers) process.exit()
});

 



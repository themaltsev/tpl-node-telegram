import TelegramBot from 'node-telegram-bot-api';
import { conn, generateOTP, botToken } from './config.js'
const hashPass = (pass) => bcrypt.hashSync(pass, 3)

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(botToken, {polling: true});

// messages.
bot.on('message', async (msg) => {
    let chat_id = msg.chat.id
    let user_name = msg.chat?.username.toLowerCase()
    if (!user_name) user_name = chat_id
    let text = msg.text
    bot.deleteMessage(chat_id, msg.message_id)

    if (text === '/start') {

        let orderTable = `ORDERS_${user_name}`
        let newPass = generateOTP()
        let db, users
        

        try {
            db = await conn()
        } catch (error) {
            console.log(error);
        }
        try {
            users = await db.query(`SELECT * FROM users`)
        
        } catch (error) {
            console.log(error);
        }

        let userExist = false

        users.forEach(user => {
            if (user_name === user.login) userExist = true
        })

        if (!userExist) {
            let query = `INSERT INTO users(login, password, token, premium, sms_id, company_name, tpl_review, subscription ) VALUES ('${user_name}', '${hashPass(newPass)}', '${chat_id}', '0', '', '', '', '')`
            await db.query(query)

            let createBaseOrder = `CREATE TABLE IF NOT EXISTS ${orderTable} (
                id INTEGER AUTO_INCREMENT PRIMARY KEY, 
                phone VARCHAR(255) NOT NULL,
                name VARCHAR(255) NOT NULL,
                model VARCHAR(255) NOT NULL,
                adress VARCHAR(255) NOT NULL,
                date VARCHAR(255) NOT NULL,
                time VARCHAR(255) NOT NULL,
                ready INTEGER DEFAULT(0) NOT NULL,
                info TEXT NOT NULL
                );`

            await db.query(createBaseOrder)
            await bot.sendMessage(chat_id, `Твой логин: ${user_name} как в телеграм`, {
                reply_markup: {
                    keyboard: [
                        ['Обновить пароль'],
                    ],
                    resize_keyboard: true
                }
            });
            await bot.sendMessage(chat_id, newPass);
            

        }
        else await bot.sendMessage(chat_id, `Пользователь @${user_name} уже существует!`, {
            reply_markup: {
                keyboard: [
                    ['Обновить пароль'],
                ],
                resize_keyboard: true
            }
        });

        await db.end()

    }

    if (text === 'Обновить пароль') {

        let newPass = generateOTP()
        let db

        try {
            db = await conn()
        } catch (error) {
            console.log(error);
        }
        try {
            let query = `UPDATE users SET password = '${hashPass(newPass)}' WHERE login = '${user_name}'`
            await db.query(query)
            await db.end()
        
        } catch (error) {
            console.log(error);
        }
        await bot.sendMessage(chat_id, `Твой логин: ${user_name} как в телеграм`, {
            reply_markup: {
                keyboard: [
                    ['Обновить пароль'],
                ],
                resize_keyboard: true
            }
        });
        await bot.sendMessage(chat_id, `${newPass}`)
    
    }

});
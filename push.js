import { conn, botToken, admin_id } from './config.js'
import TelegramBot from 'node-telegram-bot-api';


const bot = new TelegramBot(botToken, {
    polling: false
});


let pushTime = new Date().toLocaleTimeString().slice(0, -3)

// bot.sendMessage(admin_id, 'admin_id ' + pushTime)

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

users.forEach(user => {
    if (user.push == 'true' && pushTime == user.push_time) {
        // отправляем сообщение
        bot.sendMessage(user.chat_id, '🤓 Пришло время уведомлений', {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Кнопка",
                            callback_data: "/btm"
                        },
                    ],
                    [
                        {
                            text: "Закрыть",
                            callback_data: "/exit"
                        },
                    ]
                ]
            }
        })
    }
});



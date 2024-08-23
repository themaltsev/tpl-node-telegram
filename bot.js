
import TelegramBot from 'node-telegram-bot-api';
import { conn, botToken, admin_id } from './config.js'
import { getChatID, capitalizeFirstLetter, userList, shuffleArray, debug, createUser, updateUserData, deleteMessage, getUserData } from "./helpers.js"

// await getUserData(chat_id, 'chat_id')
// debug(msg)
// await updateUserData(chat_id, 'push', 'true')


export const bot = new TelegramBot(botToken, {
  polling: {
    interval: 100,
    autoStart: true
  }
});




// messages
bot.on("message", async (msg) => {
  let db, users
  let chat_id = msg.chat.id
  let name = msg.chat?.first_name || msg.chat?.last_name || msg.chat?.username.toLowerCase()
  let text = msg.text.trim()


  switch (text) {
    case "/start":

      // add user to database first create DataBase or comment next string
       await createUser(msg)

      deleteMessage(chat_id, msg.message_id)
      bot.sendMessage(chat_id, `Привет WORLD!`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "НАСТРОЙКИ",
                callback_data: "/setting"
              },
            ],
            [
              {
                text: "Закрыть",
                callback_data: "/exit"
              },
            ],
          ]
        }
      })
      break

    case "/learn":
      console.log(1);
      break

    default:

      if (await getUserData(chat_id, 'input_mode') == '1') {
        console.log('input_mode');
      }
      break
  }

});


// callback
bot.on('callback_query', async query => {
  // bot.answerCallbackQuery(query.id, { text: '' })
  // let db, users
  let msg = query.message
  let name = msg.chat?.first_name || msg.chat?.last_name || msg.chat?.username.toLowerCase()
  let chat_id = msg.chat.id
  let data = query.data

  switch (data) {

    case "/test":
      // console.log(2);
      break

    case "/input_time":

      deleteMessage(chat_id, msg.message_id)
      updateUserData(chat_id, "input_mode", "1")
      bot.sendMessage(chat_id, `Введи время уведомлений \nв таком формате: 10:00`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Назад",
                callback_data: "/push_menu"
              },
            ],

          ]
        }
      })
      break





  }
})

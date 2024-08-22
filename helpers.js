
import { conn, botToken } from './config.js'
import { bot } from "./tatubot.js"
import fs from 'fs'
const __dirname = import.meta.dirname;

const capitalizeFirstLetter = (string) => {
    let out = string.charAt(0).toUpperCase() + string.slice(1);
    return out
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const userList = async (msg) => {
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

    let count = 0
    let tpl = `Список пользователей \nВсего: ${users.length}`

    users.forEach(user => {
        count++
        let name = user.user_name || user.chat_id
        tpl += `\n${count}. @${name}`
    });

    bot.sendMessage(msg.chat.id, tpl, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Закрыть",
                        callback_data: "/exit"
                    },
                ]
            ]
        }
    })
    deleteMessage(msg.chat.id, msg.message_id)
}



const shuffleArray = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

const getChatID = async (name) => {
    let db, item

    try {
        db = await conn()
    } catch (error) {
        console.log(error);
    }

    let query = `SELECT * FROM users WHERE users.user_name = '${name}'`

    try {
        item = await db.query(query)
        item = item[0]
    } catch (error) {
        console.log(error);
    }
    await db.end()
    return `${item['chat_id']}`.trim()
}


const getUserData = async (chat_id, value) => {
    let db, item

    try {
        db = await conn()
    } catch (error) {
        console.log(error);
    }

    let query = `SELECT ${value} FROM users WHERE users.chat_id = '${chat_id}'`

    try {
        item = await db.query(query)
        item = item[0]
    } catch (error) {
        console.log(error);
    }
    await db.end()
    return `${item[value]}`.trim()
}

const updateUserData = async (chat_id, key, value) => {
    let db

    try {
        db = await conn()
    } catch (error) {
        console.log(error);
    }

    let query = `UPDATE users SET ${key} = '${value}' WHERE users.chat_id = '${chat_id}';`

    try {
        await db.query(query)
    } catch (error) {
        console.log(error);
    }
    await db.end()
}

const createUser = async msg => {
    let chat_id = msg.chat.id
    let user_name = msg.chat?.username.toLowerCase()

    let db, users, userExist = false
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

    userExist = false

    users.forEach(user => {
        if (chat_id === +user.chat_id) userExist = true
    })

    if (!userExist) {
        let query = `INSERT INTO users(chat_id, user_name, mode, push, push_time, level, last_word, count, record, timeout, wallet, input_mode, frase_theme ) VALUES ('${chat_id}', '${user_name}', 'en' ,'true', '10:00', '0', '', '0', '0', '20', '30', '0', 'travel')`
        await db.query(query)

    }
    await db.end()
}

const removeCloneArr = arr => {
    arr = [...new Set(arr)];
    return arr
}

//Delete message

const deleteMessage = async (chat_id, message_id) => {
    try {
        await bot.deleteMessage(chat_id, message_id)
        // bot.removeListener("callback_query")
    } catch (error) {
        console.log(error);
    }
}

// Create a bot that uses 'polling' to fetch new updates
const debug = async obj => {
    await bot.sendMessage(obj.chat.id, JSON.stringify(obj, null, 4))
}

export {
    createUser, updateUserData, debug,
    deleteMessage, getUserData, shuffleArray, userList,
    capitalizeFirstLetter, getChatID, removeCloneArr, getRandomInt

}
require('dotenv').config()
const express = require('express')
const router = require('./routers')
const app = express()
const cors = require('cors')
const redis = require('./helpers/redis')

let cron = require('node-cron');

cron.schedule('0 0 7 * * *', async () => {
    console.log('running a task every minute');

    let cache = await redis.get("cacheTokens")

    cache = JSON.parse(cache)

    const expoTokens = Object.values(cache)
    
    const message = {
        to: expoTokens,
        sound: 'default',
        title: 'Siram tanaman anda!',
        body: 'Jangan lupa menyiram tanaman anda pagi ini :',
    };
    
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
  }, {
    scheduled: true,
    timezone: "Asia/Jakarta"
  });

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/', router)


module.exports = app
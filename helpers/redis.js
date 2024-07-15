const Redis = require('ioredis');
const redis = new Redis({
    port: 13233,
    host: "redis-13233.c299.asia-northeast1-1.gce.redns.redis-cloud.com",
    username: "default",
    password: process.env.PASSWORD_REDIS
})

module.exports = redis
import { config } from 'dotenv'

const { env } = process
config()

const BOT_TOKEN: string = env.TOKEN as string
const GPT_SECRET: string = env.CHAT_GPT_KEY as string
const SERVER_URL: string = env.SERVER_URL as string
const PORT: string = env.PORT as string
const WEBHOOK_URI = `/webhook/${BOT_TOKEN}`
const WEBHOOK_URL: string = SERVER_URL+WEBHOOK_URI
const MAX_GPT_TOKENS_PER_USER: number = parseInt(env.MAX_GPT_TOKENS_PER_USER || '1200')

export {
    BOT_TOKEN,
    GPT_SECRET,
    SERVER_URL,
    PORT,
    WEBHOOK_URI,
    WEBHOOK_URL,
    MAX_GPT_TOKENS_PER_USER,
}
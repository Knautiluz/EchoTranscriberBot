import { config } from 'dotenv'

const { env } = process
config()

const BOT_TOKEN: string = env.TELEGRAM_TOKEN as string
const GPT_SECRET: string = env.CHAT_GPT_KEY as string
const SERVER_URL: string = env.SERVER_URL as string
const PORT: string = env.PORT as string
const WEBHOOK_URI = `/webhook/${BOT_TOKEN}`
const WEBHOOK_URL: string = SERVER_URL+WEBHOOK_URI
const MAX_GPT_TOKENS_PER_USER: number = parseInt(env.MAX_GPT_TOKENS_PER_USER || '1200')
const ALLOWED_GROUP_IDS: string[] = env.ALLOWED_GROUP_IDS?.split('|') || []
const WHISPER_MUST_KNOW_TERMS_PROMPT: string = env.WHISPER_MUST_KNOW_TERMS_PROMPT as string
const TRANSCRIPTION_METHOD: string = env.TRANSCRIPTION_METHOD as string
const AI_INSTRUCTIONS: string = env.AI_INSTRUCTIONS as string

export {
    BOT_TOKEN,
    GPT_SECRET,
    SERVER_URL,
    PORT,
    WEBHOOK_URI,
    WEBHOOK_URL,
    MAX_GPT_TOKENS_PER_USER,
    ALLOWED_GROUP_IDS,
    WHISPER_MUST_KNOW_TERMS_PROMPT,
    TRANSCRIPTION_METHOD,
    AI_INSTRUCTIONS
}
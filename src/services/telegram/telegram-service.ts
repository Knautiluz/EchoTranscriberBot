import axios from 'axios'
import { BOT_TOKEN, WEBHOOK_URL } from '../../config/environment'
import { path } from '@ffmpeg-installer/ffmpeg'
import ffmpeg from 'fluent-ffmpeg'
import { Readable } from 'stream'

ffmpeg.setFfmpegPath(path)

export default class TelegramBotAPI {

    private TELEGRAM_API: string
    private TELEGRAM_FILE_API: string

    constructor() {
        this.TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`
        this.TELEGRAM_FILE_API = `https://api.telegram.org/file/bot${BOT_TOKEN}`
        this.startWebhook(WEBHOOK_URL)
    }

    private startWebhook = (webhookUrl: string) => {
        console.log(`Staring Telegram Webhook in following url ${webhookUrl}`)
        axios.get(`${this.TELEGRAM_API}/setWebhook?url=${webhookUrl}`)
        .then((response) => {
            console.log('Telegram module is now online', `[${response.data.description}]`)
        })
        .catch(error => {
            console.log(`We got following error in KnautiluzBot API SetWebhook: ${error}`)
            console.log('Telegram module is now offline')
        })
    }

    public sendTypingEvent = async (chat_id: number) => {
        await axios.post(`${this.TELEGRAM_API}/sendChatAction`, {
            chat_id,
            action: 'typing'
        })

    }

    public sendMessage = async (chat_id: number, message_id, text: string, parse_mode: 'Markdown' | 'HTML' | undefined, supress_typing_event: boolean) => {
        if(!supress_typing_event)
            await this.sendTypingEvent(chat_id)
        await axios.post(`${this.TELEGRAM_API}/sendMessage`, {
            chat_id,
            text,
            parse_mode,
            disable_notification: true,
            reply_to_message_id: message_id
        })
    }

    public sendAudio = async (chat_id: number, audio: Buffer) => {
        await axios.post(`${this.TELEGRAM_API}/sendAudio`, {
            chat_id,
            audio,
            disable_notification: true
        })
    }

    public getUserAudio = async (file_id: string, file_name: string, mime_type: string) => {     
        const { data } = await axios.get(`${this.TELEGRAM_API}/getFile`, {
            params: {
                file_id
            }
        })
        const file = { path: data.result.file_path, mime_type }

        const stream = await axios.get(`${this.TELEGRAM_FILE_API}/${file.path}`, {
            responseType: 'arraybuffer',
            params: {
                file_id
            }
        })
        const readable = Readable.from(Buffer.from(stream.data))
        await this.audioConverter(file_name, readable)
        return `./audios/${file_name}.mp3`
    }

    private audioConverter(filename: string, audio: Readable) {
        return new Promise((resolve, reject) => {
            ffmpeg(audio)
            .toFormat('mp3')
                .save(`./audios/${filename}.mp3`)
                    .on('end', () => resolve('conversion complete'))
                        .on('error', (error) => reject(error.message))
        })
    }
}
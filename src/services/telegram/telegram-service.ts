import axios from 'axios'
import { createAudioFile } from '../../utils/audioUtils'
import { TelegramFileBufferResponse, TelegramFileResponse } from '../../types/types'
import { BOT_TOKEN, WEBHOOK_URL } from '../../config/environment'

export default class TelegramBotAPI {

    private TELEGRAM_API: string
    private TELEGRAM_FILE_API: string

    constructor() {
        this.TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`
        this.TELEGRAM_FILE_API = `https://api.telegram.org/file/bot${BOT_TOKEN}`
        this.startWebhook(WEBHOOK_URL)
    }

    private startWebhook = (webhookUrl: string) => {
        console.log(`[Staring Telegram Webhook in following url ${webhookUrl}]`)
        axios.get(`${this.TELEGRAM_API}/setWebhook?url=${webhookUrl}`)
        .then((response) => {
            console.log('[Telegram module is now online]', `[${response.data.description}]`)
        })
        .catch(error => {
            console.error(`Erro ao configurar Echo Bot API SetWebhook: ${error}`)
            console.log('[Telegram module is now offline]')
        })
    }

    public sendTypingEvent = async (chat_id: number) => {
        await axios.post(`${this.TELEGRAM_API}/sendChatAction`, {
            chat_id,
            action: 'typing'
        })

    }

    public sendMessage = async (chat_id: number, text: string, parse_mode: 'Markdown' | 'HTML' | undefined, supress_typing_event: boolean) => {
        if(!supress_typing_event)
            await this.sendTypingEvent(chat_id)
        await axios.post(`${this.TELEGRAM_API}/sendMessage`, {
            chat_id,
            text,
            parse_mode,
            disable_notification: true,
        })
    }

    public sendReplyMessage = async (chat_id: number, message_id: number, text: string, parse_mode: 'Markdown' | 'HTML' | undefined, supress_typing_event: boolean) => {
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

    public getFilePath = async (file_id: string, file_name: string) => {     
        const { data: file }: TelegramFileResponse = await axios.get(`${this.TELEGRAM_API}/getFile`, {
            params: {
                file_id
            }
        })

        const { data: buffer }: TelegramFileBufferResponse = await axios.get(`${this.TELEGRAM_FILE_API}/${file.result.file_path}`, {
            responseType: 'arraybuffer',
            params: {
                file_id
            }
        })
        return await createAudioFile(file_name, buffer)
    }
}
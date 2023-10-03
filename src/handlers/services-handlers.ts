import GPTBotAPI from '../services/open-ai/gpt-service'
import TelegramBotAPI from '../services/telegram/telegram-service'

const telegram = new TelegramBotAPI()
const gpt = new GPTBotAPI()

export const audioHandler = async (chat_id: number, message_id: number, file_id: string, file_name: string, mime_type: string) => {
    try {
        console.log('Iniciando transcrição do áudio para texto...')
        await telegram.sendTypingEvent(chat_id)
        const file_path = await telegram.getUserAudio(file_id, file_name, mime_type)
        telegram.sendTypingEvent(chat_id)
        const message = await gpt.handleAudioTranscription(file_path)
        console.log('Transcrição gerada com sucesso!')
        telegram.sendTypingEvent(chat_id)
        telegram.sendReplyMessage(chat_id, message_id, `*Transcrição*:\n\n**${message}**`, 'Markdown', false)
        console.log('Transcrição enviada!')
    } catch(error: unknown) {
        const { message } = error as Error
        console.error(`Falha ao tentar transcrever: ${message}`)
        telegram.sendReplyMessage(chat_id, message_id, 'Não foi possível transcrever o áudio.', undefined, false)
    }
}
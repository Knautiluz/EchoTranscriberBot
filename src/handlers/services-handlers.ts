import GPTBotAPI from '../services/open-ai/gpt-service'
import TelegramBotAPI from '../services/telegram/telegram-service'

const telegram = new TelegramBotAPI()
const gpt = new GPTBotAPI()

export const audioHandler = async (chat_id: number, message_id: number, file_id: string, file_name: string, mime_type: string) => {
    await telegram.sendTypingEvent(chat_id)
    const file_path = await telegram.getUserAudio(file_id, file_name, mime_type)
    telegram.sendTypingEvent(chat_id)
    const message = await gpt.handleAudioTranscription(file_path)
    telegram.sendTypingEvent(chat_id)
    telegram.sendMessage(chat_id, message_id, `*Transcrição*:\n\n**${message}**`, 'Markdown', false)
}
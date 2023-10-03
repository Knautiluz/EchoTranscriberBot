import { createReadStream, unlink } from 'fs'
import { Configuration, OpenAIApi } from 'openai'
import { GPT_SECRET, MAX_GPT_TOKENS_PER_USER } from '../../config/environment'

export default class GPTBotAPI {

    private ai: OpenAIApi

    constructor() {
        
        const configuration = new Configuration({
            apiKey: GPT_SECRET,
        })

        this.ai = new OpenAIApi(configuration)
        console.log(`MAX GPT_TOKEN_PER_USER: ${MAX_GPT_TOKENS_PER_USER}`)
        console.log('OpenAI module is now available')
    }

    public handleAudioTranscription = async (file_path: string) => {
        const audioTranscriptionCompletion = await this.ai.createTranscription(createReadStream(file_path) as unknown as File, 'whisper-1', 'Dez Parque, Dez Parque das Bandeiras, AVCB, síndico')
        unlink(file_path, (err) => console.log(err || 'cleaning old file from disk...'))
        const transcription = audioTranscriptionCompletion.data.text
        return transcription
    }
}
import { Configuration, OpenAIApi } from 'openai'
import { GPT_SECRET, MAX_GPT_TOKENS_PER_USER, WHISPER_MUST_KNOW_TERMS_PROMPT } from '../../config/environment'
import { deleteAudioFile, readAudioFile } from '../../utils/audioUtils'

export default class GPTBotAPI {

    private ai: OpenAIApi

    constructor() {
        
        const configuration = new Configuration({
            apiKey: GPT_SECRET,
        })

        this.ai = new OpenAIApi(configuration)
        console.log(`[MAX GPT_TOKEN_PER_USER: ${MAX_GPT_TOKENS_PER_USER}]`)
        console.log('[OpenAI module is now available]')
    }

    public handleAudioTranscription = async (file_path: string) => {
        const audio = readAudioFile(file_path)
        const audioTranscriptionCompletion = await this.ai.createTranscription(audio, 'whisper-1', WHISPER_MUST_KNOW_TERMS_PROMPT)
        deleteAudioFile(file_path)
        const transcription = audioTranscriptionCompletion.data.text
            .replace(/\.\s/g, '.\n\n')
                .split('\n\n ')
                    .join('\n\n')
        return transcription
    }
}
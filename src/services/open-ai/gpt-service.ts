import { Configuration, OpenAIApi } from 'openai'
import { deleteAudioFile, readAudioFile } from '../../utils/audioUtils'
import { GPT_SECRET, MAX_GPT_TOKENS_PER_USER, WHISPER_MUST_KNOW_TERMS_PROMPT, TRANSCRIPTION_METHOD, AI_INSTRUCTIONS } from '../../config/environment'

const PERIOD_REGEX = /\.\s/g
const DOUBLE_LINE_BREAKS = '\n\n'
const DOT_DOUBLE_LINE_BREAKS = '.\n\n'
const GPT_AUDIO_MODEL = 'whisper-1'

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
        console.log(`[Termos aprimorados: ${WHISPER_MUST_KNOW_TERMS_PROMPT}]`)
        const audioTranscriptionCompletion = await this.ai.createTranscription(audio, GPT_AUDIO_MODEL, WHISPER_MUST_KNOW_TERMS_PROMPT)
        deleteAudioFile(file_path)
        const transcription = this.handleTranscriptionByMethod(audioTranscriptionCompletion.data.text)
        return transcription
    }

    private handleTranscriptionByMethod = async (transcription: string) => {
        switch(TRANSCRIPTION_METHOD) {
            case 'AI_POST_PROCESSED':
                return await this.postProcessTranscription(transcription)
            default:
                return transcription
                .replace(PERIOD_REGEX, DOT_DOUBLE_LINE_BREAKS)
                    .split(DOUBLE_LINE_BREAKS)
                        .join(DOUBLE_LINE_BREAKS)
        }
    }

    private postProcessTranscription = async (transcription: string) => {
        const gptResponse = await this.ai.createChatCompletion({
            model: 'gpt-3.5-turbo-1106',
            messages: [
                { 
                    role: 'system',
                    content: AI_INSTRUCTIONS
                },
                {
                    role: 'user',
                    content: transcription
                }
            ]
        })
        return `${gptResponse.data.choices[0].message?.content}\n\nBETA: ___transcrição aprimorada com inteligência articifial, pode haver discrepâncias com o texto original___`
    }
}
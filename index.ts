import express, { NextFunction, Request, Response } from 'express'
import { WEBHOOK_URI, PORT } from './src/config/environment'
import { audioHandler, commandHandler }  from './src/handlers/services-handlers'
import { ALLOWED_GROUP_IDS } from './src/config/environment'
import { TelegramBodyEnvelope } from './src/types/types'

const app = express()

app.use(express.json())

const commandRequest = async (req: Request, res: Response, next: NextFunction) => {
    
    const body: TelegramBodyEnvelope = req.body
    
    if(!body.message)
        return next()

    const { text, chat } = body.message
    
    if(!text?.startsWith('/'))
        return next()

    const chat_id = chat.id    
    await commandHandler(chat_id, text as string)
    return res.send()
}

const audioRequest = async (req: Request, res: Response, next: NextFunction) => {
    
    const body: TelegramBodyEnvelope = req.body
    
    if(!body.message)
        return next()

    const { voice, chat, message_id } = body.message
    
    if(voice) {
        
        const chat_id: number = chat.id

        if(ALLOWED_GROUP_IDS.includes(`${chat_id}`)) {
            const file_id: string = voice.file_id
            const msg_id: number = message_id
            const file_unique_id: string = voice.file_unique_id
            await audioHandler(chat_id, msg_id, file_id, file_unique_id)
            return res.send()
        } else {
            console.log(`[Grupo de ID ${chat_id} não tem permissão para usar o bot]`)
            return next()
        }

    }
    return next()
}

const othersRequest = async (_req: Request, res: Response) => {
    return res.status(202).send()
}   

app.post(
    WEBHOOK_URI,
    commandRequest,
    audioRequest,
    othersRequest
)

app.get('/healthcheck', async (_req: Request, res: Response) => {
    res.status(200).send('OK')
})

app.listen(PORT || 8080, async () => {
    console.log('Running on port', PORT || 8080)
})
import express, { NextFunction, Request, Response } from 'express'
import { WEBHOOK_URI, PORT } from './src/config/environment'
import { audioHandler }  from './src/handlers/services-handlers'

const app = express()

app.use(express.json())

const audioRequest = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.body.message)
        return next()

    const { voice, chat, message_id } = req.body.message
    
    if(voice) {
        const chat_id: number = chat.id
        const file_id: string = voice.file_id
        const msg_id: number = message_id
        const file_unique_id: string = voice.file_unique_id
        const mime_type: string = voice.mime_type
        await audioHandler(chat_id, msg_id, file_id, file_unique_id, mime_type)
    }
    return next()
}

const unknownRequest = async (req: Request, res: Response) => {
    return res.status(200).send()
}   

app.post(
    WEBHOOK_URI,
    audioRequest,
    unknownRequest
)

app.get('/healthcheck', async (_req: Request, res: Response) => {
    res.status(200).send('OK')
})

app.listen(PORT || 8080, async () => {
    console.log('Running on port', PORT || 8080)
})
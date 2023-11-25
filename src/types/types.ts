type Voice = {
    duration: number
    mime_type: string
    file_id: string
    file_unique_id: string
    file_size: number
}

type Chat = {
    all_members_are_administrators?: boolean
    id: number
    title: string
    type: 'group' | 'supergroup' | 'private'
}

type Member = {
    id: number,
    is_bot: boolean
    first_name?: string
    username?: string
    language_code?: string
}

type Entity = {
    length: number
    offset: number
    type: 'bot_command'
}

type Image = {
    file_id: string
    file_size: number
    file_unique_id: string
    height: number
    width: number
}

type Message = {
    voice?: Voice
    chat: Chat
    date: number
    forward_date?: number
    forward_from?: Member
    from: Member
    entities?: Entity[]
    photo?: Image[]
    message_id: number
    text?: string
}

export type TelegramBodyEnvelope = {
    message: Message
    update_id: number
}

export type TelegramFileResponse = {
    data: {
        result: {
            file_path: string
        }
    }
}

export type TelegramFileBufferResponse = {
    data: ArrayBuffer
}
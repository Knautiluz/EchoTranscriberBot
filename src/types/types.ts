type Voice = {
    duration: number
    file_id: string
    file_size: number
    file_unique_id: string
    mime_type: string
}

type Chat = {
    all_members_are_administrators: boolean | undefined
    id: number
    title: string
    type: 'group' | 'supergroup' | 'private'
}

type Member = {
    first_name: string | undefined
    id: number,
    is_bot: boolean
    language_code: string
    username: string | undefined
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
    voice: Voice | undefined
    chat: Chat
    date: number
    entities: Entity[] | undefined
    from: Member
    photo: Image[] | undefined
    message_id: number
    text: string | undefined
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
import { createReadStream, unlink } from 'fs'
import { Readable } from 'stream'
import ffmpeg from 'fluent-ffmpeg'
import { path } from '@ffmpeg-installer/ffmpeg'

ffmpeg.setFfmpegPath(path)

const readAudioFile = (file_path: string): File => {
    console.log('[Iniciando leitura de áudio gravado temporáriamente]')
    return createReadStream(file_path) as unknown as File
}

const createAudioFile = async (file_name: string, buffer: ArrayBuffer): Promise<void> => {
    console.log('[Iniciando gravação temporária de áudio]')
    const readable = Readable.from(Buffer.from(buffer))
    return new Promise((resolve, reject) => {
        ffmpeg(readable)
        .toFormat('mp3')
            .save(`./audios/${file_name}.mp3`)
                .on('end', () => resolve(console.log('[Áudio gravado temporáriamente]')))
                    .on('error', (error) => reject(error.message))
    })
}

const deleteAudioFile = (file_path: string): void => {
    console.log('[Iniciando deleção de áudio temporário]')
    return unlink(file_path, (err) => console.log(err || '[Arquivo de áudio processado deletado]'))
}

export { createAudioFile, readAudioFile, deleteAudioFile }
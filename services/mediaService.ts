import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async (): Promise<FFmpeg> => {
    if (ffmpeg && ffmpeg.loaded) {
        return ffmpeg;
    }
    ffmpeg = new FFmpeg();
    ffmpeg.on('log', ({ message }) => {
        // This log is very helpful for debugging FFmpeg issues
        console.log('[FFmpeg log]', message);
    });
    
    const coreURL = 'https://aistudiocdn.com/@ffmpeg/core@^0.12.6/dist/esm/ffmpeg-core.js';
    const wasmURL = 'https://aistudiocdn.com/@ffmpeg/core@^0.12.6/dist/esm/ffmpeg-core.wasm';

    await ffmpeg.load({ coreURL, wasmURL });
    return ffmpeg;
};

export const mixAudioAndVideo = async (videoUrl: string, audioUrl: string): Promise<string> => {
    const ffmpegInstance = await loadFFmpeg();

    const videoFileName = 'input.mp4';
    const audioFileName = 'input.mp3';
    const outputFileName = 'output.mp4';

    // Fetch files from URLs and write them to FFmpeg's virtual file system
    await Promise.all([
        fetchFile(videoUrl).then(data => ffmpegInstance.writeFile(videoFileName, data)),
        fetchFile(audioUrl).then(data => ffmpegInstance.writeFile(audioFileName, data))
    ]);

    // Run the FFmpeg command to merge the video and audio
    // -c:v copy: Copies the video stream without re-encoding (very fast).
    // -c:a aac: Encodes the audio to AAC, a widely compatible format.
    // -shortest: Ensures the output duration matches the shortest input (usually the video).
    await ffmpegInstance.exec([
        '-i', videoFileName,
        '-i', audioFileName,
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-shortest',
        outputFileName
    ]);

    // Read the resulting file from the virtual file system
    const outputData = await ffmpegInstance.readFile(outputFileName);

    // Create a blob URL from the output data so it can be used in a <video> tag
    const outputBlob = new Blob([(outputData as Uint8Array).buffer], { type: 'video/mp4' });
    const outputUrl = URL.createObjectURL(outputBlob);

    return outputUrl;
};

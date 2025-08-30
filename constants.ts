import { Inspiration, ViralShort, EditTemplate, MusicTrack } from "./types";

export const VIDEO_LOADING_MESSAGES: string[] = [
  "Warming up the digital canvas...",
  "Teaching pixels to dance...",
  "Assembling cinematic atoms...",
  "Directing a symphony of light and shadow...",
  "Rendering your vision, frame by frame...",
  "This can take a few minutes, the magic is worth it!",
  "Finalizing the masterpiece..."
];

export const IMAGE_STYLES: string[] = [
    'None',
    'Photorealistic',
    'Anime',
    'Watercolor',
    'Cyberpunk',
    'Fantasy',
    'Vintage',
    'Minimalist',
];

export const QUALITIES: string[] = ['Standard', 'HD'];

export const IMAGE_TEMPLATES_9_16: Inspiration[] = [
  {
    prompt: "A stylish woman in a red beret walking down a Parisian street, cinematic, 9:16 aspect ratio",
    thumbnailUrl: "https://images.pexels.com/photos/1381556/pexels-photo-1381556.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    prompt: "A close-up of a chameleon on a branch with a vibrant, colorful background, detailed, macro photography, 9:16 aspect ratio",
    thumbnailUrl: "https://images.pexels.com/photos/2255459/pexels-photo-2255459.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    prompt: "A lone hiker standing on a mountain peak looking at the sunrise, breathtaking view, fantasy art, 9:16 aspect ratio",
    thumbnailUrl: "https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    prompt: "An astronaut floating in space, with the Earth reflected in their helmet visor, photorealistic, 9:16 aspect ratio",
    thumbnailUrl: "https://images.pexels.com/photos/586056/pexels-photo-586056.jpeg?auto=compress&cs=tinysrgb&w=300"
  },
  {
    prompt: "A neon sign that says 'Dream Big' in a dark alleyway, cyberpunk aesthetic, 9:16 aspect ratio",
    thumbnailUrl: "https://images.pexels.com/photos/1485807/pexels-photo-1485807.jpeg?auto=compress&cs=tinysrgb&w=300"
  }
];

export const VIDEO_TEMPLATES_9_16: ViralShort[] = [
  {
    prompt: "A vertical video of a person unboxing a new tech gadget, satisfying ASMR sounds, 9:16 aspect ratio",
    videoUrl: "https://player.vimeo.com/progressive_redirect/playback/915802425/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=1b8830841139556350718544a42823c914041b6c0e8a379133b1e3a79d9e4e6b"
  },
  {
    prompt: "A quick recipe video showing how to make a delicious coffee, fast-paced editing, 9:16 aspect ratio",
    videoUrl: "https://player.vimeo.com/progressive_redirect/playback/862734633/rendition/360p/file.mp4?loc=external&oauth2_token_id=57447761&signature=788876e534f54de59a883726a0c5c46e0861618a80164c4839845b597c276a1d"
  },
  {
    prompt: "A trending dance challenge video with a person in a cool outfit, vibrant background, 9:16 aspect ratio",
    videoUrl: "https://player.vimeo.com/progressive_redirect/playback/868725843/rendition/540p/file.mp4?loc=external&oauth2_token_id=57447761&signature=4e937d578641972b9442f4951152a5127632646d6545b74b9777174677fd56a6"
  },
  {
    prompt: "A 'day in the life' vlog-style video, quick cuts, aesthetic shots, 9:16 aspect ratio",
    videoUrl: "https://player.vimeo.com/progressive_redirect/playback/908866185/rendition/540p/file.mp4?loc=external&oauth2_token_id=57447761&signature=362a265696d744b207b1d98d0228d45112521c35c91837856b3b516091d29d11"
  }
];

export const EDIT_TEMPLATES: EditTemplate[] = [
  {
    prompt: "Change the background to a bustling Tokyo street at night with neon lights",
    beforeUrl: "https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&h=400",
    afterUrl: "https://images.pexels.com/photos/1705254/pexels-photo-1705254.jpeg?auto=compress&cs=tinysrgb&h=400"
  },
  {
    prompt: "Turn this portrait into a colorful pop art painting",
    beforeUrl: "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&h=400",
    afterUrl: "https://images.pexels.com/photos/1786433/pexels-photo-1786433.jpeg?auto=compress&cs=tinysrgb&h=400"
  },
  {
    prompt: "Add fantasy elements, like glowing magical tattoos",
    beforeUrl: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&h=400",
    afterUrl: "https://images.pexels.com/photos/9754433/pexels-photo-9754433.jpeg?auto=compress&cs=tinysrgb&h=400"
  },
  {
    prompt: "Make it look like a vintage photograph from the 1920s",
    beforeUrl: "https://images.pexels.com/photos/2216607/pexels-photo-2216607.jpeg?auto=compress&cs=tinysrgb&h=400",
    afterUrl: "https://images.pexels.com/photos/3806232/pexels-photo-3806232.jpeg?auto=compress&cs=tinysrgb&h=400"
  }
];


export const VIDEO_PROMPT_IDEAS: string[] = [
  "An astronaut riding a horse on Mars",
  "A time-lapse of a flower blooming",
  "A cat DJing at a party",
  "Ocean waves crashing in slow motion",
  "A magical library with flying books",
  "A chef preparing a gourmet meal with flair"
];

export const IMAGE_PROMPT_IDEAS: string[] = [
  "A crystal clear lake reflecting a starry night sky",
  "A majestic lion with a crown, photorealistic",
  "A cozy cabin in a snowy forest, watercolor style",
  "A robot tending to a garden of glowing flowers",
  "A portrait of a wise old woman, detailed pencil sketch",
  "A cyberpunk cityscape from a low angle view"
];

export const MUSIC_TRACKS: MusicTrack[] = [
  { name: 'None', url: '' },
  { name: 'Upbeat Pop', url: 'https://cdn.pixabay.com/audio/2023/09/26/audio_49e343ffb4.mp3' },
  { name: 'Chill Lofi', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_14343163a8.mp3' },
  { name: 'Cinematic', url: 'https://cdn.pixabay.com/audio/2024/02/09/audio_365928d157.mp3' },
  { name: 'Acoustic Folk', url: 'https://cdn.pixabay.com/audio/2022/08/03/audio_583a292a83.mp3' }
];
export enum Tab {
  Video = 'Video',
  Photo = 'Photo',
  ImageToVideo = 'ImageToVideo',
  EditImage = 'EditImage',
  EditVideo = 'EditVideo',
  AIChat = 'AIChat',
}

export type AspectRatio = '16:9' | '1:1' | '9:16';
export type Quality = 'Standard' | 'HD';

// A single part of a message, can be text or an image
export type MessagePart = {
  text?: string;
  // Store the image as a data URL for easy rendering in the UI
  imageData?: {
    url: string; // The data URL string
    mimeType: string;
  };
};

// A full message in the chat history, composed of one or more parts
export type ChatMessage = {
  role: 'user' | 'model';
  parts: MessagePart[];
};

export type Inspiration = {
  prompt: string;
  thumbnailUrl: string;
};

export type ViralShort = {
  prompt: string;
  videoUrl: string;
};

export type EditTemplate = {
  prompt: string;
  beforeUrl: string;
  afterUrl: string;
};

export type MusicTrack = {
  name: string;
  url: string;
};

export type User = {
    name: string;
    email: string;
};
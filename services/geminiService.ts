// FIX: Add DOM library reference to resolve 'Image', 'document', and 'FileReader' type errors.
/// <reference lib="dom" />

import { GoogleGenAI, Modality, Chat, Part } from "@google/genai";
import { AspectRatio, Quality } from "../types";

// New helper function to convert a File object to a Gemini API Part
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedData = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
  });
  return {
      inlineData: {
          data: base64EncodedData,
          mimeType: file.type,
      },
  };
};

// New helper function to add a watermark to an image using canvas
const addWatermarkToImage = (base64Url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Prepare watermark text
      const watermarkText = 'YKJ-Ai';
      const margin = 20;
      // Dynamically calculate font size based on image dimensions
      const fontSize = Math.max(18, Math.min(img.width, img.height) / 40);
      
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // Semi-transparent white
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      
      // Add a subtle shadow for better visibility across different backgrounds
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 5;

      // Draw the watermark in the bottom-right corner
      ctx.fillText(watermarkText, canvas.width - margin, canvas.height - margin);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for watermarking'));
    };
    img.src = base64Url;
  });
};


const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVideo = async (prompt: string, imageFile: File | undefined, aspectRatio: AspectRatio, quality: Quality): Promise<string> => {
    let image;
    if (imageFile) {
        const base64EncodedData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
            reader.readAsDataURL(imageFile);
        });
        image = {
            imageBytes: base64EncodedData,
            mimeType: imageFile.type,
        };
    }
    
    let operation = await ai.models.generateVideos({
        model: 'veo-2.0-generate-001',
        prompt,
        image,
        config: {
            numberOfVideos: 1,
            aspectRatio: aspectRatio,
            ...(quality === 'HD' && { quality: 'hd' }),
        }
    });

    // Poll for the result, as video generation is asynchronous
    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds between checks
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation failed: No download link found.");
    }

    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        throw new Error(`Failed to download video: ${response.statusText}`);
    }

    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

export const generateImage = async (prompt: string, aspectRatio: AspectRatio, quality: Quality): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: aspectRatio,
          ...(quality === 'HD' && { quality: 'hd' }),
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("Image generation failed: No image returned.");
    }
    
    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;

    // Add watermark before returning
    const watermarkedImageUrl = await addWatermarkToImage(imageUrl);
    return watermarkedImageUrl;
};

export const editImage = async (prompt: string, imageFile: File): Promise<string> => {
    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const imageOutputPart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (!imageOutputPart?.inlineData) {
        const textResponse = response.text?.trim();
        if (textResponse) {
             throw new Error(`Image editing failed: ${textResponse}`);
        }
        throw new Error("Image editing failed: The model did not return an image.");
    }

    const base64ImageBytes: string = imageOutputPart.inlineData.data;
    const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
    
    // Add watermark before returning
    const watermarkedImageUrl = await addWatermarkToImage(imageUrl);
    return watermarkedImageUrl;
};

export const editVideo = async (prompt: string, videoFile: File): Promise<string> => {
    // NOTE: The current generation of models (e.g., Veo) does not support video-to-video editing.
    // This is a placeholder function to demonstrate where the API call would go.
    // We will simulate a delay and then throw an informative error.
    await new Promise(resolve => setTimeout(resolve, 1000));
    throw new Error("Video editing functionality is not yet supported by the available AI models. This feature is for demonstration purposes.");
};

const CHAT_SYSTEM_INSTRUCTION = "You are AI-CI, an expert creative assistant. Your goal is to help users brainstorm and refine ideas for video and photo content. Provide creative, inspiring, and actionable suggestions.";

export const startChatSession = (): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: CHAT_SYSTEM_INSTRUCTION,
        },
    });
    return chat;
};

export const sendMessageToChatStream = async (chat: Chat, message: string, file?: File) => {
    const parts: Part[] = [{ text: message }];
    if (file) {
        const imagePart = await fileToGenerativePart(file);
        parts.push(imagePart);
    }
    // FIX: The parameter for `sendMessageStream` should be an object with a `message` property,
    // which can contain an array of parts for multimodal input.
    return chat.sendMessageStream({ message: parts });
};
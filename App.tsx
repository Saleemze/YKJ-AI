// FIX: Add DOM library reference to resolve 'document' and other DOM API type errors.
/// <reference lib="dom" />

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Tab, AspectRatio, Quality, ChatMessage, MessagePart } from './types';
import { generateVideo, generateImage, editVideo, editImage, startChatSession, sendMessageToChatStream } from './services/geminiService';
import { mixAudioAndVideo } from './services/mediaService';
import { Chat } from '@google/genai';
import { useAuth } from './contexts/AuthContext';
import Auth from './components/Auth';
import Header from './components/Header';
import TabSelector from './components/TabSelector';
import PromptInput from './components/PromptInput';
import LoadingIndicator from './components/LoadingIndicator';
import VideoResult from './components/VideoResult';
import ImageResult from './components/ImageResult';
import AspectRatioSelector from './components/AspectRatioSelector';
import StyleSelector from './components/StyleSelector';
import QualitySelector from './components/QualitySelector';
import VideoPreviewDisplay from './components/VideoPreviewDisplay';
import ImagePreviewDisplay from './components/ImagePreviewDisplay';
import ChatInterface from './components/ChatInterface';
import VideoTemplateGallery from './components/VideoTemplateGallery';
import ImageTemplateGallery from './components/ImageTemplateGallery';
import PromptIdeas from './components/PromptIdeas';
import EditInspirationGallery from './components/EditInspirationGallery';
import ImageFilterSelector from './components/ImageFilterSelector';
import MusicSelector from './components/MusicSelector';
import { VIDEO_PROMPT_IDEAS, IMAGE_PROMPT_IDEAS } from './constants';

const MainApp: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Video);
    const [prompt, setPrompt] = useState<string>('');
    // For video generation
    const [imageFile, setImageFile] = useState<File | null>(null); 
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [musicTrackUrl, setMusicTrackUrl] = useState<string>('');
    // For Image to Video
    const [imageToVideoFile, setImageToVideoFile] = useState<File | null>(null);
    const [imageToVideoPreview, setImageToVideoPreview] = useState<string | null>(null);
    // For Edit Video
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    // For Edit Image
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
    const [imageFilter, setImageFilter] = useState<string>('none');

    const [loading, setLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
    const [imageStyle, setImageStyle] = useState<string>('None');
    const [quality, setQuality] = useState<Quality>('Standard');

    // Chat state
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
    const [chatAttachment, setChatAttachment] = useState<File | null>(null);
    const [chatAttachmentPreview, setChatAttachmentPreview] = useState<string | null>(null);
    const chatInitialized = useRef(false);
    const promptInputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (activeTab === Tab.AIChat && !chatInitialized.current) {
            const session = startChatSession();
            setChatSession(session);
            setChatHistory([{
                role: 'model',
                parts: [{ text: "Hello! I'm AI-CI, your creative partner. How can I help you brainstorm today? You can also ask me to create an image for you using the `/generate` command!" }]
            }]);
            chatInitialized.current = true;
        }
    }, [activeTab]);

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
        setError(null);
        setVideoUrl(null);
        setImageUrl(null);
        setPrompt('');
        clearAllFiles();
        
        if (tab !== Tab.Photo) setImageStyle('None');
        if (tab !== Tab.Video && tab !== Tab.ImageToVideo) setMusicTrackUrl('');
        
        if (tab === Tab.EditVideo) {
            setAspectRatio('1:1');
        } else if (tab === Tab.EditImage) {
            setAspectRatio('9:16');
        } else {
            setAspectRatio('16:9');
        }
    };
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
            clearAllFiles();
            return;
        }

        if (activeTab === Tab.Video && file.type.startsWith('image/')) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else if (activeTab === Tab.ImageToVideo && file.type.startsWith('image/')) {
            setImageToVideoFile(file);
            setImageToVideoPreview(URL.createObjectURL(file));
        } else if (activeTab === Tab.EditVideo && file.type.startsWith('video/')) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        } else if (activeTab === Tab.EditImage && file.type.startsWith('image/')) {
            setEditImageFile(file);
            setEditImagePreview(URL.createObjectURL(file));
        } else {
            clearAllFiles();
        }
    };
    
    const clearAllFiles = () => {
        // Revoke URLs to prevent memory leaks
        if(imagePreview) URL.revokeObjectURL(imagePreview);
        if(videoPreview) URL.revokeObjectURL(videoPreview);
        if(editImagePreview) URL.revokeObjectURL(editImagePreview);
        if(imageToVideoPreview) URL.revokeObjectURL(imageToVideoPreview);

        setImageFile(null);
        setImagePreview(null);
        setVideoFile(null);
        setVideoPreview(null);
        setEditImageFile(null);
        setEditImagePreview(null);
        setImageToVideoFile(null);
        setImageToVideoPreview(null);
        setImageFilter('none');
        
        // Reset file input fields
        const imageUpload = document.getElementById('image-upload') as HTMLInputElement;
        const videoUpload = document.getElementById('video-upload') as HTMLInputElement;
        if(imageUpload) imageUpload.value = '';
        if(videoUpload) videoUpload.value = '';
    }
    
    const handleGenerate = useCallback(async () => {
        if (!prompt.trim() || loading) return;
        if (activeTab === Tab.ImageToVideo && !imageToVideoFile) {
            setError("Please upload an image to generate a video.");
            return;
        }
        if (activeTab === Tab.EditVideo && !videoFile) {
            setError("Please upload a video to edit.");
            return;
        }
        if (activeTab === Tab.EditImage && !editImageFile) {
            setError("Please upload an image to edit.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setVideoUrl(null);
        setImageUrl(null);

        try {
            if (activeTab === Tab.Video) {
                let url = await generateVideo(prompt, imageFile || undefined, aspectRatio, quality);
                
                if (musicTrackUrl) {
                    setLoadingMessage("Mixing in audio track...");
                    const finalVideoUrl = await mixAudioAndVideo(url, musicTrackUrl);
                    URL.revokeObjectURL(url); // Clean up the original silent video blob
                    url = finalVideoUrl;
                }
                
                setVideoUrl(url);
            } else if (activeTab === Tab.Photo) {
                const finalPrompt = imageStyle !== 'None'
                    ? `${prompt}, in a ${imageStyle.toLowerCase()} style`
                    : prompt;
                const url = await generateImage(finalPrompt, aspectRatio, quality);
                setImageUrl(url);
            } else if (activeTab === Tab.ImageToVideo) {
                let url = await generateVideo(prompt, imageToVideoFile as File, aspectRatio, quality);
                
                if (musicTrackUrl) {
                    setLoadingMessage("Mixing in audio track...");
                    const finalVideoUrl = await mixAudioAndVideo(url, musicTrackUrl);
                    URL.revokeObjectURL(url);
                    url = finalVideoUrl;
                }
                
                setVideoUrl(url);
            } else if (activeTab === Tab.EditImage) {
                const finalEditPrompt = `${prompt}, and please ensure the final image has a ${aspectRatio} aspect ratio.`;
                const url = await editImage(finalEditPrompt, editImageFile as File);
                setImageUrl(url);
            } else if (activeTab === Tab.EditVideo) {
                const url = await editVideo(prompt, videoFile as File);
                setVideoUrl(url);
            }
        } catch (e: any) {
            console.error(e);
            setError(`An error occurred: ${e.message}`);
        } finally {
            setLoading(false);
            setLoadingMessage(null);
        }
    }, [prompt, loading, activeTab, imageFile, imageToVideoFile, videoFile, editImageFile, aspectRatio, imageStyle, quality, musicTrackUrl]);

    const handleChatFileChange = (file: File | null) => {
        if (chatAttachmentPreview) URL.revokeObjectURL(chatAttachmentPreview);
        if (file) {
            setChatAttachment(file);
            setChatAttachmentPreview(URL.createObjectURL(file));
        } else {
            setChatAttachment(null);
            setChatAttachmentPreview(null);
        }
    };

    const handleSendMessage = async (message: string) => {
        if (!chatSession || isChatLoading) return;
    
        if (message.startsWith('/generate ')) {
            const generationPrompt = message.substring(10).trim();
            const userMessage: ChatMessage = { role: 'user', parts: [{ text: message }] };
            setChatHistory(prev => [...prev, userMessage]);
    
            if (!generationPrompt) {
                const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Please provide a prompt after the /generate command. For example: `/generate a robot holding a skateboard`" }] };
                setChatHistory(prev => [...prev, errorMessage]);
                return;
            }
    
            setIsChatLoading(true);
            try {
                const modelMessage: ChatMessage = { role: 'model', parts: [{ text: `Generating an image for: "${generationPrompt}"...` }] };
                setChatHistory(prev => [...prev, modelMessage]);
    
                const url = await generateImage(generationPrompt, '1:1', 'Standard');
                const imageMessagePart: MessagePart = { imageData: { url: url, mimeType: 'image/png' } };
                const textPart: MessagePart = { text: "Here is the image I generated for you:" };
    
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', parts: [textPart, imageMessagePart] };
                    return newHistory;
                });
            } catch (e: any) {
                console.error(e);
                const errorMessage: ChatMessage = { role: 'model', parts: [{ text: `Sorry, I couldn't generate the image: ${e.message}` }] };
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = errorMessage;
                    return newHistory;
                });
            } finally {
                setIsChatLoading(false);
            }
            return;
        }
    
        const userMessageParts: MessagePart[] = [{ text: message }];
        if (chatAttachment && chatAttachmentPreview) {
            userMessageParts.push({ imageData: { url: chatAttachmentPreview, mimeType: chatAttachment.type } });
        }
    
        const userMessage: ChatMessage = { role: 'user', parts: userMessageParts };
        setChatHistory(prev => [...prev, userMessage]);
        setIsChatLoading(true);
    
        const fileToSend = chatAttachment;
        handleChatFileChange(null);
    
        try {
            const stream = await sendMessageToChatStream(chatSession, message, fileToSend ?? undefined);
            let modelResponse = '';
            setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: '' }] }]);
    
            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: modelResponse }] };
                    return newHistory;
                });
            }
        } catch (e: any) {
            console.error(e);
            const errorMessage: ChatMessage = { role: 'model', parts: [{ text: `Sorry, I encountered an error: ${e.message}` }] };
            setChatHistory(prev => {
                const newHistory = [...prev];
                if (newHistory.length > 0 && newHistory[newHistory.length - 1].parts[0].text === '') {
                   newHistory[newHistory.length - 1] = errorMessage;
                } else {
                   newHistory.push(errorMessage);
                }
                return newHistory;
            });
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleDownload = useCallback(() => {
        const url = videoUrl || imageUrl;
        if (!url) return;

        const link = document.createElement('a');
        link.href = url;
        
        const isVideo = !!videoUrl;
        const extension = isVideo ? 'mp4' : 'png';
        const safePrompt = (prompt.trim().toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 50)) || 'ai-vision';
        const filename = `${safePrompt}.${extension}`;

        link.download = filename;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [videoUrl, imageUrl, prompt]);

    const handleSelectInspiration = (selectedPrompt: string) => {
        setPrompt(selectedPrompt);
        promptInputRef.current?.focus();
        promptInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const placeholder = activeTab === Tab.Photo
        ? 'e.g., A majestic castle at sunset'
        : activeTab === Tab.Video
        ? 'e.g., A cat wearing a spacesuit, floating in space'
        : activeTab === Tab.ImageToVideo
        ? 'e.g., Make the clouds move, cinematic panning shot'
        : activeTab === Tab.EditImage
        ? 'e.g., Add a golden crown to the person'
        : 'e.g., Change the season to winter, add cinematic effect';

    return (
        <div className="w-full max-w-4xl mx-auto">
            <Header />
            <TabSelector activeTab={activeTab} onTabChange={handleTabChange} />
            <main className="mt-6 bg-slate-800/50 rounded-2xl p-6 shadow-2xl border border-slate-700 backdrop-blur-sm">
                {activeTab === Tab.AIChat ? (
                    <ChatInterface 
                        history={chatHistory} 
                        isLoading={isChatLoading}
                        onSendMessage={handleSendMessage}
                        attachmentPreview={chatAttachmentPreview}
                        onFileChange={handleChatFileChange}
                    />
                ) : (
                    <>
                        <PromptInput
                            ref={promptInputRef}
                            prompt={prompt}
                            onPromptChange={setPrompt}
                            onFileChange={handleFileChange}
                            onSubmit={handleGenerate}
                            isLoading={loading}
                            showImageUpload={activeTab === Tab.Video || activeTab === Tab.EditImage || activeTab === Tab.ImageToVideo}
                            showVideoUpload={activeTab === Tab.EditVideo}
                            imageRequired={activeTab === Tab.EditImage || activeTab === Tab.ImageToVideo}
                            videoRequired={activeTab === Tab.EditVideo}
                            placeholder={placeholder}
                        />
                        
                        {(activeTab === Tab.Video || activeTab === Tab.ImageToVideo) && (
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <AspectRatioSelector selectedRatio={aspectRatio} onRatioChange={setAspectRatio} disabled={loading} />
                                    <QualitySelector selectedQuality={quality} onQualityChange={setQuality} disabled={loading} />
                                </div>
                                <MusicSelector selectedTrackUrl={musicTrackUrl} onTrackChange={setMusicTrackUrl} disabled={loading} />
                            </div>
                        )}

                        {activeTab === Tab.Photo && (
                            <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <AspectRatioSelector selectedRatio={aspectRatio} onRatioChange={setAspectRatio} disabled={loading} />
                                    <QualitySelector selectedQuality={quality} onQualityChange={setQuality} disabled={loading} />
                                </div>
                                <StyleSelector selectedStyle={imageStyle} onStyleChange={setImageStyle} disabled={loading} />
                            </div>
                        )}
                        
                        {activeTab === Tab.EditImage && (
                            <div className="mt-4 space-y-4">
                                <AspectRatioSelector selectedRatio={aspectRatio} onRatioChange={setAspectRatio} disabled={loading} />
                                {editImagePreview && (
                                    <ImageFilterSelector selectedFilter={imageFilter} onFilterChange={setImageFilter} disabled={loading} />
                                )}
                            </div>
                        )}
                        
                        {activeTab === Tab.Video && <VideoTemplateGallery onSelectPrompt={handleSelectInspiration} />}
                        {activeTab === Tab.Photo && <ImageTemplateGallery onSelectPrompt={handleSelectInspiration} />}
                        {activeTab === Tab.EditImage && <EditInspirationGallery onSelectPrompt={handleSelectInspiration} />}

                        {activeTab !== Tab.EditImage && (
                            <PromptIdeas 
                                title="More Ideas"
                                ideas={activeTab === Tab.Video || activeTab === Tab.ImageToVideo ? VIDEO_PROMPT_IDEAS : IMAGE_PROMPT_IDEAS} 
                                onSelectPrompt={handleSelectInspiration} 
                            />
                        )}
                        
                        <div 
                            className="w-full flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden transition-all duration-300 mt-6"
                            style={{ aspectRatio: (activeTab === Tab.EditVideo && !videoPreview) || (activeTab === Tab.EditImage && !editImagePreview) || (activeTab === Tab.ImageToVideo && !imageToVideoPreview) ? '1 / 1' : aspectRatio.replace(':', ' / ') }}
                        >
                            {loading ? (
                                <LoadingIndicator activeTab={activeTab} overrideMessage={loadingMessage} />
                            ) : error ? (
                                <div className="text-center text-red-400 p-4 flex flex-col items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="font-semibold">Generation Failed</p>
                                    <p className="text-sm mt-1 max-w-md">{error}</p>
                                </div>
                            ) : videoUrl ? (
                                <VideoResult src={videoUrl} />
                            ) : imageUrl ? (
                                <ImageResult src={imageUrl} />
                            ) : activeTab === Tab.EditVideo && videoPreview ? (
                                <VideoPreviewDisplay src={videoPreview} onClear={clearAllFiles} />
                            ) : activeTab === Tab.ImageToVideo && imageToVideoPreview ? (
                                <ImagePreviewDisplay src={imageToVideoPreview} onClear={clearAllFiles} filter={'none'} />
                            ) : activeTab === Tab.EditImage && editImagePreview ? (
                                <ImagePreviewDisplay src={editImagePreview} onClear={clearAllFiles} filter={imageFilter} />
                            ) : (
                                <div className="text-center text-slate-500 p-4 flex flex-col items-center justify-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <p className="text-lg font-medium">Your creation will appear here</p>
                                    <p className="mt-1 text-sm">{
                                        activeTab === Tab.ImageToVideo
                                        ? 'Upload an image and describe how to animate it.'
                                        : activeTab === Tab.EditVideo || activeTab === Tab.EditImage 
                                        ? 'Upload a file and describe the changes you want to make.' 
                                        : 'Describe what you want to generate above.'
                                    }</p>
                                </div>
                            )}
                        </div>
                        
                        {(videoUrl || imageUrl) && !loading && (
                            <div className="mt-4 flex justify-center">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800 focus-visible:ring-green-500"
                                    aria-label={`Download ${videoUrl ? 'video' : 'photo'}`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span>Download {videoUrl ? 'Video' : 'Photo'}</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

const App: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
            {user ? <MainApp /> : <Auth />}
        </div>
    );
};

export default App;
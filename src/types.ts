export type Platform = 'youtube' | 'tiktok' | 'facebook' | 'instagram' | 'twitter' | 'other';

export type AiClarityPreset = 'ultra_hd_upscale' | 'denoise_sharpen' | 'hdr_color_vivid' | 'face_clarity';

export interface AiEnhancementResult {
  preset: AiClarityPreset;
  clarityBefore: number;
  clarityAfter: number;
  upscaledResolution: string;
  sharpnessFactor: string;
  denoiseRate: string;
  colorVibrancy: string;
  processedAt: string;
  summary: string;
}

export interface DownloadOption {
  quality: string;
  format: 'mp4' | 'mp3' | 'jpg' | 'webp';
  type: 'video' | 'audio' | 'image';
  label: string;
  size?: string;
  downloadUrl: string;
  isHd?: boolean;
  hasAudio?: boolean;
}

export interface VideoMetadata {
  id: string;
  originalUrl: string;
  platform: Platform;
  title: string;
  author: string;
  authorAvatar?: string;
  thumbnail: string;
  duration?: string;
  formats: DownloadOption[];
}

export interface HistoryItem {
  id: string;
  url: string;
  title: string;
  platform: Platform;
  thumbnail: string;
  quality: string;
  downloadedAt: number;
  isAiEnhanced?: boolean;
  aiPreset?: AiClarityPreset;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface OwnerInfo {
  name: string;
  facebookUrl: string;
  email: string;
  role: string;
}

export const OWNER_INFO: OwnerInfo = {
  name: 'Hasan Mahmud',
  facebookUrl: 'https://www.facebook.com/hasan.mahmud.562869',
  email: '15121810hasan@gmail.com',
  role: 'Creator & Developer',
};


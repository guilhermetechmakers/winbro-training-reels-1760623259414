import { useRef, useEffect, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlayerControls } from './PlayerControls';
import type { VideoPlayerState, VideoPlayerControls as PlayerControlsType } from '@/types/video';

interface HLSPlayerProps {
  src: string;
  poster?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export function HLSPlayer({
  src,
  poster,
  onTimeUpdate,
  onDurationChange,
  onPlay,
  onPause,
  onEnded,
  onError,
  className,
  autoPlay = false,
  muted = false,
  controls = true
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playerState, setPlayerState] = useState<VideoPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    isMuted: muted,
    isFullscreen: false,
    showControls: true,
    captionsEnabled: false,
    quality: 'auto'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Update player state
  const updatePlayerState = useCallback((updates: Partial<VideoPlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...updates }));
  }, []);

  // Player controls
  const playerControls: PlayerControlsType = {
    play: useCallback(() => {
      const video = videoRef.current;
      if (video) {
        video.play();
        updatePlayerState({ isPlaying: true });
        onPlay?.();
      }
    }, [updatePlayerState, onPlay]),

    pause: useCallback(() => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        updatePlayerState({ isPlaying: false });
        onPause?.();
      }
    }, [updatePlayerState, onPause]),

    seek: useCallback((time: number) => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = time;
        updatePlayerState({ currentTime: time });
        onTimeUpdate?.(time);
      }
    }, [updatePlayerState, onTimeUpdate]),

    setVolume: useCallback((volume: number) => {
      const video = videoRef.current;
      if (video) {
        video.volume = volume;
        updatePlayerState({ volume, isMuted: volume === 0 });
      }
    }, [updatePlayerState]),

    setPlaybackRate: useCallback((rate: number) => {
      const video = videoRef.current;
      if (video) {
        video.playbackRate = rate;
        updatePlayerState({ playbackRate: rate });
      }
    }, [updatePlayerState]),

    toggleMute: useCallback(() => {
      const video = videoRef.current;
      if (video) {
        if (playerState.isMuted) {
          video.volume = playerState.volume;
          updatePlayerState({ isMuted: false });
        } else {
          video.volume = 0;
          updatePlayerState({ isMuted: true });
        }
      }
    }, [playerState.isMuted, playerState.volume, updatePlayerState]),

    toggleFullscreen: useCallback(() => {
      const video = videoRef.current;
      if (video) {
        if (!document.fullscreenElement) {
          video.requestFullscreen();
          updatePlayerState({ isFullscreen: true });
        } else {
          document.exitFullscreen();
          updatePlayerState({ isFullscreen: false });
        }
      }
    }, [updatePlayerState]),

    toggleCaptions: useCallback(() => {
      const video = videoRef.current;
      if (video) {
        const tracks = video.textTracks;
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].mode = playerState.captionsEnabled ? 'hidden' : 'showing';
        }
        updatePlayerState({ captionsEnabled: !playerState.captionsEnabled });
      }
    }, [playerState.captionsEnabled, updatePlayerState]),

    setQuality: useCallback((quality: string) => {
      updatePlayerState({ quality });
    }, [updatePlayerState])
  };

  // Event handlers
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setPlayerState(prev => ({
        ...prev,
        duration: video.duration,
        volume: video.volume
      }));
      onDurationChange?.(video.duration);
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: video.currentTime
      }));
      onTimeUpdate?.(video.currentTime);
    }
  };

  const handlePlay = () => {
    updatePlayerState({ isPlaying: true });
    onPlay?.();
  };

  const handlePause = () => {
    updatePlayerState({ isPlaying: false });
    onPause?.();
  };

  const handleEnded = () => {
    updatePlayerState({ isPlaying: false, currentTime: 0 });
    onEnded?.();
  };

  const handleError = () => {
    const video = videoRef.current;
    const errorMessage = video?.error?.message || 'Video playback error';
    setError(errorMessage);
    setIsLoading(false);
    onError?.(new Error(errorMessage));
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handleSeeking = () => {
    setIsLoading(true);
  };

  const handleSeeked = () => {
    setIsLoading(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          if (playerState.isPlaying) {
            playerControls.pause();
          } else {
            playerControls.play();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          playerControls.seek(Math.max(0, playerState.currentTime - 5));
          break;
        case 'ArrowRight':
          event.preventDefault();
          playerControls.seek(Math.min(playerState.duration, playerState.currentTime + 5));
          break;
        case 'KeyM':
          event.preventDefault();
          playerControls.toggleMute();
          break;
        case 'KeyF':
          event.preventDefault();
          playerControls.toggleFullscreen();
          break;
        case 'KeyC':
          event.preventDefault();
          playerControls.toggleCaptions();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [playerState, playerControls]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      updatePlayerState({ isFullscreen: !!document.fullscreenElement });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [updatePlayerState]);

  // Auto-hide controls
  useEffect(() => {
    let timeout: number;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      updatePlayerState({ showControls: true });
      timeout = setTimeout(() => {
        if (playerState.isPlaying) {
          updatePlayerState({ showControls: false });
        }
      }, 3000);
    };

    if (playerState.isPlaying) {
      resetTimeout();
    } else {
      updatePlayerState({ showControls: true });
    }

    return () => clearTimeout(timeout);
  }, [playerState.isPlaying, updatePlayerState]);

  if (error) {
    return (
      <Card className={cn('p-8 text-center', className)}>
        <div className="space-y-4">
          <div className="text-destructive">
            <Play className="h-12 w-12 mx-auto mb-2" />
            <h3 className="text-lg font-semibold">Playback Error</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
          <Button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              const video = videoRef.current;
              if (video) {
                video.load();
              }
            }}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('relative group', className)}>
      <Card className="overflow-hidden">
        <div className="relative bg-black">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            autoPlay={autoPlay}
            muted={muted}
            playsInline
            className="w-full h-auto max-h-96 object-contain"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            onCanPlay={handleCanPlay}
            onWaiting={handleWaiting}
            onSeeking={handleSeeking}
            onSeeked={handleSeeked}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}

          {/* Controls Overlay */}
          {controls && (
            <div className={cn(
              'absolute inset-0 transition-opacity duration-300',
              playerState.showControls ? 'opacity-100' : 'opacity-0'
            )}>
              <PlayerControls
                playerState={playerState}
                controls={playerControls}
                onSettingsToggle={() => setShowSettings(!showSettings)}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Settings,
  Captions,
  RotateCcw,
  RotateCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils/videoValidation';
import type { VideoPlayerState, VideoPlayerControls } from '@/types/video';

interface PlayerControlsProps {
  playerState: VideoPlayerState;
  controls: VideoPlayerControls;
  onSettingsToggle: () => void;
  className?: string;
}

export function PlayerControls({ 
  playerState, 
  controls, 
  onSettingsToggle,
  className 
}: PlayerControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showPlaybackRateMenu, setShowPlaybackRateMenu] = useState(false);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  const handleSeek = (value: number[]) => {
    controls.seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    controls.setVolume(value[0]);
  };

  const handlePlaybackRateChange = (rate: number) => {
    controls.setPlaybackRate(rate);
    setShowPlaybackRateMenu(false);
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Top Controls */}
      <div className="flex justify-end p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={controls.toggleCaptions}
            className={cn(
              'text-white hover:bg-white/20',
              playerState.captionsEnabled && 'bg-white/20'
            )}
          >
            <Captions className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsToggle}
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom Controls */}
      <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={[playerState.currentTime]}
            onValueChange={handleSeek}
            max={playerState.duration}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={playerState.isPlaying ? controls.pause : controls.play}
              className="text-white hover:bg-white/20"
            >
              {playerState.isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            {/* Skip Backward */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => controls.seek(Math.max(0, playerState.currentTime - 10))}
              className="text-white hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            {/* Skip Forward */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => controls.seek(Math.min(playerState.duration, playerState.currentTime + 10))}
              className="text-white hover:bg-white/20"
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            {/* Volume */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={controls.toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="text-white hover:bg-white/20"
              >
                {playerState.isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              {/* Volume Slider */}
              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 rounded-lg p-2">
                  <Slider
                    value={[playerState.volume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.1}
                    orientation="vertical"
                    className="h-20"
                  />
                </div>
              )}
            </div>

            {/* Time Display */}
            <div className="text-white text-sm font-mono">
              {formatDuration(playerState.currentTime)} / {formatDuration(playerState.duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Playback Rate */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlaybackRateMenu(!showPlaybackRateMenu)}
                className="text-white hover:bg-white/20"
              >
                {playerState.playbackRate}x
              </Button>

              {/* Playback Rate Menu */}
              {showPlaybackRateMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-lg p-1 min-w-20">
                  {playbackRates.map((rate) => (
                    <Button
                      key={rate}
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlaybackRateChange(rate)}
                      className={cn(
                        'w-full justify-start text-white hover:bg-white/20',
                        playerState.playbackRate === rate && 'bg-white/20'
                      )}
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="sm"
              onClick={controls.toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {playerState.isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
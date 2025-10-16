import { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils/videoValidation';
import type { VideoUpload } from '@/types/video';

interface VideoPreviewProps {
  upload: VideoUpload;
  onTrim?: (startTime: number, endTime: number) => void;
  className?: string;
}

export function VideoPreview({ upload, onTrim, className }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);

  // Create video URL from file
  const videoUrl = URL.createObjectURL(upload.file);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setTrimEnd(video.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleSliderChange = (value: number[]) => {
    const time = value[0];
    seekTo(time);
  };

  const handleTrimStartChange = (value: number[]) => {
    setTrimStart(value[0]);
  };

  const handleTrimEndChange = (value: number[]) => {
    setTrimEnd(value[0]);
  };

  const applyTrim = () => {
    if (onTrim) {
      onTrim(trimStart, trimEnd);
    }
  };

  const resetTrim = () => {
    setTrimStart(0);
    setTrimEnd(duration);
  };

  const jumpToStart = () => seekTo(trimStart);
  const jumpToEnd = () => seekTo(trimEnd);

  const trimDuration = trimEnd - trimStart;

  return (
    <Card className={cn('p-6 space-y-4', className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Video Preview</h3>
        <p className="text-sm text-muted-foreground">
          {upload.file.name} • {formatDuration(duration)}
        </p>
      </div>

      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-64 object-contain"
          preload="metadata"
        />
        
        {/* Play/Pause Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            variant="secondary"
            className="h-16 w-16 rounded-full opacity-80 hover:opacity-100"
            onClick={togglePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
        
        <Slider
          value={[currentTime]}
          onValueChange={handleSliderChange}
          max={duration}
          step={0.1}
          className="w-full"
        />
      </div>

      {/* Trim Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Trim Video</h4>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={resetTrim}
              disabled={!duration}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={applyTrim}
              disabled={!duration || trimDuration <= 0}
            >
              <Scissors className="h-4 w-4 mr-1" />
              Apply Trim
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Start Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Start Time</span>
              <span className="text-muted-foreground">
                {formatDuration(trimStart)}
              </span>
            </div>
            <Slider
              value={[trimStart]}
              onValueChange={handleTrimStartChange}
              max={trimEnd}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={jumpToStart}
                className="h-6 px-2"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* End Time */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>End Time</span>
              <span className="text-muted-foreground">
                {formatDuration(trimEnd)}
              </span>
            </div>
            <Slider
              value={[trimEnd]}
              onValueChange={handleTrimEndChange}
              min={trimStart}
              max={duration}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <Button
                size="sm"
                variant="ghost"
                onClick={jumpToEnd}
                className="h-6 px-2"
              >
                <RotateCw className="h-3 w-3" />
              </Button>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Trim Duration */}
          <div className="text-center text-sm text-muted-foreground">
            Trimmed duration: <span className="font-medium">{formatDuration(trimDuration)}</span>
          </div>
        </div>
      </div>

      {/* Validation Messages */}
      {duration > 30 && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning">
            Video is longer than 30 seconds. Consider trimming to focus on key content.
          </p>
        </div>
      )}

      {duration < 5 && (
        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-sm text-warning">
            Video is shorter than 5 seconds. Consider adding more content for better training value.
          </p>
        </div>
      )}
    </Card>
  );
}
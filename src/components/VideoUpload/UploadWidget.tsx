import { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileVideo, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { validateVideoFile, formatFileSize } from '@/lib/utils/videoValidation';
import type { VideoUpload } from '@/types/video';

interface UploadWidgetProps {
  onFileSelect: (file: File) => void;
  upload?: VideoUpload;
  disabled?: boolean;
  className?: string;
}

export function UploadWidget({ 
  onFileSelect, 
  upload, 
  disabled = false,
  className 
}: UploadWidgetProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setValidationError(null);
    
    try {
      const validation = await validateVideoFile(file);
      
      if (!validation.isValid) {
        setValidationError(validation.errors.join(', '));
        return;
      }

      onFileSelect(file);
    } catch (error) {
      setValidationError('Failed to validate video file');
    }
  }, [onFileSelect]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelect(acceptedFiles[0]);
    }
  }, [handleFileSelect]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    multiple: false,
    disabled
  });

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const getUploadStatus = () => {
    if (!upload) return null;
    
    switch (upload.status) {
      case 'uploading':
        return { icon: Upload, text: 'Uploading...', color: 'text-primary' };
      case 'processing':
        return { icon: FileVideo, text: 'Processing...', color: 'text-warning' };
      case 'transcoding':
        return { icon: FileVideo, text: 'Converting...', color: 'text-warning' };
      case 'complete':
        return { icon: CheckCircle2, text: 'Complete', color: 'text-success' };
      case 'error':
        return { icon: AlertCircle, text: 'Error', color: 'text-destructive' };
      default:
        return null;
    }
  };

  const status = getUploadStatus();

  return (
    <div className={cn('w-full', className)}>
      <Card
        {...getRootProps()}
        className={cn(
          'relative border-2 border-dashed transition-all duration-200 cursor-pointer',
          'hover:border-primary/50 hover:bg-primary/5',
          isDragActive && 'border-primary bg-primary/10',
          isDragReject && 'border-destructive bg-destructive/5',
          upload && 'border-solid',
          disabled && 'opacity-50 cursor-not-allowed',
          'p-8 text-center'
        )}
        onClick={handleFileInputClick}
      >
        <input
          {...getInputProps()}
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center space-y-4">
          {upload ? (
            <>
              <div className="flex items-center space-x-2">
                {status?.icon && (
                  <status.icon className={cn('h-8 w-8', status.color)} />
                )}
                <div className="text-left">
                  <p className="font-medium text-foreground">{upload.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(upload.file.size)}
                  </p>
                </div>
              </div>

              {upload.status === 'uploading' && (
                <div className="w-full space-y-2">
                  <Progress value={upload.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {upload.progress}% uploaded
                  </p>
                </div>
              )}

              {status && (
                <p className={cn('text-sm font-medium', status.color)}>
                  {status.text}
                </p>
              )}

              {upload.error && (
                <p className="text-sm text-destructive">
                  {upload.error}
                </p>
              )}
            </>
          ) : (
            <>
              <div className={cn(
                'rounded-full p-4 transition-colors',
                isDragActive ? 'bg-primary/10' : 'bg-muted'
              )}>
                <Upload className={cn(
                  'h-8 w-8 transition-colors',
                  isDragActive ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {isDragActive ? 'Drop your video here' : 'Upload a training reel'}
                </h3>
                <p className="text-muted-foreground">
                  Drag and drop your video file, or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports MP4, MOV, AVI, WebM • Max 100MB • 5-30 seconds
                </p>
              </div>

              <Button 
                type="button" 
                variant="outline"
                disabled={disabled}
                className="mt-4"
              >
                Choose File
              </Button>
            </>
          )}
        </div>

        {validationError && (
          <div className="absolute inset-0 bg-destructive/5 border-destructive rounded-lg flex items-center justify-center">
            <div className="text-center space-y-2">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
              <p className="text-sm text-destructive font-medium">
                {validationError}
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
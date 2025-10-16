import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileVideo, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { UploadWidget } from '@/components/VideoUpload/UploadWidget';
import { VideoPreview } from '@/components/VideoUpload/VideoPreview';
import { MetadataForm } from '@/components/VideoUpload/MetadataForm';
import { ProcessingStatus } from '@/components/VideoUpload/ProcessingStatus';
import { useVideoUpload } from '@/hooks/useVideoUpload';
import { useTranscodingJob } from '@/hooks/useTranscoding';
import type { VideoUpload, CreateReelRequest } from '@/types/video';

export default function CreateUploadContentPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'upload' | 'preview' | 'metadata' | 'processing' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [upload, setUpload] = useState<VideoUpload | null>(null);

  const { 
    startUpload, 
    isUploading, 
    createReel, 
    isCreatingReel 
  } = useVideoUpload();

  const { data: processingJob } = useTranscodingJob(upload?.reelId || '');

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setUpload(null);
    setCurrentStep('preview');
  };

  // Handle upload start
  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      startUpload(selectedFile);
      setCurrentStep('metadata');
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Handle metadata submission
  const handleMetadataSubmit = async (data: CreateReelRequest) => {
    if (!upload?.uploadId) return;

    try {
      const reelData = {
        ...data,
        uploadId: upload.uploadId
      };
      
      createReel(reelData);
      setCurrentStep('processing');
    } catch (error) {
      console.error('Failed to create reel:', error);
    }
  };

  // Handle trim
  const handleTrim = (_start: number, _end: number) => {
    // Trim logic would go here
  };

  // Update upload status
  useEffect(() => {
    if (upload && upload.status === 'complete') {
      setCurrentStep('complete');
    }
  }, [upload]);

  // Update processing status
  useEffect(() => {
    if (processingJob?.status === 'complete') {
      setCurrentStep('complete');
    }
  }, [processingJob]);

  const getStepStatus = (step: string) => {
    const stepOrder = ['upload', 'preview', 'metadata', 'processing', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (_step: string, status: string) => {
    if (status === 'completed') return <CheckCircle2 className="h-4 w-4 text-success" />;
    if (status === 'current') return <FileVideo className="h-4 w-4 text-primary" />;
    return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Upload Training Reel</h1>
                <p className="text-muted-foreground">
                  Create a new training video for your team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between">
              {[
                { key: 'upload', label: 'Upload Video' },
                { key: 'preview', label: 'Preview & Trim' },
                { key: 'metadata', label: 'Add Details' },
                { key: 'processing', label: 'Processing' },
                { key: 'complete', label: 'Complete' }
              ].map((step, index) => {
                const status = getStepStatus(step.key);
                const isLast = index === 4;
                
                return (
                  <div key={step.key} className="flex items-center">
                    <div className="flex items-center space-x-2">
                      {getStepIcon(step.key, status)}
                      <span className={`text-sm font-medium ${
                        status === 'current' ? 'text-primary' :
                        status === 'completed' ? 'text-success' :
                        'text-muted-foreground'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div className={`w-8 h-0.5 mx-4 ${
                        status === 'completed' ? 'bg-success' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Main Content */}
          <Tabs value={currentStep} className="space-y-6">
            {/* Upload Step */}
            <TabsContent value="upload" className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="text-center space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-primary" />
                    <h2 className="text-xl font-semibold">Upload Your Video</h2>
                    <p className="text-muted-foreground">
                      Select a video file to start creating your training reel
                    </p>
                  </div>
                  
                  <UploadWidget
                    onFileSelect={handleFileSelect}
                    disabled={isUploading}
                  />
                </div>
              </Card>
            </TabsContent>

            {/* Preview Step */}
            <TabsContent value="preview" className="space-y-6">
              {selectedFile && (
                <VideoPreview
                  upload={{
                    id: 'preview',
                    file: selectedFile,
                    progress: 100,
                    status: 'complete',
                    chunks: []
                  }}
                  onTrim={handleTrim}
                />
              )}
              
              <Card className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Ready to upload?</h3>
                    <p className="text-sm text-muted-foreground">
                      Your video will be processed and made available for training
                    </p>
                  </div>
                  <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex items-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>{isUploading ? 'Uploading...' : 'Start Upload'}</span>
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Metadata Step */}
            <TabsContent value="metadata" className="space-y-6">
              <MetadataForm
                onSubmit={handleMetadataSubmit}
                isLoading={isCreatingReel}
              />
            </TabsContent>

            {/* Processing Step */}
            <TabsContent value="processing" className="space-y-6">
              {upload?.reelId && (
                <ProcessingStatus
                  jobId={upload.reelId}
                  onRetry={() => {
                    // Retry logic would go here
                  }}
                  onCancel={() => {
                    // Cancel logic would go here
                  }}
                />
              )}
            </TabsContent>

            {/* Complete Step */}
            <TabsContent value="complete" className="space-y-6">
              <Card className="p-8 text-center">
                <div className="space-y-4">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-success" />
                  <h2 className="text-2xl font-bold">Upload Complete!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your training reel has been successfully uploaded and processed. 
                    It's now available for your team to view and learn from.
                  </p>
                  
                  <div className="flex justify-center space-x-4 pt-4">
                    <Button
                      onClick={() => navigate(`/reel/${upload?.reelId}`)}
                      className="flex items-center space-x-2"
                    >
                      <FileVideo className="h-4 w-4" />
                      <span>View Reel</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/dashboard')}
                    >
                      Back to Dashboard
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
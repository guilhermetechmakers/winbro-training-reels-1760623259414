import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Copy, 
  Download, 
  Clock,
  User,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils/videoValidation';
import type { Transcript, TranscriptSegment } from '@/types/video';

interface TranscriptPanelProps {
  transcript: Transcript;
  currentTime: number;
  onSeek: (time: number) => void;
  className?: string;
}

export function TranscriptPanel({ 
  transcript, 
  currentTime, 
  onSeek,
  className 
}: TranscriptPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(new Set());

  // Filter segments based on search query
  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return transcript.segments;

    const query = searchQuery.toLowerCase();
    return transcript.segments.filter(segment => 
      segment.text.toLowerCase().includes(query)
    );
  }, [transcript.segments, searchQuery]);

  // Find current segment
  const currentSegment = transcript.segments.find(segment => 
    currentTime >= segment.start && currentTime <= segment.end
  );

  // Find search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return transcript.segments
      .map((segment, index) => ({ segment, index }))
      .filter(({ segment }) => segment.text.toLowerCase().includes(query));
  }, [transcript.segments, searchQuery]);

  const handleSegmentClick = (segment: TranscriptSegment) => {
    onSeek(segment.start);
  };

  const handleCopyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(transcript.text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy transcript:', error);
    }
  };

  const handleDownloadTranscript = () => {
    const blob = new Blob([transcript.text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleSegmentExpansion = (segmentId: string) => {
    const newExpanded = new Set(expandedSegments);
    if (newExpanded.has(segmentId)) {
      newExpanded.delete(segmentId);
    } else {
      newExpanded.add(segmentId);
    }
    setExpandedSegments(newExpanded);
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <Card className={cn('h-full flex flex-col', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Transcript</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyTranscript}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadTranscript}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transcript..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Search Results Count */}
        {searchQuery && (
          <div className="mt-2 text-sm text-muted-foreground">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
          </div>
        )}
      </div>

      {/* Transcript Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {transcript.segments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No transcript available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSegments.map((segment) => {
              const isCurrent = currentSegment?.id === segment.id;
              const isExpanded = expandedSegments.has(segment.id);
              const isSearchResult = searchResults.some(result => result.segment.id === segment.id);

              return (
                <div
                  key={segment.id}
                  className={cn(
                    'p-3 rounded-lg border transition-all duration-200 cursor-pointer',
                    'hover:bg-muted/50',
                    isCurrent && 'bg-primary/10 border-primary/20',
                    isSearchResult && 'bg-yellow-50 border-yellow-200'
                  )}
                  onClick={() => handleSegmentClick(segment)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Timestamp */}
                    <div className="flex-shrink-0">
                      <Badge
                        variant={isCurrent ? 'default' : 'outline'}
                        className="text-xs font-mono"
                      >
                        {formatDuration(segment.start)}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={cn(
                            'text-sm leading-relaxed',
                            isCurrent && 'font-medium'
                          )}>
                            {highlightText(segment.text, searchQuery)}
                          </p>
                          
                          {/* Speaker */}
                          {segment.speaker && (
                            <div className="flex items-center mt-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              {segment.speaker}
                            </div>
                          )}

                          {/* Confidence Score */}
                          {segment.confidence && (
                            <div className="mt-1">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-muted rounded-full h-1">
                                  <div
                                    className={cn(
                                      'h-1 rounded-full transition-all duration-300',
                                      segment.confidence > 0.8 ? 'bg-success' :
                                      segment.confidence > 0.6 ? 'bg-warning' : 'bg-destructive'
                                    )}
                                    style={{ width: `${segment.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {Math.round(segment.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Expand/Collapse Button */}
                        {segment.text.length > 200 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSegmentExpansion(segment.id);
                            }}
                            className="ml-2 h-6 w-6 p-0"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Expanded Content */}
                      {isExpanded && segment.text.length > 200 && (
                        <div className="mt-2 pt-2 border-t border-muted">
                          <p className="text-sm text-muted-foreground">
                            Full text: {segment.text}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div>
            {transcript.segments.length} segments • {Math.round(transcript.confidence * 100)}% confidence
          </div>
          <div>
            Language: {transcript.language}
          </div>
        </div>
      </div>
    </Card>
  );
}
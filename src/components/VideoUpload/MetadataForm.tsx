import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useReelMetadata } from '@/hooks/useReel';
import type { CreateReelRequest } from '@/types/video';

const metadataSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  machineModel: z.string().optional(),
  processStep: z.string().optional(),
  tooling: z.array(z.string()),
  privacy: z.enum(['internal', 'customer', 'public']),
  customerAllocations: z.array(z.string()).optional()
});

type MetadataFormData = z.infer<typeof metadataSchema>;

interface MetadataFormProps {
  onSubmit: (data: CreateReelRequest) => void;
  isLoading?: boolean;
  className?: string;
}

export function MetadataForm({ onSubmit, isLoading = false, className }: MetadataFormProps) {
  const [tagInput, setTagInput] = useState('');
  const [toolingInput, setToolingInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    tagSuggestions,
    machineModels,
    processSteps,
    toolingOptions
  } = useReelMetadata();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<MetadataFormData>({
    resolver: zodResolver(metadataSchema),
    defaultValues: {
      title: '',
      description: '',
      tags: [],
      machineModel: '',
      processStep: '',
      tooling: [],
      privacy: 'internal',
      customerAllocations: []
    }
  });

  const watchedTags = watch('tags');
  const watchedTooling = watch('tooling');
  const watchedPrivacy = watch('privacy');

  const handleAddTag = () => {
    if (tagInput.trim() && !watchedTags.includes(tagInput.trim())) {
      setValue('tags', [...watchedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue('tags', watchedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddTooling = () => {
    if (toolingInput.trim() && !watchedTooling.includes(toolingInput.trim())) {
      setValue('tooling', [...watchedTooling, toolingInput.trim()]);
      setToolingInput('');
    }
  };

  const handleRemoveTooling = (toolingToRemove: string) => {
    setValue('tooling', watchedTooling.filter(tooling => tooling !== toolingToRemove));
  };

  const handleTagSuggestionClick = (suggestion: string) => {
    if (!watchedTags.includes(suggestion)) {
      setValue('tags', [...watchedTags, suggestion]);
    }
  };

  const handleToolingSuggestionClick = (suggestion: string) => {
    if (!watchedTooling.includes(suggestion)) {
      setValue('tooling', [...watchedTooling, suggestion]);
    }
  };

  const onFormSubmit = (data: MetadataFormData) => {
    onSubmit({
      uploadId: '', // This will be set by the parent component
      title: data.title,
      description: data.description,
      tags: data.tags,
      machineModel: data.machineModel || undefined,
      processStep: data.processStep || undefined,
      tooling: data.tooling,
      privacy: data.privacy,
      customerAllocations: data.customerAllocations
    });
  };

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Reel Information</h3>
        <p className="text-sm text-muted-foreground">
          Add metadata to help others find and understand your training reel.
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="e.g., How to Change Drill Bit on CNC Machine"
            className={cn(errors.title && 'border-destructive')}
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Brief description of what this reel demonstrates..."
            rows={3}
            className={cn(errors.description && 'border-destructive')}
          />
          {errors.description && (
            <p className="text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags *</Label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tag Suggestions */}
            {tagInput && tagSuggestions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {tagSuggestions
                    .filter(suggestion => 
                      suggestion.toLowerCase().includes(tagInput.toLowerCase()) &&
                      !watchedTags.includes(suggestion)
                    )
                    .slice(0, 5)
                    .map((suggestion) => (
                      <Button
                        key={suggestion}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleTagSuggestionClick(suggestion)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {suggestion}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Selected Tags */}
            {watchedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          {errors.tags && (
            <p className="text-sm text-destructive">{errors.tags.message}</p>
          )}
        </div>

        {/* Machine Model */}
        <div className="space-y-2">
          <Label htmlFor="machineModel">Machine Model</Label>
          <Select
            value={watch('machineModel')}
            onValueChange={(value) => setValue('machineModel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select machine model" />
            </SelectTrigger>
            <SelectContent>
              {machineModels.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Process Step */}
        <div className="space-y-2">
          <Label htmlFor="processStep">Process Step</Label>
          <Select
            value={watch('processStep')}
            onValueChange={(value) => setValue('processStep', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select process step" />
            </SelectTrigger>
            <SelectContent>
              {processSteps.map((step) => (
                <SelectItem key={step} value={step}>
                  {step}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tooling */}
        <div className="space-y-2">
          <Label>Tooling Used</Label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={toolingInput}
                onChange={(e) => setToolingInput(e.target.value)}
                placeholder="Add tooling..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTooling();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTooling}
                disabled={!toolingInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tooling Suggestions */}
            {toolingInput && toolingOptions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {toolingOptions
                    .filter(option => 
                      option.toLowerCase().includes(toolingInput.toLowerCase()) &&
                      !watchedTooling.includes(option)
                    )
                    .slice(0, 5)
                    .map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleToolingSuggestionClick(option)}
                      >
                        {option}
                      </Button>
                    ))}
                </div>
              </div>
            )}

            {/* Selected Tooling */}
            {watchedTooling.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {watchedTooling.map((tooling) => (
                  <Badge
                    key={tooling}
                    variant="outline"
                    className="flex items-center space-x-1"
                  >
                    <span>{tooling}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRemoveTooling(tooling)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Privacy Level */}
        <div className="space-y-2">
          <Label htmlFor="privacy">Privacy Level</Label>
          <Select
            value={watchedPrivacy}
            onValueChange={(value: 'internal' | 'customer' | 'public') => setValue('privacy', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="internal">Internal Only</SelectItem>
              <SelectItem value="customer">Customer Specific</SelectItem>
              <SelectItem value="public">Public</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Advanced Options */}
        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-0 h-auto"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </Button>

          {showAdvanced && (
            <div className="space-y-4 pl-4 border-l-2 border-muted">
              <div className="space-y-2">
                <Label>Customer Allocations</Label>
                <p className="text-sm text-muted-foreground">
                  Select which customer groups can access this reel
                </p>
                <div className="space-y-2">
                  <Checkbox id="all-customers" />
                  <Label htmlFor="all-customers" className="ml-2">
                    All customers
                  </Label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className="min-w-32"
          >
            {isLoading ? 'Creating...' : 'Create Reel'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
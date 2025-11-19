'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVIDERS, SelectedModels, ModelId } from '../types/definitions';
import { Badge } from '@/components/ui/badge';
import { useProviderApiKeys } from '../hooks/useProviderApiKeys';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { TooltipContent } from '@/components/ui/tooltip';

interface ModelSelectorProps {
  selectedModels: SelectedModels;
  onModelSelectionChange: (providerId: string, modelId: ModelId | null) => void;
  isLoading?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModels,
  onModelSelectionChange,
  isLoading = false,
}) => {
  const { hasApiKey, isLoading: isLoadingApiKeys } = useProviderApiKeys();

  const handleSelectChange = (providerId: string, value: string) => {
    const modelId = value === 'none' ? null : (value as ModelId);
    onModelSelectionChange(providerId, modelId);
  };

  const selectedCount = Object.values(selectedModels).filter(m => m !== null).length;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {selectedCount > 0 && (
          <Badge variant="secondary" className="ml-2">
            {selectedCount} selected
          </Badge>
        )}
      </div>
      <TooltipPrimitive.Provider delayDuration={0}>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {PROVIDERS.map(provider => {
            const providerHasApiKey = hasApiKey(provider.id);
            const isDisabled = isLoading || isLoadingApiKeys || !providerHasApiKey;

            return (
              <div
                key={provider.id}
                className="space-y-3 p-2"
              >
                <div className="flex items-center gap-2">
                  <Label htmlFor={`select-${provider.id}`} className="text-sm font-medium">
                    {provider.name}
                  </Label>
                  {!providerHasApiKey && !isLoadingApiKeys && (
                    <Badge variant="outline" className="text-xs">
                      No API key
                    </Badge>
                  )}
                </div>
                {!providerHasApiKey && !isLoadingApiKeys ? (
                  <TooltipPrimitive.Root>
                    <TooltipPrimitive.Trigger asChild>
                      <div className="w-full">
                        <Select
                          value={selectedModels[provider.id as keyof SelectedModels] || ''}
                          onValueChange={value => handleSelectChange(provider.id, value)}
                          disabled={isDisabled}
                        >
                          <SelectTrigger id={`select-${provider.id}`}>
                            <SelectValue placeholder={`Select a ${provider.name} model`} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {provider.models.map(model => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TooltipPrimitive.Trigger>
                    <TooltipContent>
                      <p>Please add an API key for {provider.name} in Settings</p>
                    </TooltipContent>
                  </TooltipPrimitive.Root>
                ) : (
                  <Select
                    value={selectedModels[provider.id as keyof SelectedModels] || ''}
                    onValueChange={value => handleSelectChange(provider.id, value)}
                    disabled={isDisabled}
                  >
                    <SelectTrigger id={`select-${provider.id}`}>
                      <SelectValue placeholder={`Select a ${provider.name} model`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {provider.models.map(model => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>
      </TooltipPrimitive.Provider>
    </div>
  );
};

export default ModelSelector;

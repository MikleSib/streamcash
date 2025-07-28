'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { alertAPI } from '@/lib/api';

interface AudioTrimmerProps {
  audioUrl: string;
  initialStartTime?: number;
  initialEndTime?: number;
  onTrimChange: (startTime: number, endTime: number | null) => void;
  onPreview?: (startTime: number, endTime: number | null) => void;
}

export function AudioTrimmer({ 
  audioUrl, 
  initialStartTime = 0, 
  initialEndTime, 
  onTrimChange,
  onPreview 
}: AudioTrimmerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const previewAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (!endTime) {
        setEndTime(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      
      if (endTime && audio.currentTime >= endTime) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = startTime;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = startTime;
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [startTime, endTime]);

  // Отдельный useEffect для обновления родительского компонента
  // Исключаем onTrimChange из зависимостей чтобы избежать бесконечного цикла
  useEffect(() => {
    onTrimChange(startTime, endTime);
  }, [startTime, endTime]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.currentTime = startTime;
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStartTimeChange = (value: number) => {
    if (endTime && value >= endTime) {
      setStartTime(Math.max(0, endTime - 0.1));
    } else {
      setStartTime(value);
    }
  };

  const handleEndTimeChange = (value: number) => {
    if (value <= startTime) {
      setEndTime(startTime + 0.1);
    } else {
      setEndTime(value);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 100);
    return `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  };

  const handlePreview = async () => {
    if (!onPreview) return;
    
    try {
      setIsPreviewLoading(true);
      const response = await alertAPI.previewAudio(audioUrl, startTime, endTime || undefined);
      
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      if (previewAudioRef.current) {
        previewAudioRef.current.src = url;
        previewAudioRef.current.play();
      }
      
      onPreview(startTime, endTime);
    } catch (error) {
      console.error('Ошибка создания превью:', error);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const resetTrim = () => {
    setStartTime(0);
    setEndTime(duration);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Обрезка аудио</h3>
        <button
          onClick={resetTrim}
          className="flex items-center space-x-1 px-2 py-1 text-sm text-gray-400 hover:text-white transition-colors"
          title="Сбросить"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Сброс</span>
        </button>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <audio ref={previewAudioRef} />

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlayPause}
            className="flex items-center justify-center w-10 h-10 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
          
          <div className="flex-1">
            <div className="relative">
              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-purple-600 transition-all duration-150"
                  style={{ 
                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` 
                  }}
                />
              </div>
              
              <div 
                className="absolute top-0 h-2 bg-yellow-500/30 rounded-full"
                style={{
                  left: `${duration > 0 ? (startTime / duration) * 100 : 0}%`,
                  width: `${duration > 0 ? ((endTime || duration) - startTime) / duration * 100 : 100}%`
                }}
              />
            </div>
          </div>
          
          <div className="text-sm text-gray-400 font-mono min-w-[100px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Начало: {formatTime(startTime)}
            </label>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={startTime}
              onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb-green"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Конец: {formatTime(endTime || duration)}
            </label>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={endTime || duration}
              onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider-thumb-red"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-gray-400">
            Длительность отрезка: {formatTime((endTime || duration) - startTime)}
          </div>
          
          <button
            onClick={handlePreview}
            disabled={isPreviewLoading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isPreviewLoading ? 'Создаю превью...' : 'Прослушать отрезок'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .slider-thumb-green::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #10b981;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider-thumb-red::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #ef4444;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider-thumb-green::-moz-range-thumb,
        .slider-thumb-red::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 50%;
          cursor: pointer;
        }
        
        .slider-thumb-green::-moz-range-thumb {
          background: #10b981;
        }
        
        .slider-thumb-red::-moz-range-thumb {
          background: #ef4444;
        }
      `}</style>
    </div>
  );
} 
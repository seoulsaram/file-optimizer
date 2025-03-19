'use client';
import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import OptionPanel from '../components/OptionPanel';
import ImagePreview from '../components/ImagePreview';

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [optimizedImages, setOptimizedImages] = useState<string[]>([]);
  const [format, setFormat] = useState('webp');
  const [quality, setQuality] = useState(80);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('format', format);
    formData.append('quality', quality.toString());
    setLoading(true);
    const res = await fetch('/api/optimize', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setLoading(false);
    setOptimizedImages(data.optimized);
    setFiles([]); // 원본 삭제
  };

  const [downloading, setDownloading] = useState(false);

  const downloadAll = async () => {
    setDownloading(true);
    try {
      const res = await fetch('/api/optimize/zip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optimizedImages }), // base64 images 배열 전달
      });

      if (!res.ok) {
        throw new Error('다운로드 실패');
      }
      setDownloading(false);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'optimized_images.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('다운로드 에러:', error);
      alert('ZIP 파일 다운로드에 실패했습니다.');
    }
  };

  return (
    <div className='grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20'>
      <main className='flex flex-col gap-[32px] row-start-2 items-center sm:items-start'>
        <div className='max-w-4xl mx-auto p-8'>
          <h1 className='text-2xl font-bold mb-4'>이미지 최적화 프로그램</h1>
          <OptionPanel
            format={format}
            setFormat={setFormat}
            quality={quality}
            setQuality={setQuality}
          />
          <ImageUpload files={files} setFiles={setFiles} />
          <button
            onClick={handleOptimize}
            disabled={files.length === 0 || loading}
            className='bg-blue-500 text-white px-4 py-2 rounded mt-4 disabled:bg-gray-300'
          >
            최적화
          </button>

          <ImagePreview images={optimizedImages} />

          {optimizedImages.length > 0 && (
            <button
              onClick={downloadAll}
              disabled={downloading}
              className='bg-green-500 text-white px-4 py-2 rounded mt-4'
            >
              모두 다운로드
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

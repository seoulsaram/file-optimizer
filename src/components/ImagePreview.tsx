'use client';

export default function ImagePreview({ images }: { images: string[] }) {
  return (
    <div className='grid grid-cols-3 gap-4 mt-4'>
      {images.map((img: string, idx: number) => (
        <div key={idx} className='relative'>
          <img src={img} alt={`optimized-${idx}`} className='w-full h-auto' />
          <a
            href={img}
            download
            className='absolute bottom-1 right-1 bg-blue-500 text-white rounded p-1 text-xs'
          >
            다운로드
          </a>
        </div>
      ))}
    </div>
  );
}

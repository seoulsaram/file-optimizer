'use client';

import Image from 'next/image';
import React from 'react';

export default function ImageUpload({
  files,
  setFiles,
}: {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 10) {
      alert('최대 10장의 이미지만 업로드할 수 있습니다.');
      return;
    }
    setFiles([...selectedFiles]);
  };

  const handleRemove = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        type='file'
        accept='image/*'
        multiple
        onChange={handleChange}
        className='mb-4'
      />
      <div className='grid grid-cols-5 gap-4'>
        {files.map((file: File, idx: number) => (
          <div key={idx} className='relative'>
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              width={100}
              height={100}
              className='w-full h-auto'
            />
            <button
              onClick={() => handleRemove(idx)}
              className='absolute top-1 right-1 bg-red-500 text-white rounded p-1 text-xs'
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

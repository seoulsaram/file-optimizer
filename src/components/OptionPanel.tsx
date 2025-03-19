'use client';

interface OptionPanelProps {
  format: string;
  setFormat: (format: string) => void;
  quality: number;
  setQuality: (quality: number) => void;
}
export default function OptionPanel({
  format,
  setFormat,
  quality,
  setQuality,
}: OptionPanelProps) {
  return (
    <div className='flex gap-4 mb-4'>
      <div>
        <label>포맷</label>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className='ml-2 border px-2 py-1'
        >
          <option value='webp'>WebP</option>
          <option value='png'>PNG</option>
          <option value='jpeg'>JPEG</option>
        </select>
      </div>
      <div>
        <label>품질</label>
        <input
          type='range'
          min={10}
          max={100}
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
          className='ml-2'
        />
        <span className='ml-2'>{quality}%</span>
      </div>
    </div>
  );
}

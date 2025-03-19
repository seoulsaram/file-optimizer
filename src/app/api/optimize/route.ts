import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const files = formData.getAll('images') as File[];
  const format = formData.get('format') as string;
  const quality = Number(formData.get('quality'));

  const optimizedDir = path.join(process.cwd(), 'public', 'optimized');
  await fs.mkdir(optimizedDir, { recursive: true });

  const optimizedFiles: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `${Date.now()}-${file.name}`;
    const inputPath = path.join(optimizedDir, 'temp-' + filename);
    const outputPath = path.join(
      optimizedDir,
      filename.split('.')[0] + '.' + format
    );

    await fs.writeFile(inputPath, buffer);

    let command = `ffmpeg -y -i "${inputPath}"`;
    if (format === 'webp') {
      command += ` -qscale ${Math.floor(quality / 10)} "${outputPath}"`;
    } else if (format === 'png') {
      command += ` -compression_level ${Math.floor(
        (quality / 100) * 9
      )} "${outputPath}"`;
    } else {
      command += ` -qscale:v ${Math.floor(quality / 10)} "${outputPath}"`;
    }

    await execPromise(command);

    await fs.unlink(inputPath);

    optimizedFiles.push(`/optimized/${path.basename(outputPath)}`);
  }

  return NextResponse.json({ optimized: optimizedFiles });
}

import { NextRequest, NextResponse } from 'next/server';
import archiver from 'archiver';
import { PassThrough } from 'stream';
import path from 'path';
import fs from 'fs';
import { cleanUpOptimizedDir } from '../../../../utils/cleanupOptimizerDir';

export async function POST(req: NextRequest) {
  try {
    // 클라이언트에서 전달받은 최적화된 이미지 경로들
    const { optimizedImages } = await req.json();

    if (!optimizedImages || optimizedImages.length === 0) {
      return NextResponse.json(
        { error: 'No optimized images provided.' },
        { status: 400 }
      );
    }

    // 스트림과 아카이버 초기화
    const zipStream = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.pipe(zipStream);

    // 경로가 서버 디렉토리라고 가정, 예시로 'public/optimized' 하위에 저장되었다고 가정
    optimizedImages.forEach((relativePath: string) => {
      const absolutePath = path.join(process.cwd(), 'public', relativePath);

      if (fs.existsSync(absolutePath)) {
        const fileStream = fs.createReadStream(absolutePath);
        const fileName = path.basename(absolutePath);

        archive.append(fileStream, { name: fileName });
      } else {
        console.warn(`파일을 찾을 수 없음: ${absolutePath}`);
      }
    });

    // finalize() 호출 후 스트림 전송
    archive.finalize();
    await cleanUpOptimizedDir();

    return new NextResponse(zipStream as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="optimized_images.zip"',
      },
    });
  } catch (error) {
    console.error('ZIP 생성 오류:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

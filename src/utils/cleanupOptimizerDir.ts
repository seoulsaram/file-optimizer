import path from 'path';
import fs from 'fs/promises';

// 최대 허용 파일 수
const MAX_FILES = 10;

// 정리 함수
export async function cleanUpOptimizedDir() {
  try {
    const optimizedDir = path.join(process.cwd(), 'public', 'optimized');

    // 폴더가 존재하는지 확인 후 파일 목록 가져오기
    const files = await fs.readdir(optimizedDir);

    if (files.length <= MAX_FILES) {
      return; // 정리 필요 없음
    }

    // 파일 정보 가져오기 (이름 + mtime)
    const fileStats = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(optimizedDir, file);
        const stats = await fs.stat(filePath);
        return { file, mtime: stats.mtime };
      })
    );

    // 오래된 순으로 정렬
    fileStats.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

    // 삭제할 파일 개수 계산
    const filesToDelete = fileStats.length - MAX_FILES;

    // 삭제 실행
    for (let i = 0; i < filesToDelete; i++) {
      const filePath = path.join(optimizedDir, fileStats[i].file);
      await fs.unlink(filePath);
      console.log(`삭제 완료: ${fileStats[i].file}`);
    }
  } catch (error) {
    console.error('폴더 정리 실패:', error);
  }
}

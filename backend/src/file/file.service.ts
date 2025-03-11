import { Injectable } from '@nestjs/common';
import * as appRootPath from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import { FileResponse } from './file.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default',
  ): Promise<FileResponse[]> {
    try {
      const uploadFolder = `${appRootPath.path}/uploads/${folder}`;
      await ensureDir(uploadFolder);

      const res: FileResponse[] = await Promise.all(
        files.map(async (file) => {
          try {
            const uniqueName = `${uuid()}_${file.originalname}`;
            const filePath = `${uploadFolder}/${uniqueName}`;
            await writeFile(filePath, file.buffer);
            return {
              url: `/uploads/${folder}/${uniqueName}`,
              name: file.originalname,
            };
          } catch (error) {
            console.error(
              `Ошибка при сохранении файла: ${file.originalname}`,
              error,
            );
            throw new Error(`Не удалось сохранить файл: ${file.originalname}`);
          }
        }),
      );

      return res;
    } catch (error) {
      console.error('Ошибка при создании папки или сохранении файлов:', error);
      throw new Error('Не удалось сохранить файлы.');
    }
  }
}

import { Request, Response } from 'express';
import Busboy from 'busboy';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { uploadFileToStore } from '../context/file';
import { randomStr } from '.';

export const upload = (req: Request, callback, useRandomName: boolean = false) => {
  let saveToPath = null;
  let extension = null;
  let name = null;
  const busboy = Busboy({
    headers: req.headers,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  });
  busboy
    .on(
      'file',
      function (
        _name: string,
        file: NodeJS.ReadableStream,
        info: { filename: string; encoding: string; mimeType: string }
      ) {
        const randomFilename = randomStr(32);
        extension = info.mimeType.split('/')[1];
        name = info.filename;
        saveToPath = path
          .join(os.tmpdir(), randomFilename + '.' + extension)
          .toString();
        file.pipe(fs.createWriteStream(saveToPath));
      }
    )
    .on('finish', async function () {
      try {
        const urls = await uploadFileToStore(
          saveToPath,
          extension,
          useRandomName ? null : name
        );
        fs.unlink(saveToPath, () => {});
        if(callback) {
            callback(urls)
        }
        return urls;
      } catch (e) {
        console.error(e.toString());
        return null;
      }
    });
  return req.pipe(busboy);
};

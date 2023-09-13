import { Request, Response } from 'express';
import Busboy from 'busboy';
import os from 'os';
import path from 'path';
import fs from 'fs';
import { randomStr } from '../helpers';
import { removeFile, uploadFileToStore } from '../context/file';

export const upload_file = async (req: Request, res: Response) => {
  const contentLength = parseInt(req.headers['content-length'], 10);
  let saveToPath = null;
  let extension = null;
  if (contentLength >= 5 * 1024 * 1024) {
    res.status(413).send('Upload exceeds max size');
  }
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
        _name: string, file: NodeJS.ReadableStream, info: {filename: string, encoding: string, mimeType: string}
      ) {
        const randomFilename = randomStr(32);
        extension = info.mimeType.split('/')[1];
        saveToPath = path
          .join(os.tmpdir(), randomFilename + '.'+extension)
          .toString();
        file.pipe(fs.createWriteStream(saveToPath));
      }
    )
    .on('finish', async function () {
      try {
        const urls = await uploadFileToStore(saveToPath, extension);
        res.status(201).send(urls);
        fs.unlink(saveToPath, () => {});
      } catch (e) {
        console.error(e.toString());
        res.sendStatus(422);
      }
    });
  return req.pipe(busboy);
};

export const remove_file = async (req: Request, res: Response) => {
    try {
    const url = req.body.url as string
    const arr = url.split('/')
    const filename =  arr[arr.length-1]
    await removeFile(filename)
    res.status(200).send(url)
    } catch (e) {
        console.log(e)
        res.status(500).json(e)
    }
}
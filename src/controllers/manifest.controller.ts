import { Request, Response } from 'express';
import { removeFile } from '../context/file';
import { upload } from '../helpers/file';

export const create = async (req: Request, res: Response) => {
  const contentLength = parseInt(req.headers['content-length'], 10);
  if (contentLength >= 5 * 1024 * 1024) {
    res.status(413).send('Upload exceeds max size');
  }
  await upload(
    req,
    (urls: any) => {
      if (urls === null) {
        return res.status(422).json(urls);
      } else {
        return res.json(urls.url);
      }
    },
    true
  );
};

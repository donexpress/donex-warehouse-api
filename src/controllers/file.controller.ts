import { Request, Response } from 'express';
import { removeFile } from '../context/file';
import { upload } from '../helpers/file';

export const upload_file = async (req: Request, res: Response) => {
  const contentLength = parseInt(req.headers['content-length'], 10);
  if (contentLength >= 5 * 1024 * 1024) {
    res.status(413).send('Upload exceeds max size');
  }
  const result = upload(req, (urls: any) => {
    if(urls === null)  {
      return res.status(422).json(urls)
    }else  {
      return res.json(urls)
    }
  },true)
};

export const remove_file = async (req: Request, res: Response) => {
  try {
    const url = req.body.url as string;
    const arr = url.split('/');
    const filename = arr[arr.length - 1];
    await removeFile(filename);
    res.status(200).send(url);
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
};

import { randomStr } from '../helpers';
import oss from 'ali-oss';

export const uploadFileToStore = async (
  buffer: string,
  extension: string
) => {
  const bucket = 'warehouse-sav01ok';
  console.log(bucket, buffer, extension);
  const filename = randomStr(32) + '.' + extension;
  const store = new oss({
    region: 'oss-us-west-1',
    accessKeyId: process.env.ALIYUN_PUBLIC_KEY,
    accessKeySecret: process.env.ALIYUN_PRIVATE_KEY,
    bucket
  });
  const buckets = await store.listBuckets({})
  let exists = false
  for(let i = 0; i < buckets.length; i++) {
    if(buckets[i].name === bucket) {
        exists = true;
        i = buckets.length;
    }
  }
  if(!exists) {
    await store.putBucket(bucket)
    await store.putBucketACL(bucket, 'public-read')
  }
  const result = await store.put(filename, buffer)
  return {url: result.url, name: result.name}
//   const result = await store.initMultipartUpload(bucket);
  // return result.url;
};

export const removeFile = async(filename: string) => {
  const bucket = 'warehouse-sav01ok';
  const store = new oss({
    region: 'oss-us-west-1',
    accessKeyId: process.env.ALIYUN_PUBLIC_KEY,
    accessKeySecret: process.env.ALIYUN_PRIVATE_KEY,
    bucket
  });
  await store.delete(filename)
}

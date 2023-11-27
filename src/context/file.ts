import { randomStr } from '../helpers';
import oss from 'ali-oss';

export const uploadFileToStore = async (
  buffer: string,
  extension: string,
  name: string | null = null
) => {
  const bucket = 'warehouse-sav01ok';
  let tmp_extension: string = extension
  if(extension === "vnd.openxmlformats-officedocument.wordprocessingml.document") {
    tmp_extension = 'docx'
  } else if(extension === "vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    tmp_extension = 'xlsx'
  }
  console.log(bucket, buffer, tmp_extension);
  const filename = name === null ? randomStr(32) + '.' + tmp_extension : name + '.'+tmp_extension;
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
    const rules = [{
      // Specify the origin of allowed cross-origin requests. You can set the origin to a wildcard character (*) to allow requests from all regions. 
      allowedOrigin: '*',
      // Specify the methods that can be used to send cross-origin requests, including GET, PUT, DELETE, POST, and HEAD. 
      allowedMethod: 'GET',
      // Specify the response headers based on which cross-origin requests are allowed. We recommend that you use a wildcard character (*) unless otherwise specified. 
      allowedHeader: '*',
      // Specify the response headers for allowed access requests from applications, such as an XMLHttpRequest object in JavaScript. The wildcard character (*) is not supported. 
      exposeHeader: 'Content-Length',
      // Specify the period of time in which the browser can cache the response to an OPTIONS preflight request for specific resources. Unit: seconds. 
      maxAgeSeconds: '30'
},
];
    await store.putBucketCORS(bucket, rules)
    await store.putBucketACL(bucket, 'public-read')
  }
  const result = await store.put(filename, buffer)
  const url = result.url.replace('http://', 'https://')
  return {url, name: result.name}
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

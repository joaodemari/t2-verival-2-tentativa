import * as AWS from 'aws-sdk';
import { format } from 'date-fns/format';

export class S3Service {
  private s3: AWS.S3;

  constructor() {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_SECRET_ACCESS,
      secretAccessKey: process.env.AWS_ACCESS_KEY,
    });

    this.s3 = new AWS.S3();
  }

  async uploadFile(file: string, product_name: string) {
    const base64Data = file.replace(/^data:image\/(jpeg|png);base64/, '');
    const fileBuffer = Buffer.from(base64Data, 'base64');
    const dataFormata = format(new Date(), 'yyyy-MM-dd');
    const fileName = `${product_name}-${dataFormata}.jpg`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: 'image/jpeg',
    };

    this.s3.upload(params, (err: any) => {
      if (err) {
        console.error('Error uploading file:', err);
      } else {
        console.log('File uploaded successfully.');
      }
    });

    return `${process.env.AWS_S3_URL}/${fileName}`;
  }
}

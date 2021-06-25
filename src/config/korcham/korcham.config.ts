import { registerAs } from '@nestjs/config';
/* 한국 유통지식상품 뱅크 appkey config */
export default registerAs('korcham', () => ({
  appkey: process.env.APP_KEY,
  apiurl: process.env.API_URL,
}));

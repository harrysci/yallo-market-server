import { registerAs } from '@nestjs/config';

export default registerAs('gcp_mysql', () => ({
  host: process.env.GCP_MYSQL_HOST,
  port: process.env.GCP_MYSQL_PORT,
  username: process.env.GCP_MYSQL_USERNAME,
  password: process.env.GCP_MYSQL_PASSWORD,
  database: process.env.GCP_MYSQL_DATABASE,
}));

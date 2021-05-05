import { registerAs } from '@nestjs/config';

export default registerAs('mysql', () => ({
  host: process.env.RDS_MYSQL_HOST,
  port: process.env.RDS_MYSQL_PORT,
  username: process.env.RDS_MYSQL_USERNAME,
  password: process.env.RDS_MYSQL_PASSWORD,
  database: process.env.RDS_MYSQL_DATABASE,
}));

import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.host,
  port: process.env.port,
  username: process.env.username,
  password: process.env.password,
  database: process.env.database,
}));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = config_1.registerAs('gcp_mysql', () => ({
    host: process.env.GCP_MYSQL_HOST,
    port: process.env.GCP_MYSQL_PORT,
    username: process.env.GCP_MYSQL_USERNAME,
    password: process.env.GCP_MYSQL_PASSWORD,
    database: process.env.GCP_MYSQL_DATABASE,
}));
//# sourceMappingURL=configuration.js.map
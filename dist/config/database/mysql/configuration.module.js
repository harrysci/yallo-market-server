"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlConfigModule = void 0;
const Joi = require("@hapi/joi");
const common_1 = require("@nestjs/common");
const configuration_1 = require("./configuration");
const configuration_service_1 = require("./configuration.service");
const config_1 = require("@nestjs/config");
let MysqlConfigModule = class MysqlConfigModule {
};
MysqlConfigModule = __decorate([
    common_1.Module({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [configuration_1.default],
                validationSchema: Joi.object({
                    RDS_MYSQL_HOST: Joi.string(),
                    RDS_MYSQL_PORT: Joi.number().default(3306),
                    RDS_MYSQL_USERNAME: Joi.string().default('admin'),
                    RDS_MYSQL_PASSWORD: Joi.string().default('admin'),
                    RDS_MYSQL_DATABASE: Joi.string().default('mysql'),
                }),
            }),
        ],
        providers: [config_1.ConfigService, configuration_service_1.MysqlConfigService],
        exports: [config_1.ConfigService, configuration_service_1.MysqlConfigService],
    })
], MysqlConfigModule);
exports.MysqlConfigModule = MysqlConfigModule;
//# sourceMappingURL=configuration.module.js.map
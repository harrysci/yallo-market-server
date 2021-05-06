"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCPMysqlDatabaseProviderModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../../models/auth/entities/user.entity");
const configuration_service_1 = require("../../../config/database/mysql-dev/configuration.service");
const configuration_module_1 = require("../../../config/database/mysql-dev/configuration.module");
let GCPMysqlDatabaseProviderModule = class GCPMysqlDatabaseProviderModule {
};
GCPMysqlDatabaseProviderModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [configuration_module_1.GCPMysqlConfigModule],
                useFactory: async (gcpMysqlConfigService) => ({
                    type: 'mysql',
                    host: gcpMysqlConfigService.host,
                    port: gcpMysqlConfigService.port,
                    username: gcpMysqlConfigService.username,
                    password: gcpMysqlConfigService.password,
                    database: gcpMysqlConfigService.database,
                    entities: [
                        user_entity_1.User,
                    ],
                    synchronize: true,
                }),
                inject: [configuration_service_1.GCPMysqlConfigService],
            }),
        ],
    })
], GCPMysqlDatabaseProviderModule);
exports.GCPMysqlDatabaseProviderModule = GCPMysqlDatabaseProviderModule;
//# sourceMappingURL=provider.module.js.map
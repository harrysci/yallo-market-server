"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModule = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const auth_module_1 = require("../../models/auth/auth.module");
const auth_service_1 = require("../../models/auth/auth.service");
const provider_module_1 = require("../../providers/database/mysql/provider.module");
const seeder_1 = require("./seeder");
let SeederModule = class SeederModule {
};
SeederModule = __decorate([
    common_2.Module({
        imports: [provider_module_1.MysqlDatabaseProviderModule, auth_module_1.AuthModule],
        providers: [auth_service_1.AuthService, common_1.Logger, seeder_1.Seeder],
    })
], SeederModule);
exports.SeederModule = SeederModule;
//# sourceMappingURL=seeder.module.js.map
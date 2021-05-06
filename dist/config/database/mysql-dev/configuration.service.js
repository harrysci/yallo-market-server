"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GCPMysqlConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let GCPMysqlConfigService = class GCPMysqlConfigService {
    constructor(configService) {
        this.configService = configService;
    }
    get host() {
        return this.configService.get('gcp_mysql.host');
    }
    get port() {
        return this.configService.get('gcp_mysql.port');
    }
    get username() {
        return this.configService.get('gcp_mysql.username');
    }
    get password() {
        return this.configService.get('gcp_mysql.password');
    }
    get database() {
        return this.configService.get('gcp_mysql.database');
    }
};
GCPMysqlConfigService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], GCPMysqlConfigService);
exports.GCPMysqlConfigService = GCPMysqlConfigService;
//# sourceMappingURL=configuration.service.js.map
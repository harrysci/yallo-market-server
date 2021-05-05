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
exports.Seeder = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../models/auth/auth.service");
let Seeder = class Seeder {
    constructor(logger, authService) {
        this.logger = logger;
        this.authService = authService;
    }
    async seed() {
    }
};
Seeder = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [common_1.Logger,
        auth_service_1.AuthService])
], Seeder);
exports.Seeder = Seeder;
//# sourceMappingURL=seeder.js.map
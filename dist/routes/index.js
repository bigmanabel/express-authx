"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const users_routes_1 = __importDefault(require("./users.routes"));
const app_controller_1 = require("../controllers/app.controller");
const router = (0, express_1.Router)();
const appController = new app_controller_1.AppController();
router.get('/', (req, res) => {
    res.send(appController.getHello());
});
router.use('/auth', auth_routes_1.default);
router.use('/users', users_routes_1.default);
exports.default = router;

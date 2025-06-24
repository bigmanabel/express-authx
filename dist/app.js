"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const dotenv_1 = __importDefault(require("dotenv"));
const database_config_1 = require("./config/database.config");
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const routes_1 = __importDefault(require("./routes"));
// Load env variables
dotenv_1.default.config();
(0, database_config_1.connectMongo)().then(() => {
    const app = (0, express_1.default)();
    app.use((0, body_parser_1.json)());
    // mount routers
    app.use('/', routes_1.default);
    // error handling middleware
    app.use(errorMiddleware_1.default);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Express server running on http://localhost:${port}`);
    });
}).catch(error => console.error('MongoDB Connection Error:', error));

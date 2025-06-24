"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const boom_1 = __importDefault(require("@hapi/boom"));
function validationMiddleware(type, source = "body") {
    return async (req, res, next) => {
        try {
            const dto = (0, class_transformer_1.plainToClass)(type, req[source]);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                const errorMessages = errors.map((error) => ({
                    field: error.property,
                    errors: Object.values(error.constraints || {}),
                }));
                throw boom_1.default.badRequest("Validation failed", { errors: errorMessages });
            }
            // Replace the original data with the validated DTO
            req[source] = dto;
            next();
        }
        catch (error) {
            next(error);
        }
    };
}

import { Request, Response, NextFunction } from "express";
import { validate, ValidationError } from "class-validator";
import { plainToClass } from "class-transformer";
import Boom from "@hapi/boom";

export function validationMiddleware<T>(
  type: new () => T,
  source: "body" | "params" | "query" = "body"
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(type, req[source]);
      const errors: ValidationError[] = await validate(dto as object);

      if (errors.length > 0) {
        const errorMessages = errors.map((error) => ({
          field: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        throw Boom.badRequest("Validation failed", { errors: errorMessages });
      }

      // Replace the original data with the validated DTO
      req[source] = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}

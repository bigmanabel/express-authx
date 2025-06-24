import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsMongoId,
} from "class-validator";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @IsString({ message: "Password must be a string" })
  password: string;

  @IsEnum(Role, { message: "Role must be either regular or admin" })
  @IsOptional()
  role?: Role;
}

export class UpdateUserDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsOptional()
  email?: string;

  @IsString({ message: "Password must be a string" })
  @IsOptional()
  password?: string;

  @IsEnum(Role, { message: "Role must be either regular or admin" })
  @IsOptional()
  role?: Role;
}

export class UserParamsDto {
  @IsMongoId({ message: "ID must be a valid MongoDB ObjectId" })
  id: string;
}

import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.config';

export class JwtService {
    sign(payload: object, expiresIn: number): Promise<string> {
        return new Promise((resolve, reject) => {
            jwt.sign(
                payload,
                jwtConfig.secret,
                {
                    audience: jwtConfig.audience,
                    issuer: jwtConfig.issuer,
                    expiresIn,
                },
                (err, token) => {
                    if (err || !token) {
                        return reject(err);
                    }
                    resolve(token);
                }
            );
        });
    }

    verify<T>(token: string): Promise<T> {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                jwtConfig.secret,
                {
                    audience: jwtConfig.audience,
                    issuer: jwtConfig.issuer,
                },
                (err, decoded) => {
                    if (err) return reject(err);
                    resolve(decoded as T);
                }
            );
        });
    }
}

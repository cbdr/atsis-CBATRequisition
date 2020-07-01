import { injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';

export interface IOAuthJWT {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  nbf?: string;
  iat?: string;
  jti?: string;
  [propName: string]: any;
}

type JWTAlgorithm = 'HS512';

@injectable()
export default class JWT {
  public sign(payload: IOAuthJWT, secret: string, algorithm: JWTAlgorithm): string {
    return jwt.sign(payload, secret, { algorithm });
  }
}

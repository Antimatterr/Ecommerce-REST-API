import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

class JwtService {
  static sign(payload, expiry = '300s', secret = JWT_SECRET) {
    return jwt.sign(payload, secret, { expiresIn: expiry });
  }
  static verify(payload, secret = JWT_SECRET) {
    return jwt.verify(payload, secret);
  }
}

export default JwtService;
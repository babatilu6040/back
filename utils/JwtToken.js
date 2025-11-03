import "dotenv/config";
import jwt from "jsonwebtoken";

export class TokenGenrater {
  static accesstoken(email) {
    const payload = { email: email, type: "access" };
    const JWT_SECRET_KEY= process.env.JWT_SECRET || "pricely";
    const Accesstoken = jwt.sign(payload, JWT_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "2d",
    });

    return Accesstoken;
  }

  static refreshtoken(email) {
    const payload = { email: email, type: "refresh" };
    const JWT_SECRET_KEY= process.env.JWT_SECRET || "pricely";
    const RefreshToken = jwt.sign(payload, JWT_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    return RefreshToken;
  }
}

export class TokenVerifier {
  static VerifiyAccesstoken(accesstoken) {
    const JWT_SECRET_KEY= process.env.JWT_SECRET || "pricely";
    try {
      const Accesstoken = jwt.verify(accesstoken, JWT_SECRET_KEY);
      console.log(Accesstoken)
      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }
  static VerifiyRefreshtoken(refreshtoken) {
    const JWT_SECRET_KEY= process.env.JWT_SECRET || "pricely";
    try {
      const Refreshtoken = jwt.verify(refreshtoken, JWT_SECRET_KEY);
      console.log(Refreshtoken);
      return { valid: true };
    } catch (error) {
      return { valid: false };
    }
  }
}

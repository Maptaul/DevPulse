import jwt from "jsonwebtoken";
import config from "../config";

type TTokenPayload = {
  id: number;
  name: string;
  role: string | null;
  email: string;
};

type TGenerateTokens = {
  accessToken: string;
  refreshToken: string;
};

const generateTokens = (payload: TTokenPayload): TGenerateTokens => {
  const accessToken = jwt.sign(payload, config.secret!, {
    expiresIn: config.accessTokenExpiry,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(payload, config.refresh_secret!, {
    expiresIn: config.refreshTokenExpiry,
  } as jwt.SignOptions);

  return { accessToken, refreshToken };
};

const generateAccessToken = (payload: TTokenPayload): string => {
  return jwt.sign(payload, config.secret!, {
    expiresIn: config.accessTokenExpiry,
  } as jwt.SignOptions);
};

export { generateTokens, generateAccessToken, type TTokenPayload };

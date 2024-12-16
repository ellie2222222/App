import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import CustomException from "../exceptions/CustomException";
import StatusCodeEnum from "../enums/StatusCodeEnum";
import Database from "../utils/database";

dotenv.config();

class AuthService {
  private userRepository: UserRepository;
  private database: Database;

  constructor() {
    this.userRepository = new UserRepository();
    this.database = new Database();
  }

  /**
   * Generates an Access Token.
   *
   * @param attributes - The payload attributes to include in the token.
   * @returns The signed JWT as a string.
   */
  generateAccessToken = (attributes: Object): string => {
    try {
      const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET!;
      const accessTokenExpiration: string = process.env.ACCESS_TOKEN_EXPIRATION!;

      return jwt.sign(attributes, accessTokenSecret, {
        expiresIn: accessTokenExpiration,
      });
    } catch (error) {
      throw error;
    }
  };

  /**
   * Generates a Refresh Token.
   *
   * @param attributes - The payload attributes to include in the token.
   * @returns The signed JWT as a string.
   */
  generateRefreshToken = (attributes: Object): string => {
    try {
      const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET!;
      const refreshTokenExpiration: string = process.env.REFRESH_TOKEN_EXPIRATION!;

      return jwt.sign(attributes, refreshTokenSecret, {
        expiresIn: refreshTokenExpiration,
      });
    } catch (error) {
      throw error;
    }
  };

  /**
   * Refresh an Access Token.
   *
   * @param refreshToken - The refresh token string.
   * @returns A promise that resolves to the new JWT Access Token.
   */
  refreshAccessToken = async (refreshToken: string): Promise<string> => {
    try {
      const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET!;
  
      // Verify the refresh token
      const payload = jwt.verify(refreshToken, refreshTokenSecret);
  
      if (typeof payload === "object" && payload.userId) {
        const user = await this.userRepository.getUserById(payload.userId);
  
        if (!user) {
          throw new CustomException(StatusCodeEnum.Unauthorized_401, "User not found");
        }
  
        const timestamp = new Date().toISOString();
        const newPayload = { 
          userId: user._id, 
          email: user.email,
          timestamp,
        };
        return this.generateAccessToken(newPayload);
      }
  
      throw new CustomException(StatusCodeEnum.Unauthorized_401, "Invalid refresh token payload");
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        throw new CustomException(StatusCodeEnum.Unauthorized_401, "Token expired");
      } else if (error.name === "JsonWebTokenError") {
        throw new CustomException(StatusCodeEnum.Unauthorized_401, "Invalid refresh token");
      }
      throw error;
    }
  };  

  /**
   * Logs in a user and generates an access token.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves to the JWT if credentials are valid, or throws an error.
   */
  login = async (email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        throw new CustomException(StatusCodeEnum.BadRequest_400, "Invalid email or password");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!user || !isPasswordValid) {
        throw new CustomException(StatusCodeEnum.BadRequest_400, "Invalid email or password");
      }

      const timestamp = new Date().toISOString();
      const payload = { 
        userId: user._id, 
        email: user.email,
        timestamp,
      };
      const accessToken = this.generateAccessToken(payload);
      const refreshToken = this.generateRefreshToken(payload);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  };

  /**
   * Signs up a user and generates an access token.
   *
   * @param name - The user's name.
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves to the JWT if credentials are valid, or throws an error.
   */
  signup = async (name: string, email: string, password: string): Promise<void> => {
    const session = await this.database.startTransaction();
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);

      if (existingUser) {
        throw new CustomException(StatusCodeEnum.Conflict_409, "Email already exists");
      }

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      await this.userRepository.createUser({
        name,
        email,
        password: hashedPassword,
      }, session);

      await this.database.commitTransaction();
    } catch (error) {
      await this.database.abortTransaction();
      throw error;
    }
  };
}

export default AuthService;
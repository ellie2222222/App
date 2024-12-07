import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import CustomException from "../exceptions/CustomException";
import StatusCodeEnum from "../enums/StatusCodeEnum";

dotenv.config();

class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Generates a JSON Web Token.
   *
   * @param attributes - The payload attributes to include in the token.
   * @returns The signed JWT as a string.
   */
  generateAccessToken = (attributes: Object): string => {
    const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "secret";
    const accessTokenExpiration: string = process.env.ACCESS_TOKEN_EXPIRATION || "1d";

    return jwt.sign(attributes, accessTokenSecret, {
      expiresIn: accessTokenExpiration,
    });
  };

  /**
   * Logs in a user by verifying credentials and generating an access token.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves to the JWT if credentials are valid, or throws an error.
   */
  login = async (email: string, password: string): Promise<string> => {
    try {
      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        throw new CustomException(StatusCodeEnum.Conflict_409, "Email already exist");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new CustomException(StatusCodeEnum.BadRequest_400, "Invalid email or password");
      }

      const payload = { userId: user._id, email: user.email };
      const token = this.generateAccessToken(payload);

      return token;
    } catch (error) {
      throw error;
    }
  };

  signup = async (name: string, email: string, password: string): Promise<string> => {
    try {
      const existingUser = await this.userRepository.getUserByEmail(email);
    
      if (existingUser) {
        throw new CustomException(StatusCodeEnum.Conflict_409, "Email already exists");
      }
    
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
    
      const newUser = await this.userRepository.createUser({
        name,
        email,
        password: hashedPassword,
      });
    
      const payload = { userId: newUser._id, email: newUser.email };
      const token = this.generateAccessToken(payload);
    
      return token;
    } catch (error) {
      throw error;
    }
  };
  
}

export default AuthService;

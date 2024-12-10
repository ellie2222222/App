export interface User {
  name: string;
  role: number;
  avatar: string;
  googleId: string;
  appleUser: boolean;
  ipAddress: string;
  email: string;
  phoneNumber: string;
  password: string;
  lastLogin: Date;
  isActive: boolean;
  isVerified: boolean;
  verifyToken: string;
  passwordResetToken: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

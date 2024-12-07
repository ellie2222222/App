import mongoose, { Document } from "mongoose";
import UserModel from "../models/UserModel";
import { IUser } from "../models/interfaces/User/IUser";
import { IQuery } from "../models/interfaces/Query/IQuery";

class UserRepository {
  async createUser(
    data: Object,
    session?: mongoose.ClientSession
  ): Promise<IUser> {
    try {
      const user = await UserModel.create([{ ...data }], { session });
      
      return user[0];
    } catch (error: any) {
      throw new Error(`Error when creating user: ${error.message}`);
    }
  }

  async getUserById(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
      });

      return user;
    } catch (error: any) {
      throw new Error(`Error when finding user by id: ${error.message}`);
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email });

      return user;
    } catch (error: any) {
      throw new Error(`Error when finding user by email: ${error.message}`);
    }
  }

  async getUserByPhoneNumber(phoneNumber: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ phoneNumber });

      return user;
    } catch (error: any) {
      throw new Error(
        `Error when finding user by phone number: ${error.message}`
      );
    }
  }

  async deleteUserById(userId: string): Promise<boolean> {
    try {
      await UserModel.findByIdAndUpdate(userId, { isDeleted: true });

      return true;
    } catch (error: any) {
      throw new Error(`Error when deleting a user by id: ${error.message}`);
    }
  }

  async updateUserById(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    try {
      data = {
        ...data,
        updatedAt: new Date(),
      };

      const user = await UserModel.findByIdAndUpdate(userId, data, {
        new: true,
        select:
          "email fullName nickName avatar phoneNumber createdAt lastLogin",
      });

      return user;
    } catch (error: any) {
      throw new Error(`Error when updating user by id: ${error.message}`);
    }
  }

  async getUserByIdRepository(userId: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({
        _id: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
      });

      return user;
    } catch (error: any) {
      throw new Error(`Error when getting a user by id: ${error.message}`);
    }
  }

  async getAllUsersRepository(query: IQuery) {
    try {
      let { page, size, search, order, sortBy } = query;
      const searchQuery: { [key: string]: any } = {
        isDeleted: false,
      };

      if (search) {
        searchQuery.name = { $regex: search, $options: "i" };
      }

      let sortField = "createdAt";
      const sortOrder: 1 | -1 = order === "ascending" ? 1 : -1;

      if (sortBy === "date") sortField = "createdAt";

      const skip = (page - 1) * size;
      const users = await UserModel.aggregate([
        { $match: searchQuery },
        {
          $skip: skip,
        },
        {
          $limit: size,
        },
        {
          $project: {
            email: 1,
            fullName: 1,
            avatar: 1,
            phoneNumber: 1,
            createdAt: 1,
            updatedAt: 1,
            role: 1,
            lastLogin: 1,
          },
        },
        { $sort: { [sortField]: sortOrder } },
      ]);

      const totalUsers = await UserModel.countDocuments(searchQuery);

      return {
        users,
        page,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / size),
      };
    } catch (error: any) {
      throw new Error(`Error when getting all users: ${error.message}`);
    }
  }
}

export default UserRepository;

import mongoose from "mongoose";
import SessionModel from "../models/SessionModel";
import { ISession } from "../models/interfaces/Session/ISession";

class SessionRepository {
  /**
   * Create a new session entry.
   * @param sessionData - Object containing session details adhering to ISession.
   * @param session - Optional Mongoose client session for transactions.
   * @returns The created session document.
   * @throws Error when the creation fails.
   */
  async createSession(
    sessionData: Object,
    session?: mongoose.ClientSession
  ): Promise<ISession> {
    try {
      const result = await SessionModel.create([sessionData], { session });
      return result[0];
    } catch (error: any) {
      throw new Error(`Failed to create session: ${error.message}`);
    }
  }

  /**
   * Delete a session entry.
   * @param sessionId - The ID of the session to delete.
   * @param session - Optional Mongoose client session for transactions.
   * @returns Boolean indicating success or failure.
   * @throws Error when the deletion fails.
   */
  async deleteSession(
    sessionId: string,
    session?: mongoose.ClientSession
  ): Promise<boolean> {
    try {
      const result = await SessionModel.findOneAndDelete(
        { sessionId },
        { session }
      );

      return !!result; // Returns true if the session was deleted, false otherwise.
    } catch (error: any) {
      throw new Error(`Failed to delete session: ${error.message}`);
    }
  }

  /**
   * Delete multiple session entries for a user.
   * @param userId - The ID of the user whose sessions should be deleted.
   * @param session - Optional Mongoose client session for transactions.
   * @returns The number of sessions deleted.
   * @throws Error when the deletion fails.
   */
  async deleteSessionsByUserId(
    userId: string,
    session?: mongoose.ClientSession
  ): Promise<number> {
    try {
      const result = await SessionModel.deleteMany({ userId }, { session });
      
      return result.deletedCount || 0;
    } catch (error: any) {
      throw new Error(`Failed to delete sessions: ${error.message}`);
    }
  }

  /**
   * Find a session by its ID.
   * @param sessionId - The ID of the session to find.
   * @returns The found session document or null if not found.
   * @throws Error when the search fails.
   */
  async findSessionById(sessionId: string): Promise<ISession | null> {
    try {
      return await SessionModel.findOne({ sessionId });
    } catch (error: any) {
      throw new Error(`Failed to find session: ${error.message}`);
    }
  }

  /**
   * Find sessions by user ID.
   * @param userId - The ID of the user whose sessions to find.
   * @returns An array of session documents.
   * @throws Error when the search fails.
   */
  async findSessionsByUserId(userId: string): Promise<ISession[]> {
    try {
      return await SessionModel.find({ userId });
    } catch (error: any) {
      throw new Error(`Failed to find sessions for user: ${error.message}`);
    }
  }

  /**
   * Update sessions by session ID.
   * @param userId - The ID of the user whose sessions to find.
   * @returns An array of session documents.
   * @throws Error when the search fails.
   */
  async updateSession(
    sessionId: string,
    sessionData: Object,
    session?: mongoose.ClientSession
  ): Promise<boolean> {
    try {
      const result = await SessionModel.findByIdAndUpdate(
        { sessionId },
        sessionData
      );

      return !!result;
    } catch (error: any) {
      throw new Error(`Failed to find sessions for user: ${error.message}`);
    }
  }
}

export default SessionRepository;

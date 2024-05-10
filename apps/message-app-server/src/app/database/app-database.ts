import { Injectable } from '@nestjs/common';
import {
  ApplicationUser,
  ApplicationUserCreate,
  MessageChat,
  MessageCreate,
  MessageStored,
} from '@shared-types';

@Injectable()
export class AppDatabaseService {
  /**
   * storing application users, no delete even if user left
   */
  private storedUsers = new Map<string, ApplicationUser>();

  /**
   * storing messages, no delete even if user left
   */
  private storedMessages: MessageStored[] = [];

  /**
   *
   * @param message - message to add into the DB
   * @returns - message with user
   */
  async addMessage(message: MessageCreate): Promise<MessageChat> {
    // create object to save
    const storedMessage = {
      ...message,
      timestamp: Date.now(),
      messageId: Math.random().toString(36).substring(7), // random ID
    } satisfies MessageStored;

    // save message
    this.storedMessages.push(storedMessage);

    // create MessageChat
    const user = this.storedUsers.get(message.userId);
    const result = {
      ...storedMessage,
      user,
    } satisfies MessageChat;

    return result;
  }

  /**
   *
   * @param limit - number of messages to return
   * @param offset - offset of the messages
   * @returns - list of messages
   */
  async getMessages(offset: number, limit: number = 20): Promise<MessageChat[]> {
    return (
      this.storedMessages
        // reverse to get the latest messages first
        .reduce((acc, curr) => [curr, ...acc], [] as MessageStored[])
        .slice(offset, offset + limit)
        .map((message) => {
          const user = this.storedUsers.get(message.userId);
          return {
            ...message,
            user,
          } satisfies MessageChat;
        })
    );
  }

  /**
   *
   * @param user - user to add into the DB
   * @returns - created user in the DB
   */
  async addUser(user: ApplicationUserCreate): Promise<ApplicationUser> {
    // create object to save
    const storedUser = {
      ...user,
      userId: Math.random().toString(36).substring(7), // random ID
      isActive: true,
      lastActiveTimestamp: Date.now(),
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`, // random color
    } satisfies ApplicationUser;

    // save user
    this.storedUsers.set(storedUser.userId, storedUser);

    // return user
    return storedUser;
  }

  /**
   *
   * @param userId - user ID to deactivate
   * @returns - true if user was deactivated, false if user was not found
   */
  async deactivateUser(userId: string): Promise<boolean> {
    const user = this.storedUsers.get(userId);
    if (!user) {
      return false;
    }

    // create object to save
    const updatedUser = {
      ...user,
      isActive: false,
      lastActiveTimestamp: Date.now(),
    } satisfies ApplicationUser;

    // save user
    this.storedUsers.set(userId, updatedUser);

    return true;
  }

  /**
   *
   * @returns - list of last active users
   */
  async getLastActiveUsers(): Promise<ApplicationUser[]> {
    return Array.from(this.storedUsers.values())
      .filter((user) => user.isActive)
      .sort((a, b) => b.lastActiveTimestamp - a.lastActiveTimestamp)
      .slice(0, 10);
  }

  /**
   *
   * @param username - username to search for
   * @returns - user with the username
   */
  async getUserByUsername(username: string): Promise<ApplicationUser[]> {
    return Array.from(this.storedUsers.values()).filter((user) => user.username.startsWith(username));
  }
}

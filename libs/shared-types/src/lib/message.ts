import { ApplicationUser } from './user';

export type MessageCreate = {
  /**
   * user id of the user who created the message
   */
  userId: string;
  /**
   * content of the message
   */
  content: string;
};

export type MessageStored = MessageCreate & {
  /**
   * timestamp when the message was created
   */
  timestamp: number;
};

export type MessageChat = MessageStored & {
  /**
   * reference to the user who created the message
   */
  user?: ApplicationUser;
};

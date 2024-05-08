export type ApplicationUserCreate = {
  username: string;
  imageUrl: string;
};

export type ApplicationUser = ApplicationUserCreate & {
  userId: string;

  /**
   * flag to indicate if the user is active - still inside the chat
   */
  isActive: boolean;

  /**
   * timestamp when the user was last active
   */
  lastActiveTimestamp: number;
};

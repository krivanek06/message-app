import { MessageStored } from './message';
import { ApplicationUser } from './user';

export type ApplicationUserSearch = ApplicationUser & {
  lastMessage?: MessageStored;
};

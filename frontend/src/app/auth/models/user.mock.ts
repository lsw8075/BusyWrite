import { User } from './user';

const u1 = new User(1, "swpp@busywrite.kr", "iluvswpp");
const u2 = new User(2, "salad@busywrite.kr", "salad-swpp");
const u3 = new User(3, "busy@snu.ac.kr", "write");

const userList: Array<User> = [u1, u2, u3];
export { userList };

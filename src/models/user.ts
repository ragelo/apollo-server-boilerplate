import * as bcrypt from 'bcrypt';

import { UserRole } from '../graphql/types/user-role';

export interface User {
  id: number;
  roles: UserRole[];

  username: string;

  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
}

interface UserModel extends User {
  password?: string;
}

// TODO: Database
const users: UserModel[] = [{
  id: 1,
  roles: [UserRole.STANDART],
  username: 'user_1',
  password: '$2b$10$Xl5YGCDX9U.ebiuOZgrt2e/9D2aEEW0yWmYRm6plL2bz9TuSZSlrK', // user_1_pass
  createdAt: new Date().getTime() / 1000,
  updatedAt: new Date().getTime() / 1000,
}, {
  id: 2,
  roles: [UserRole.GUEST],
  username: 'guest',
  createdAt: new Date().getTime() / 1000,
  updatedAt: new Date().getTime() / 1000,
}, {
  id: 3,
  roles: [UserRole.STANDART],
  username: 'user_2',
  password: '$2b$10$Xl5YGCDX9U.ebiuOZgrt2eztYVexCg2f2Ml1VmaAn.qINBj30XxJm', // user_2_pass
  createdAt: new Date().getTime() / 1000,
  updatedAt: new Date().getTime() / 1000,
  deletedAt: new Date().getTime() / 1000,
}];

function deletePrivateData(user: UserModel): UserModel {
  return {
    id: user.id,
    roles: user.roles,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    deletedAt: user.deletedAt,
  };
}

export async function getUserById(id: number): Promise<User | undefined> {
  const foundUser = users.find(user => user.id === id);

  if (foundUser) {
    return deletePrivateData(foundUser);
  }
}

export async function checkUserPassword(username: string, password: string): Promise<User | undefined> {
  const foundUser = users.find(user => user.username === username);

  if (foundUser) {
    let hasAccess = true;

    if (foundUser.roles.indexOf(UserRole.GUEST) < 0 && foundUser.password) {
      try {
        hasAccess = await bcrypt.compare(password, foundUser.password);
      } catch (err) {
        hasAccess = false;
      }
    }

    if (hasAccess) {
      return deletePrivateData(foundUser);
    }
  }
}

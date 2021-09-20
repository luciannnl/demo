export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserDataWithCredentials extends UserData {
  password: string;
}

export interface UserRegistered extends UserData {
  _id: string;
}

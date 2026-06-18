
export interface IUser {
  id: string;
  email: string;
}

export interface ILoginRequest{
  email:string;
  password:string
}

export interface ILoginResponse {

    token:string;
    data: IUser
}
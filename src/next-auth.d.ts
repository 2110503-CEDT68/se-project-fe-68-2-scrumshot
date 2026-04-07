// After all my time using typescript I still have no idea what I'm looking at here.
import NextAuth, {DefaultSession, User as NextAuthUser} from 'next-auth'
import { Role } from './libs/types'

declare module "next-auth" {
  interface Session {
    user: {
      _id: string,
      name: string,
      email: string,
      role: string,
      tel: string,
      backendToken: string
    } 
  }
    
  interface User {
    _id: string,
    name: string,
    email: string,
    tel: string,
    role: Role,
    backendToken: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    _id: string;
    role: string;
    tel: string;
    backendToken: string;
  }
}
import { login } from "@/libs/auth";
import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (!credentials) return null;
        const data = await login(credentials.email, credentials.password);
        if (data.success) {
          return {
            _id: data.data._id,
            name: data.data.name,
            email: data.data.email,
            tel: data.data.tel,
            role: data.data.role,
            backendToken: data.token
          } as User;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/signin',
    error: '/signin'
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      return { 
        ...token,
        ...user
      };
    },
    
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    }
    
  }
}
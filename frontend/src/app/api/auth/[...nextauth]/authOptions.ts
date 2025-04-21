import { loginUser, registerUser } from "@/libraries/userAPI";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
        name: { label: "Name", type: "text", placeholder: "Name" },
        telephone: {
          label: "Telephone",
          type: "text",
          placeholder: "Telephone",
        },
        role: { label: "Role", type: "text", placeholder: "Role" },
      },
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }

        if (req.method === "POST" && req.body?.action === "register") {
          const { name, email, password, telephone, role } = credentials;
          const user = await registerUser(
            name,
            email,
            password,
            telephone,
            role
          );
          if (user) {
            return user;
          } else {
            return null;
          }
        } else {
          const user = await loginUser(credentials.email, credentials.password);

          if (user) {
            return user;
          } else {
            return null;
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    newUser: "/auth/register",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token as any;
      return session;
    },
  },
};

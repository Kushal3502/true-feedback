import { connectDB } from "@/lib/db";
import UserModel from "@/model/User.model";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Email",
      credentials: {
        email: {
          label: "Email",
          type: "email ",
          placeholder: "johndoe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const { email, password } = credentials;
        console.log(credentials);

        // connect database
        await connectDB();
        try {
          const user = await UserModel.findOne({
            email,
          });

          if (!user) throw new Error("User doesn't exist");

          if (!user.isVerified) throw new Error("Please verify your account");

          const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
          );

          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid credentials");
          }
        } catch (error) {
          throw new Error(error as any);
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }
      return session;
    },
  },
};

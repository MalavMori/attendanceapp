import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import FacultyModel from "../../db/models/facultySchema";
import StudentModel from "../../db/models/studentSchema";
import { cookies } from "next/headers";
import DB from "../../db/connectDB";

let usertype = "";

const makeRandomStr = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { jwt: true },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("usertype")) {
        usertype = url.replace("usertype=", "");
      }
      return baseUrl;
    },

    async signIn({ user, account, profile }) {
      if (usertype) {
        if (usertype == "faculty") {
          const userdb = await FacultyModel.findOne({ email: user.email });
          if (userdb) {
            await FacultyModel.updateOne(
              { email: user.email },
              {
                $set: {
                  profile_img: user.image,
                },
              }
            );
            const expires = new Date(Date.now() * 500);
            user.phoneNo = userdb.phoneNo;
            (await cookies()).set("user-type", "faculty", {
              expires: expires,
              httpOnly: true,
            });
            (await cookies()).set("user-department", userdb.department, {
              expires: expires,
              httpOnly: true,
            });
            return true;
          }
        } else if (usertype == "student") {
          const userdb = await StudentModel.findOne({ email: user.email });
          if (userdb) {
            await StudentModel.updateOne(
              { email: user.email },
              {
                $set: {
                  profile_img: user.image,
                },
              }
            );
            const expires = new Date(Date.now() * 500);
            (await cookies()).set("student-auth", makeRandomStr(50), {
              expires: expires,
              httpOnly: true,
            });
            (await cookies()).set("user-type", "student", {
              expires: expires,
              httpOnly: true,
            });
            (await cookies()).set("user-department", userdb.department, {
              expires: expires,
              httpOnly: true,
            });
            user.phoneNo = userdb.phoneNo;
            return true;
          }
        }
      }
      return false;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.usertype = usertype;
      session.accessToken = token.accessToken;
      session.jwttokan = jsonwebtoken.sign(
        session.user,
        process.env.NEXTAUTH_SECRET,
        { expiresIn: "2h" }
      );
      const expires = new Date(Date.now() + 7200000);
      (await cookies()).set("user-token", session.jwttokan, {
        expires: expires,
        httpOnly: true,
      });
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await axios.post("http://localhost:3001/api/auth/login", {
                        email: credentials?.email,
                        password: credentials?.password,
                    });

                    const user = res.data.user;
                    const token = res.data.token;

                    if (user && token) {
                        return { ...user, apiToken: token };
                    }
                    return null;
                } catch (e) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.apiToken = (user as any).apiToken;
                token.id = user.id;
                token.walletAddress = (user as any).walletAddress;
            }
            return token;
        },
        async session({ session, token }) {
            (session as any).apiToken = token.apiToken;
            (session as any).user.id = token.id;
            (session as any).user.walletAddress = token.walletAddress;
            return session;
        },
    },
    pages: {
        signIn: "/",
    },
});

export { handler as GET, handler as POST };

import NextAuthProvider from "@/providers/NextAuthProvider";
import "./global.css";
import TopMenu from "@/components/TopMenu";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";
import GlobalLoading from "./loading";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <NextAuthProvider session={session}>
          {/* <GlobalLoading /> */}
          <TopMenu />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}

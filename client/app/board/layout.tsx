import { UserStoreProvider } from "@/store/user-store-provider";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function BoardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  return (
    <div>
      <UserStoreProvider>
        <main>{children}</main>
      </UserStoreProvider>
    </div>
  );
}

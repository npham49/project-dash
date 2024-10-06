import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Board from "./board";
import { redirect } from "next/navigation";

export default async function Page() {
  const { isAuthenticated } = getKindeServerSession();

  if (!(await isAuthenticated())) {
    redirect("/api/auth/login");
  }

  return <Board />;
}

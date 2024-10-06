import Image from "next/image";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
import TestUserStore from "./board/test-user-store";

export default function Home() {
  return (
    <main>
      <h1>Welcome to the App</h1>
      <LoginLink>Login</LoginLink>
      <RegisterLink>Register</RegisterLink>
    </main>
  );
}

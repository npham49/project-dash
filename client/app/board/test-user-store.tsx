"use client";

import { useUserStore } from "../../store/user-store-provider";
import { useEffect } from "react";

export default function TestUserStore() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const clearUser = useUserStore((state) => state.clearUser);

  useEffect(() => {
    console.log("User state changed:", user);
  }, [user]);

  return (
    <div>
      <h2>User Store Test</h2>
      <p>First Name: {user.firstName || "Not set"}</p>
      <p>Last Name: {user.lastName || "Not set"}</p>
      <button onClick={() => setUser("John", "Doe")}>Set User</button>
      <button onClick={clearUser}>Clear User</button>
    </div>
  );
}

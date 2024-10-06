"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import * as apiService from "@/service/api-service";
import Board from "./board";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store-provider";
import { useEffect, useState } from "react";
import TestUserStore from "./test-user-store";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const setUser = useUserStore((state) => state.setUser);
  const { getAccessTokenRaw } = useKindeBrowserClient();
  const [loading, setLoading] = useState(true);

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const token = getAccessTokenRaw();
      if (!token) {
        throw new Error("Access token is null");
      }
      return apiService.getUser(token);
    },
  });

  useEffect(() => {
    if (userData && userData.data) {
      setUser(
        userData.data.id,
        userData.data.firstName,
        userData.data.lastName
      );
    }
    setLoading(false);
  }, [userData]);

  return (
    <div>
      <TestUserStore />
      {loading ? (
        <div>
          <Skeleton />
        </div>
      ) : (
        <Board />
      )}
    </div>
  );
}

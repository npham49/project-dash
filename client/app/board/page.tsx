"use client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import * as apiService from "@/service/api-service";
import Board from "./board";
import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/user-store-provider";
import { useEffect, useState } from "react";
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

  const { data: projectsData } = useQuery({
    queryKey: ["projects"],
    queryFn: () => {
      const token = getAccessTokenRaw();
      if (!token) {
        throw new Error("Access token is null");
      }
      return apiService.getProjects(token);
    },
  });

  useEffect(() => {
    if (userData && userData.data && projectsData && projectsData.data) {
      setUser(userData.data.firstName, userData.data.lastName);
      setLoading(false);
    }
  }, [userData, projectsData]);

  return (
    <div>
      {/* <TestUserStore /> */}
      {loading ? (
        <div>
          <Skeleton className="w-full h-[500px]" />
        </div>
      ) : (
        <Board projects={projectsData?.data} />
      )}
    </div>
  );
}

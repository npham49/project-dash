"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useUserStore } from "../store/user-store-provider";

export function UserButton() {
  const clearUser = useUserStore((state) => state.clearUser);
  const { user } = useKindeBrowserClient();
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <div className="relative w-8 h-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative w-8 h-8 cursor-pointer">
            {imageLoading && (
              <Skeleton className="w-8 h-8 rounded-full absolute" />
            )}
            {user?.picture && (
              <Image
                src={user?.picture || "/placeholder.png"}
                alt="User"
                width={32}
                height={32}
                className={`rounded-full ${imageLoading ? "invisible" : ""}`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <LogoutLink onClick={() => void clearUser()}>
            <DropdownMenuItem className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </LogoutLink>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

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

export function UserButton() {
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
            <Image
              src={user?.picture || ""}
              alt="User"
              width={32}
              height={32}
              className={`rounded-full ${imageLoading ? "invisible" : ""}`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <LogoutLink>
            <DropdownMenuItem className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </LogoutLink>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

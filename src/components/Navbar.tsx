"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

function Navbar() {
  const { data: session, status } = useSession();
  const { setTheme } = useTheme();

  return (
    <nav className="w-full flex justify-between items-center px-12 py-4 shadow-sm border border-b-gray-500">
      <Link href={"/"}>
        <h1 className="text-xl font-bold text-primary">True Feedback</h1>
      </Link>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {status === "authenticated" ? (
          <>
            <span className="">
              Welcome, {session.user.username}
            </span>
            <Button variant="destructive" onClick={() => signOut()}>
              Signout
            </Button>
          </>
        ) : (
          <Link href={"/signin"}>
            <Button>Signin</Button>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

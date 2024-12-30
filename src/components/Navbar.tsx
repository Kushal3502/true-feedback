"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="w-full flex justify-between items-center px-12 py-4 shadow-sm border border-b-gray-500">
      <Link href={"/"}>
        <h1 className="text-xl font-bold text-primary">True Feedback</h1>
      </Link>
      <div className="flex items-center gap-4">
        {status === "authenticated" ? (
          <>
            <span className="text-gray-200">
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

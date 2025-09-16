import React from "react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ScrollButton from "../helper/ScrollButton";
import Link from "next/link";
import Image from "next/image";

const Header = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 ">
          <Link href={"/"} className="flex items-center space-x-2">
            <Image
              src="/images/logo.png"
              alt="AI Humanizer Logo"
              width={32}
              height={32}
              className="w-28 h-15 object-contain ml-12"
            />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-8">
          <ScrollButton
            targetId="home"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Home
          </ScrollButton>
          <ScrollButton
            targetId="features"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Features
          </ScrollButton>
          <ScrollButton
            targetId="pricing"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Pricing
          </ScrollButton>
        </nav>

        <div className="flex items-center space-x-4">
          {session ? (
            <Link
              href={"/dashboard"}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <>
              <Button variant="ghost" className="text-gray-600">
                <Link href={"/auth"}>Login</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href={"/auth"}>Create Account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

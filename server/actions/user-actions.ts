"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

import { redirect } from "next/navigation";

export async function syncUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const exisitingUser = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (exisitingUser) return exisitingUser;

  const dbUser = await prisma.user.create({
    data: {
      clerkId: userId,
      name: `${user.firstName || ""} ${user.lastName || ""}`,
      email: user.emailAddresses[0].emailAddress,
      image: user.imageUrl,
    },
  });

  return dbUser;
}

export async function getCurrentUser() {
  const user = await syncUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { getCurrentUser } from "@/server/actions/user-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user) await getCurrentUser();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 py-3 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

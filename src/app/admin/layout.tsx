import clsx from "clsx";
import type { Metadata } from "next";
import { Mulish } from "next/font/google";

import "../globals.css";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { AppHeader } from "./components/ui/header";
// import { LoadingProvider } from "@/context/loading-context";
import { Toaster } from "sonner";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Disstrikt Admin Panel",
  description: "Admin panel for Disstrikt management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body
      className={clsx(
        "dark",
        mulish.variable,
        "antialiased",
        "font-kodchasan",
        "overflow-auto",
        "overflow-custom",
        "bg-neutral-900"
      )}
    >
      {" "}
      <Toaster position="top-right" />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="min-h-screen flex flex-col bg-neutral-900">
            <AppHeader />
            <div className="relative flex-1 flex flex-col gap-4 py-6 px-4 md:py-10 md:px-7 md:gap-7">
              <div
                aria-hidden
                className="
          pointer-events-none
          absolute 
          h-full w-full
          left-1/2 top-[10px] -translate-x-1/2 bg-rose-200/20 blur-[250px]
        "
              />
              {/* Content Layer */}
              <div className="relative z-10">{children}</div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </body>
  );
}

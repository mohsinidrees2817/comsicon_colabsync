
import { EnvVarWarning } from "@/components/env-var-warning";
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { useGlobalContext } from "@/context/Globalcontext";
import { GlobalProvider } from "@/context/Globalcontext";
import Header from "@/components/Header"; // the full version you gave above

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Aimless",
  description: "a project by aimless for the aimless to be aimless",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >

          <GlobalProvider>
            <main className="min-h-screen flex flex-col items-center ">

              <div className="flex-1 w-full flex flex-col gap-20 items-center  mx-auto">
                {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                  <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                    <div className="flex gap-5 items-center font-semibold">
                      <Link href={"/"}>Aimless Inc.</Link>
                    </div>
                    <div className="flex gap-5 items-center">
                      {!hasEnvVars ? <EnvVarWarning /> : <HeaderAuth />}

                      <ThemeSwitcher />
                    </div>
                  </div>
                </nav> */}
                <Header />

                <div className="flex flex-col gap-20 p-5 w-full max-w-[1200px]">
                  {children}
                </div>

                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  <p>
                    Powered by{" "}
                    <a
                      href="#"
                      target="_blank"
                      className="font-bold hover:underline"
                      rel="noreferrer"
                    >
                      Low Effort and three aimless log 😘💕
                    </a>
                  </p>
                </footer>
                <span className="animate"></span>
              </div>
            </main>
          </GlobalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

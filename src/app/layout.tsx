import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { FinanceProvider } from "@/context/FinanceContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navigation from "@/components/Navigation";
import ClientOnly from "@/components/ClientOnly";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AuthProvider } from "@/context/AuthContext";
import Image from "next/image";
import { SpinningTyre } from "@/components/SpinningTyre";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shift N Go Financial Tracker",
  description: "Track your car dealership metrics with balance sheets and financial unit management",
  icons: {
    icon: "/logo.png",
  },
};

// Inline script to prevent flash of wrong theme on page load
const themeScript = `
  (function() {
    try {
      var theme = localStorage.getItem('finance-theme') || 'system';
      var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) document.documentElement.classList.add('dark');
    } catch(e) {}
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-background text-foreground min-h-screen transition-colors duration-200`}
      >
        <GoogleAnalytics />
        <AuthProvider>
          <CurrencyProvider>
            <FinanceProvider>
              <ThemeProvider>
                <ClientOnly
                  fallback={
                    <nav className="bg-white dark:bg-neutral-900 shadow-lg border-b dark:border-neutral-700">
                      <div className="max-w-6xl mx-auto px-4">
                        <div className="flex justify-between items-center py-4">
                          <div className="flex items-center space-x-3">
                            <Image src="/logo.png" alt="Logo" width={32} height={32} />
                            <span className="text-xl font-bold text-brand-red hidden sm:block">Shift N Go</span>
                            <span className="text-lg font-bold text-brand-red sm:hidden">Shift N Go</span>
                          </div>
                        </div>
                      </div>
                    </nav>
                  }
                >
                  <Navigation />
                </ClientOnly>
                <main className="py-8 px-4">
                  {children}
                </main>
                <SpinningTyre />
              </ThemeProvider>
            </FinanceProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}




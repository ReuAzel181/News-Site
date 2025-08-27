import type { Metadata } from "next";
import { Libre_Caslon_Text } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SkipLink } from "@/components/ui/SkipLink";
import { cn } from "@/utils/cn";
import "./globals.css";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-caslon",
});

export const metadata: Metadata = {
  title: {
    default: "News Site - Your Trusted Source for News",
    template: "%s | News Site"
  },
  description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world. Your trusted source for reliable journalism.",
  keywords: ["news", "breaking news", "world news", "politics", "technology", "sports", "entertainment"],
  authors: [{ name: "News Site Team" }],
  creator: "News Site",
  publisher: "News Site",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "News Site",
    title: "News Site - Your Trusted Source for News",
    description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "News Site - Your Trusted Source for News",
    description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.",
    creator: "@newssite",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(libreCaslon.variable, 'font-serif antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300')}>
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <SkipLink href="#navigation">Skip to navigation</SkipLink>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          <SessionProvider>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

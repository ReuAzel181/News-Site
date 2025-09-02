import type { Metadata } from "next";
import { Libre_Caslon_Text } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { SkipLink } from "@/components/ui/SkipLink";
import { cn } from "@/utils/cn";
import "./globals.css";
import FaviconSwitcher from "@/components/layout/FaviconSwitcher";

const libreCaslon = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-caslon",
});

export const metadata: Metadata = {
  title: {
    default: "Veritas Bulletin - Your Trusted Source for News",
    template: "%s | Veritas Bulletin"
  },
  description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world. Your trusted source for reliable journalism.",
  keywords: ["news", "breaking news", "world news", "politics", "technology", "sports", "entertainment"],
  authors: [{ name: "Veritas Bulletin Team" }],
  creator: "Veritas Bulletin",
  publisher: "Veritas Bulletin",
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
    siteName: "Veritas Bulletin",
    title: "Veritas Bulletin - Your Trusted Source for News",
    description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veritas Bulletin - Your Trusted Source for News",
    description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.",
    creator: "@Veritas-Bulletin",
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
      <head>
        <link rel="icon" href="/favicon-light.svg" type="image/svg+xml" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/favicon-dark.svg" type="image/svg+xml" media="(prefers-color-scheme: dark)" />
        <link id="favicon" rel="icon" href="/favicon-light.svg" type="image/svg+xml" />
      </head>
      <body className={cn(libreCaslon.variable, 'font-serif antialiased')}>
        <FaviconSwitcher />
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <SkipLink href="#navigation">Skip to navigation</SkipLink>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
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

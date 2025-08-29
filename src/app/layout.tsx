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
    default: "BalitaPH - Your Trusted Source for News",
    template: "%s | BalitaPH"
  },
  description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world. Your trusted source for reliable journalism.",
  keywords: ["news", "breaking news", "world news", "politics", "technology", "sports", "entertainment"],
  authors: [{ name: "BalitaPH Team" }],
  creator: "BalitaPH",
  publisher: "BalitaPH",
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
    siteName: "BalitaPH",
    title: "BalitaPH - Your Trusted Source for News",
    description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BalitaPH - Your Trusted Source for News",
    description: "Stay informed with the latest news, breaking stories, and in-depth analysis from around the world.",
    creator: "@balitaph",
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
      <body className={cn(libreCaslon.variable, 'font-serif antialiased')}>
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

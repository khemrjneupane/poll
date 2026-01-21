import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layouts/Header";
import { GlobalProvider } from "./GlobalProvider";
import Footer from "@/components/layouts/Footer";
import QueryProvider from "./QueryProvider";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import AdSense from "@/components/google-ads/AdSense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VoteNepal-Home",
  description:
    "Vote Nepal - Your comprehensive platform for Nepal election information. Find candidates, voting centers, election results, and democratic participation tools.",
  openGraph: {
    title: "Nepal Election Information",
    description:
      "You can pre-vote your favourite candidate in Nepal's upcoming election",
    url: "https://www.votenepal.net",
    siteName: "Vote Nepal",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://votenepal.net",
  ),

  alternates: {
    canonical: "https://www.votenepal.net",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-1833501068964247" />
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=AW-473921409"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'AW-473921409');
          `}
        </Script>
        {/* Google AdSense script */}
        <AdSense pId="1833501068964247" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalProvider>
          <QueryProvider>
            <Header />
            {children}
            <Analytics />
            <Footer />
          </QueryProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}

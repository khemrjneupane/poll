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
import { useFbq } from "@/hooks/useFbq";
import FbqTracker from "@/components/facebook_tracker/fbqTracker";

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
          src="https://www.googletagmanager.com/gtag/js?id=G-KJTS64MJ7W"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KJTS64MJ7W',
            gtag('config', 'AW-473921409');
            {
            page_title: 'VoteNepal-Home',
            page_location: window.location.href
          });
            
          `}
        </Script>
        {/* Google AdSense script */}
        <AdSense pId="1833501068964247" />
        {/* Meta Pixel */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');

      fbq('init', '1355751196286927');
      fbq('track', 'PageView');
    `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FbqTracker />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1355751196286927&ev=PageView&noscript=1"
          />
        </noscript>

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

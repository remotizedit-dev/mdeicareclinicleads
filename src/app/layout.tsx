import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Medicare Clinic Memorial Drive | Medical Clinic Near Me Calgary",
  description: "Looking for a medical clinic near me or an appointment near me in Calgary? Medicare Clinic Memorial Drive offers expert medical care, regular checkups, and prescription refills at 171 52 St SE Calgary, AB T2A 5H8.",
  keywords: ["clinic near me", "appointment near me", "medical clinic Calgary", "Medicare Clinic Memorial Drive", "doctor Calgary", "171 52 St SE Calgary"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-E7YY35SSLN"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-E7YY35SSLN');
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}

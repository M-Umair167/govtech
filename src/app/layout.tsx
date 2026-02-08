import type { Metadata } from "next";
// import { Inter, JetBrains_Mono } from "next/font/google"; // Disabled due to fetch error
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
// });

// const jetbrainsMono = JetBrains_Mono({
//   subsets: ["latin"],
//   variable: "--font-jetbrains-mono",
// });

export const metadata: Metadata = {
  title: "BrainBit | Deep Tech Testing",
  description: "Professional testing center",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

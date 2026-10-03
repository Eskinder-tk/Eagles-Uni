import "./globals.css";
import NavBar from "./Components/NavBar";
import { Geist } from 'next/font/google';
import { cn } from "@/lib/utils";
import Providers from "./ThemeProvider";
import Footer from "./Components/Footer";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans scroll-smooth", geist.variable)} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        
      </body>
    </html>
  );
}

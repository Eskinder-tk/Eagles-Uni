import "./globals.css";
import NavBar from "./Components/NavBar";
import { Graduate, Geist } from 'next/font/google';
import { cn } from "@/lib/utils";
import Providers from "./ThemeProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body>
        <Providers>
          <NavBar />
          {children}
        </Providers>
        
      </body>
    </html>
  );
}

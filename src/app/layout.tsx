
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import ContentContainer from "../components/ContentContainer/ContentContainer";
import localFont from "next/font/local";
import { ThemeProvider } from "@/context/ThemeContext";
import QueryProvider from "../providers/QueryProvider";
import { StytchProviders } from "../providers/StytchProvider"; 
import ScrollToTop from "@/components/ScrollToTop/ScrollToTop";
import { Toaster } from "react-hot-toast";
import DevNotice from "@/components/DevNotice/DevNotice";

export const myFont = localFont({
  src: "../../public/fonts/JosefinSans-VariableFont_wght.ttf",
  variable: "--font-myfont",
  display: "swap",
    preload: true, 
});


export const accentFont = localFont({
  src: "../../public/fonts/Teko-VariableFont_wght.ttf",
  variable: "--font-accentFont",
  display: "swap",
    preload: true, 
});

export const titleFont = localFont({
  src: "../../public/fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-titleFont",
  display: "swap",
    preload: true, 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${myFont.variable} ${accentFont.variable} ${titleFont.variable}`}>
      <body>
        <QueryProvider>
          <ThemeProvider>
            <SidebarProvider>
              <StytchProviders>
                <ScrollToTop />
                <Toaster />
                
                <Header />
                <Sidebar />
                <ContentContainer>{children}</ContentContainer>
         {/*        <Footer /> */}<DevNotice />
              </StytchProviders>
            </SidebarProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

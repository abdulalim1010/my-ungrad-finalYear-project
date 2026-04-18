import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import AcademicFooter from "./components/AcademicFooter";
import ChatBot from "./components/ChatBot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EEE Department - Academic Portal",
  description: "Department of Electrical & Electronic Engineering - Access course materials, notices, and academic resources",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        
        {children}
        <AcademicFooter/>
        <ChatBot />
      </body>
    </html>
  );
}

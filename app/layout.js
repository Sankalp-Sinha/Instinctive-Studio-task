// app/layout.js
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css"; 
import Navbar from '../components/navbar'; 

const geistSans = Geist({ 
  variable: "--font-geist-sans", 
  subsets: ["latin"], 
}); 
const geistMono = Geist_Mono({ 
  variable: "--font-geist-mono",
  subsets: ["latin"], 
}); 

export const metadata = { 
  title: "SecureSight Dashboard", 
  description: "CCTV Monitoring Software Dashboard", 
}; 

export default function RootLayout({ children }) {
  return ( 
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-900 text-white min-h-screen`}>
        <Navbar /> 
        <main className="container mx-auto p-4 flex-grow"> 
          {children}
        </main>
      </body> 
    </html>
  );
}
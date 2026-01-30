import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnimeNet Story Marketplace",
  description: "AI-Verified Story NFTs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f172a] text-white`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r border-slate-800 p-6 hidden md:block">
            <div className="text-2xl font-black text-orange-500 mb-10">ANIMENET</div>
            <nav className="space-y-6 text-slate-400">
              <div className="text-xs uppercase font-bold tracking-widest text-slate-500">Menu</div>
              <div className="cursor-pointer hover:text-white flex items-center gap-3">🏠 Dashboard</div>
              <div className="cursor-pointer hover:text-white flex items-center gap-3">🔥 Trending</div>
              <div className="cursor-pointer hover:text-white flex items-center gap-3">💎 Marketplace</div>
              <div className="text-xs uppercase font-bold tracking-widest text-slate-500 pt-6">Your Studio</div>
              <div className="cursor-pointer hover:text-white flex items-center gap-3">✍️ Write Mode</div>
              <div className="cursor-pointer hover:text-white flex items-center gap-3">📂 My Stories</div>
            </nav>
          </aside>
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
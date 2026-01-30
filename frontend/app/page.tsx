"use client";
import { useState } from "react";
import { useMint } from "@/hooks/useMint";
import { useGallery } from "@/hooks/useGallery";
import { useBuy } from "@/hooks/useBuy";
import {
  Search,
  BookOpen,
  TrendingUp,
  User,
  PenTool,
  CheckCircle,
  RefreshCcw,
} from "lucide-react";

export default function AnimeMarketplace() {
  const [view, setView] = useState("read");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hooks
  const { mintStory, loading: minting } = useMint();
  const { stories, loading: loadingGallery, refresh } = useGallery();
  const { buyStory } = useBuy();

  const handleMint = async () => {
    if (!title || !story) return alert("Fill in the fields!");
    const res = await mintStory(title, story);

    if (res.success) {
      alert("Minted successfully!");
      await refresh();
      setView("read");
      setTitle("");
      setStory("");
    } else {
      alert("Error: " + res.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* --- TOP NAVIGATION --- */}
      <nav className="border-b border-slate-800 px-8 py-4 flex items-center justify-between bg-[#1e293b] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BookOpen className="text-orange-500" size={28} />
          <span className="text-xl font-black text-orange-500 italic tracking-tighter uppercase">
            ANIMENET
          </span>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setView("read")}
            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${view === "read" ? "bg-orange-500 text-white shadow-lg" : "text-slate-400"}`}
          >
            MARKETPLACE
          </button>
          <button
            onClick={() => setView("write")}
            className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${view === "write" ? "bg-orange-500 text-white shadow-lg" : "text-slate-400"}`}
          >
            CREATOR STUDIO
          </button>
        </div>

        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="bg-slate-800 border border-slate-700 px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-slate-700 transition-colors"
        >
          <User size={14} className="text-orange-500" />
          {isLoggedIn ? "0xdA4f...07De" : "Connect Wallet"}
        </button>
      </nav>

      <main className="p-8 max-w-7xl mx-auto">
        {view === "read" ? (
          <>
            {/* HERO SECTION */}
            <div className="h-56 w-full bg-linear-to-br from-indigo-900 via-slate-900 to-orange-900/20 rounded-3xl mb-12 p-10 flex flex-col justify-center border border-slate-700 shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <span className="bg-orange-500 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase mb-3 inline-block">
                  ON-CHAIN INTEGRITY
                </span>
                <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                  AI Verified <br />
                  Originals
                </h1>
              </div>
              <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-20 scale-150 pointer-events-none">
                <BookOpen size={160} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black flex items-center gap-2 uppercase tracking-tighter italic">
                <TrendingUp className="text-orange-500" /> Live Feed
              </h2>
              <button
                onClick={() => refresh()}
                className="text-slate-500 hover:text-orange-500 transition-colors"
                title="Refresh feed"
              >
                <RefreshCcw
                  size={18}
                  className={loadingGallery ? "animate-spin" : ""}
                />
              </button>
            </div>

            {loadingGallery ? (
              <div className="flex flex-col items-center justify-center py-32 text-slate-500">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="uppercase font-black text-[10px] tracking-[0.3em]">
                  Querying Blockchain Nodes...
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stories.map((s: any) => (
                  <div
                    key={s.id}
                    className="bg-[#1e293b] rounded-2xl border border-slate-800 p-4 hover:border-orange-500/50 transition-all group flex flex-col shadow-xl"
                  >
                    <div className="h-44 bg-slate-900 rounded-xl mb-4 relative overflow-hidden">
                      <img
                        src={s.image}
                        alt="cover"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-black/80 text-orange-500 text-[9px] font-black px-2 py-1 rounded flex items-center gap-1 border border-orange-500/30 backdrop-blur-sm">
                        <CheckCircle size={10} /> AI VERIFIED
                      </div>
                    </div>
                    <h3 className="font-bold text-lg truncate uppercase tracking-tight text-slate-100">
                      {s.name}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 italic mb-4">
                      {s.description ||
                        "An immutable record of digital creativity."}
                    </p>
                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-800">
                      <span className="text-orange-500 font-black tracking-tighter text-xl">
                        0.5 POL
                      </span>
                      <button
                        onClick={() => buyStory(s.id, "0.5")}
                        className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                      >
                        BUY NFT
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* --- CREATOR STUDIO --- */
          <div className="max-w-3xl mx-auto bg-[#1e293b] p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-orange-500 p-3 rounded-2xl shadow-lg shadow-orange-500/20">
                <PenTool className="text-white" size={32} />
              </div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                Creator Studio
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
                  Project Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="NAME YOUR STORY..."
                  className="w-full bg-[#0f172a] border border-slate-700 p-5 rounded-2xl font-bold outline-none focus:border-orange-500 transition-colors text-lg"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2 block">
                  Story Narrative
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="PASTE YOUR CONTENT FOR AI VERIFICATION..."
                  className="w-full bg-[#0f172a] border border-slate-700 p-6 rounded-2xl h-72 outline-none focus:border-orange-500 leading-relaxed text-slate-300 resize-none"
                ></textarea>
              </div>

              <button
                disabled={minting}
                onClick={handleMint}
                className={`w-full py-6 rounded-2xl font-black text-2xl uppercase italic tracking-tighter transition-all relative overflow-hidden ${minting ? "bg-slate-700 cursor-wait" : "bg-blue-600 hover:bg-blue-500 shadow-2xl shadow-blue-900/40 active:scale-95"}`}
              >
                {minting ? (
                  <div className="flex items-center justify-center gap-3">
                    <RefreshCcw className="animate-spin" />
                    <span>Analyzing Integrity...</span>
                  </div>
                ) : (
                  "Verify & Mint NFT"
                )}
              </button>
              <p className="text-center text-slate-600 text-[9px] uppercase font-black tracking-[0.3em]">
                SECURED BY POLYGON AMOY NETWORK
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

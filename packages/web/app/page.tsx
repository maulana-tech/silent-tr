"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="font-sans antialiased selection:bg-[#c5a059]/30 bg-[#0a0a0a] text-white min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        .grid-bg {
          background-size: 40px 40px;
          background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0);
        }
        .glow-effect {
          position: absolute;
          filter: blur(120px);
          z-index: 0;
          opacity: 0.15;
          pointer-events: none;
        }
        .feature-card {
          background: linear-gradient(145deg, rgba(25,25,25,1) 0%, rgba(15,15,15,1) 100%);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .accordion-item[open] summary svg {
          transform: rotate(180deg);
        }
        .premium-shadow {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(197, 160, 89, 0.05);
        }
      `}} />
      {/* Google font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
      <div style={{fontFamily: "'Inter', sans-serif"}}>
        <div className="[&_.font-serif]:![font-family:'Playfair_Display',_serif]">
          
{/* BEGIN: Navigation */}
<nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
<div className="flex items-center space-x-2" data-purpose="logo">
<div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
<span className="text-white font-bold text-xs">ST</span>
</div>
<span className="text-xl font-bold tracking-tight">Silent Tracker</span>
</div>
<div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-400">
<a className="hover:text-white transition-colors" href="/dashboard">Dashboard</a>
<a className="hover:text-white transition-colors" href="/trending">Trending</a>
<a className="hover:text-white transition-colors" href="/radar">Token Radar</a>
<a className="hover:text-white transition-colors" href="#features">Features</a>
</div>
<div className="flex items-center space-x-6">
<a className="text-sm font-medium text-gray-400 hover:text-white transition-colors" href="/dashboard">Dashboard</a>
<a className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors" href="/dashboard">Launch App</a>
</div>
</div>
</nav>
{/* END: Navigation */}
<main className="relative pt-20">
{/* Ambient Background Effects */}
<div className="glow-effect top-0 left-1/4 w-[500px] h-[500px] bg-blue-600"></div>
<div className="glow-effect top-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600"></div>
<div className="grid-bg absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
{/* BEGIN: Hero Section */}
<section className="relative pt-20 pb-32 overflow-hidden px-6">
<div className="max-w-4xl mx-auto text-center relative z-10">
<div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1 mb-8">
<span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Live</span>
<span className="text-xs text-gray-400">Real-time token intelligence powered by Birdeye API →</span>
</div>
<h1 className="text-5xl md:text-7xl font-serif leading-tight mb-8">
        Token Intelligence <br/> Dashboard for Web3
      </h1>
<p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
        Discover, analyze, and track tokens with AI-powered insights. Real-time data from Birdeye API with instant liquidity tracking and security analysis.
      </p>
<Link href="/dashboard" className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-8 py-4 rounded-lg font-medium hover:bg-cyan-500/20 transition-all">
        Launch Dashboard
      </Link>
</div>
{/* BEGIN: Hero Dashboard Mockup */}
<div className="mt-24 max-w-6xl mx-auto relative group">
<div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
<div className="relative bg-[#0f0f0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl premium-shadow">
{/* Mockup Toolbar */}
<div className="h-12 border-b border-white/5 flex items-center px-4 space-x-2">
<div className="w-3 h-3 rounded-full bg-red-500/50"></div>
<div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
<div className="w-3 h-3 rounded-full bg-green-500/50"></div>
</div>
{/* Mockup Image */}
<img alt="Starlight Dashboard" className="w-full h-auto object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxZw76NbDAGOuz2q4TCoKGk9MFKGc9JlSM51VUBtpofc5H9Sgw9mUPgaH7zjWDvt0_6m5zUEPlNEHFgK85K-8bNU33l3tKYMSG1xA_ip9iN-bVX5KHPf2BKwBMjrpWhc6NvBxKNdTNMB0HMaOE9xQxsm45DN-hECcnlBASoKAOye-7YLzVeBGIKxhhW777RqAP99gbu2E7RQ0LcX5px59A3UrmRYSXTSWzIQ_0Fcuwfwtw7C3gMrlwD2IyCu9in9F_YSCSa_Zflgi7"/>
</div>
{/* Floating Elements for Visual Interest */}
<div className="absolute -top-12 -left-12 w-16 h-16 bg-blue-500/30 rounded-lg blur-xl animate-pulse"></div>
<div className="absolute -bottom-12 -right-12 w-24 h-24 bg-[#c5a059]/20 rounded-full blur-2xl"></div>
</div>
{/* END: Hero Dashboard Mockup */}
{/* Partner Logos */}
<div className="mt-24 max-w-5xl mx-auto px-6">
<p className="text-center text-xs font-bold uppercase tracking-widest text-gray-500 mb-10">Powered by industry-leading data providers</p>
<div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
<span className="text-xl font-bold">BIRDEYE</span>
<span className="text-xl font-bold">ChainGPT</span>
<span className="text-xl font-bold">ETHEREUM</span>
<span className="text-xl font-bold">SOLANA</span>
<span className="text-xl font-bold">BASE</span>
</div>
</div>
</section>
{/* END: Hero Section */}
{/* BEGIN: Core Features */}
<section className="py-24 px-6 relative">
<div className="max-w-6xl mx-auto space-y-32">
{/* Feature 1: Unified Crypto & Fiat */}
<div className="grid md:grid-cols-2 gap-16 items-center">
<div>
<h2 className="text-4xl font-serif mb-6 leading-snug">Real-Time Token <br/> Discovery</h2>
<p className="text-gray-400 text-lg mb-8">
            Track new listings, trending tokens, and market movements across multiple chains in real-time.
          </p>
<div className="flex items-center space-x-4 opacity-60">
<span className="text-xs font-bold text-gray-500 uppercase">Supports:</span>
<span className="font-bold">ETHEREUM</span>
<span className="font-bold">SOLANA</span>
<span className="font-bold">BASE</span>
</div>
</div>
<div className="relative">
<div className="feature-card aspect-[1.49/1] rounded-2xl flex items-center justify-center overflow-hidden border-white/5 p-2 premium-shadow">
<img alt="Unified Treasury Interface" className="rounded-xl w-full h-full object-cover transition-transform duration-700 hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1wQZQcaRFq5tvZ4OiseCKbjLrLiDvNH3JSIQn8Ik_3jaGg9u57oYgvjfYyMBiG7lRkwZigdZbBYYSf8cP0QMDcVohYMkmveN3AcBDxfYioXl1syJED3J9ZFjtPYoAs32v5vMVN4NNpFFpgbiJoX-W-7zR63nfzMADJ4iAz7yFKJIyAKvyhETm7HcdNoh36UJQHQ08g8iB9VXlCdGMhsH81ooU2Gsb5c_xz90Z8vCymEFwilLwEt_NMuL0q8eGOqqfiHWR6B1A8f0B"/>
</div>
</div>
</div>
{/* Feature 2: Instant Liquidity */}
<div className="grid md:grid-cols-2 gap-16 items-center">
<div className="order-2 md:order-1 relative">
<div className="feature-card aspect-video rounded-2xl flex items-center justify-center p-8 border-white/5">
{/* Abstract Icon Representation */}
<div className="relative flex items-center justify-center w-full h-full">
<div className="w-20 h-20 bg-blue-500/10 border border-blue-500/20 rounded-xl absolute -left-10 flex items-center justify-center">
<span className="text-blue-400 font-bold">$</span>
</div>
<div className="w-24 h-24 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-xl z-10 flex items-center justify-center">
<svg className="w-12 h-12 text-[#c5a059]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
</div>
<div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-xl absolute -right-10 flex items-center justify-center">
<span className="text-purple-400 font-bold">Ξ</span>
</div>
</div>
</div>
</div>
<div className="order-1 md:order-2">
<h2 className="text-4xl font-serif mb-6 leading-snug">AI-Powered Analysis</h2>
<p className="text-gray-400 text-lg mb-8">
            Get instant risk assessments and token insights powered by ChainGPT AI.
          </p>
<ul className="space-y-4">
<li className="flex items-center text-sm text-gray-300">
<div className="w-5 h-5 rounded-full border border-cyan-400 flex items-center justify-center mr-3">
<div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
</div>
              Automated risk level scoring (HIGH/MEDIUM/LOW)
            </li>
<li className="flex items-center text-sm text-gray-300">
<div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center mr-3"></div>
              Security analysis: honeypot, mint, freeze detection
            </li>
<li className="flex items-center text-sm text-gray-300">
<div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center mr-3"></div>
              Custom analysis prompts for your own LLM
            </li>
</ul>
</div>
</div>
{/* Feature 3: Use Cases Grid */}
<div className="text-center">
<h2 className="text-4xl font-serif mb-6">Complete Token Intelligence Suite</h2>
<p className="text-gray-400 max-w-2xl mx-auto mb-16">
          Everything you need to discover, analyze, and track tokens across multiple blockchains in one unified dashboard.
        </p>
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
<div className="feature-card p-8 rounded-2xl border-white/5 group hover:border-cyan-400/30 transition-all">
<div className="w-12 h-12 bg-gray-800 rounded-lg mb-6 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
<svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
</div>
<h3 className="font-bold mb-2">New Listings</h3>
<p className="text-xs text-gray-500">Track fresh tokens as they launch</p>
</div>
<div className="feature-card p-8 rounded-2xl border-white/5 group hover:border-cyan-400/30 transition-all">
<div className="w-12 h-12 bg-gray-800 rounded-lg mb-6 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
<svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
</div>
<h3 className="font-bold mb-2">Trending Tokens</h3>
<p className="text-xs text-gray-500">Discover what's hot in the market</p>
</div>
<div className="feature-card p-8 rounded-2xl border-white/5 group hover:border-cyan-400/30 transition-all">
<div className="w-12 h-12 bg-gray-800 rounded-lg mb-6 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
<svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
</div>
<h3 className="font-bold mb-2">Security Scan</h3>
<p className="text-xs text-gray-500">Honeypot & risk detection</p>
</div>
<div className="feature-card p-8 rounded-2xl border-white/5 group hover:border-cyan-400/30 transition-all">
<div className="w-12 h-12 bg-gray-800 rounded-lg mb-6 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
<svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></path></svg>
</div>
<h3 className="font-bold mb-2">Price Charts</h3>
<p className="text-xs text-gray-500">Real-time and historical data</p>
</div>
</div>
</div>
</div>
</section>
{/* END: Core Features */}
{/* BEGIN: Grid Features */}
<section className="py-24 px-6 bg-[#0a0a0a] relative overflow-hidden">
<div className="glow-effect bottom-0 left-0 w-[800px] h-[800px] bg-indigo-900/40"></div>
<div className="max-w-6xl mx-auto relative z-10">
<div className="text-center mb-20">
<h2 className="text-4xl font-serif mb-4">A Few More Things You're Going To Love</h2>
<p className="text-gray-400">Silent Tracker is built from the ground up for token discovery and analysis across multiple chains.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{/* Small Grid Items */}
<div className="feature-card p-6 rounded-xl border-white/5 min-h-[200px] flex flex-col justify-between group overflow-hidden">
<div className="w-16 h-16 mb-4 relative">
<div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
<div className="relative w-full h-full overflow-hidden rounded-lg">
<img alt="Security Icon" className="w-full h-full object-cover scale-[2.2] translate-y-[-10%] translate-x-[-28%]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJowF-dmj76B_dtlFJx3_6cC7K8lc7sR-ed777Tn8UUx6abHx5qIG98cgQpxbNMPpjoiA2HnLHmHNpfIVvSauNEMfOwD4g5pZCrAdVeFIjwJASLa721GvhWbitPYdZd3S3nnxvtzWVlB60aNRbs_GkqpDMoGkkbXPvxp66Jld03jD3OpcJFnffFWeRed7QcSALlLUpMUJm5nvr2EwhXZa6hvhkHvAjKkGIljMwyeYrJJs3_PDAGyE8ZFHRvgXa4pHJ-vz4_lcO3AxM"/>
</div>
</div>
<h4 className="text-sm font-semibold">Real-Time Market Data</h4>
</div>
<div className="feature-card p-6 rounded-xl border-white/5 md:col-span-1 flex flex-col justify-between group overflow-hidden">
<div className="flex space-x-2">
<div className="px-2 py-1 bg-green-500/10 text-green-500 text-[10px] font-bold rounded">QB</div>
<div className="px-2 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded">XERO</div>
<div className="px-2 py-1 bg-green-400/10 text-green-400 text-[10px] font-bold rounded">SAGE</div>
</div>
<h4 className="text-sm font-semibold">Multi-Chain Support</h4>
</div>
<div className="feature-card p-6 rounded-xl border-white/5 row-span-2 flex flex-col">
<h4 className="text-sm font-semibold mb-4">Advanced Token Analytics</h4>
<div className="flex-grow flex items-center justify-center">
<img alt="Analytics" className="w-full opacity-60 rounded-lg premium-shadow" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLV3I3yTH3cFdTO76OtU9MsFKJ0mwfQ83NvE_Oge-f8LgWICvexq_g3ts5TUfZJDeWzN36unY8NTxhg0PdMP4QOsBISezJSoECrt13fJpm8GjaeEkHGu6P5CzhsNzIrB5WHcJTOFCdcMQVMS_YfgV0rmv4F8_qs2KOtfBHHdPoKVD9WHCBfhBrWyjSO0pF5KfDneLAlzRpVTKAxNLSC-vIuPR_zl6F1UUQVq6vAEyUBIlP5Ol1pK9rsxbsPmKTPqAkw6dcUcFIRieI"/>
</div>
</div>
<div className="feature-card p-6 rounded-xl border-white/5 overflow-hidden">
<div className="w-12 h-12 mb-4 relative">
<div className="absolute inset-0 bg-green-500/10 blur-lg rounded-full"></div>
<div className="relative w-full h-full overflow-hidden rounded-lg">
<img alt="Automation Icon" className="w-full h-full object-cover scale-[2.2] translate-y-[-10%] translate-x-[28%]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJowF-dmj76B_dtlFJx3_6cC7K8lc7sR-ed777Tn8UUx6abHx5qIG98cgQpxbNMPpjoiA2HnLHmHNpfIVvSauNEMfOwD4g5pZCrAdVeFIjwJASLa721GvhWbitPYdZd3S3nnxvtzWVlB60aNRbs_GkqpDMoGkkbXPvxp66Jld03jD3OpcJFnffFWeRed7QcSALlLUpMUJm5nvr2EwhXZa6hvhkHvAjKkGIljMwyeYrJJs3_PDAGyE8ZFHRvgXa4pHJ-vz4_lcO3AxM"/>
</div>
</div>
<h4 className="text-sm font-semibold mb-2">AI Token Analysis</h4>
<p className="text-xs text-gray-500">ChainGPT powered risk assessments.</p>
</div>
<div className="feature-card p-6 rounded-xl border-white/5 relative overflow-hidden group">
<h4 className="text-sm font-semibold z-10 relative">Token Security Scoring</h4>
<div className="absolute inset-0 translate-x-12 translate-y-8 opacity-40 group-hover:scale-105 transition-transform">
<img alt="Roles" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4QlrXUDnf1GyPRvE-8ISTAMnnExu5PSlxG0dTV0sSPJgy3v_Y8F_9lwBkGTWXWIO42tt-M0aezMDScWRdCm6v6fOhZGIhmT0GBjHWGHa8iZvL0Bq7r4Kvey3TUU9OKlCQ5Sj_mrgMbR34HSPhr_5UdRz7HAST81BgIl99Fy3Yxbj_Pcjr_QUJUToBqRzRl7wcVU-wZVgedKyeI3kZBetVwYX0ccbgAVU9TYDZFUxilOMCa9WTIgD066gFLIvAgiF7AdQjnhW_TkgD"/>
</div>
</div>
<div className="feature-card p-6 rounded-xl border-white/5 md:col-span-2 flex items-center justify-between group overflow-hidden">
<div>
<h4 className="text-sm font-semibold mb-2">External Data Links</h4>
<p className="text-xs text-gray-500">Etherscan, DEXScreener, Birdeye integration.</p>
</div>
<div className="flex items-center space-x-6">
<div className="w-12 h-12 relative overflow-hidden rounded-lg">
<img alt="Bank integration Icon" className="w-full h-full object-cover scale-[2.2] translate-y-[58%] translate-x-[-2%]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJowF-dmj76B_dtlFJx3_6cC7K8lc7sR-ed777Tn8UUx6abHx5qIG98cgQpxbNMPpjoiA2HnLHmHNpfIVvSauNEMfOwD4g5pZCrAdVeFIjwJASLa721GvhWbitPYdZd3S3nnxvtzWVlB60aNRbs_GkqpDMoGkkbXPvxp66Jld03jD3OpcJFnffFWeRed7QcSALlLUpMUJm5nvr2EwhXZa6hvhkHvAjKkGIljMwyeYrJJs3_PDAGyE8ZFHRvgXa4pHJ-vz4_lcO3AxM"/>
</div>
<div className="flex -space-x-2">
<div className="w-8 h-8 rounded-full bg-blue-600 border border-brand-dark"></div>
<div className="w-8 h-8 rounded-full bg-red-600 border border-brand-dark"></div>
<div className="w-8 h-8 rounded-full bg-green-600 border border-brand-dark"></div>
</div>
</div>
</div>
<div className="feature-card p-6 rounded-xl border-white/5">
<h4 className="text-sm font-semibold">Transaction History Tracking</h4>
</div>
</div>
</div>
</section>
{/* END: Grid Features */}
{/* BEGIN: FAQ */}
<section className="py-24 px-6 border-t border-white/5">
<div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
<div className="md:w-1/3">
<h2 className="text-3xl font-serif mb-6">Frequently Asked Questions</h2>
<p className="text-gray-400 text-sm mb-8">
          Have a question that is not answered? Visit our <a className="text-cyan-400 underline underline-offset-4" href="/dashboard">dashboard</a> or check the docs.
</p>
</div>
<div className="md:w-2/3 space-y-4">
<details className="accordion-item feature-card rounded-xl border-white/5 group">
<summary className="flex items-center justify-between p-6 cursor-pointer list-none">
<span className="font-medium text-sm">What is Silent Tracker?</span>
<svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</summary>
<div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed">
            Silent Tracker is a token intelligence dashboard that provides real-time data, AI-powered analysis, and security scanning for tokens across multiple blockchains including Ethereum, Solana, and Base.
          </div>
</details>
<details className="accordion-item feature-card rounded-xl border-white/5 group">
<summary className="flex items-center justify-between p-6 cursor-pointer list-none">
<span className="font-medium text-sm">Which chains are supported?</span>
<svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</summary>
<div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed">
            Currently supports Ethereum, Solana, Arbitrum, BSC, Polygon, and Base networks with real-time data from Birdeye API.
          </div>
</details>
<details className="accordion-item feature-card rounded-xl border-white/5 group">
<summary className="flex items-center justify-between p-6 cursor-pointer list-none">
<span className="font-medium text-sm">Is the AI analysis accurate?</span>
<svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</summary>
<div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed">
            AI analysis powered by ChainGPT provides risk assessments based on liquidity, volume, holder distribution, and security flags. Always DYOR (Do Your Own Research).
          </div>
</details>
<details className="accordion-item feature-card rounded-xl border-white/5 group">
<summary className="flex items-center justify-between p-6 cursor-pointer list-none">
<span className="font-medium text-sm">Is this a free tool?</span>
<svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path></svg>
</summary>
<div className="px-6 pb-6 text-sm text-gray-400 leading-relaxed">
            Yes! Silent Tracker is currently free to use. We use Birdeye's public API and ChainGPT for intelligence.
          </div>
</details>
</div>
</div>
</section>
{/* END: FAQ */}
{/* BEGIN: CTA Section */}
<section className="py-32 px-6 relative overflow-hidden">
<div className="absolute inset-0 bg-[#c5a059]/5 blur-3xl rounded-full translate-y-1/2"></div>
<div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
<div className="md:w-1/2">
<h2 className="text-5xl font-serif mb-6 leading-tight">Start Tracking.<br/>Right Now.</h2>
<p className="text-gray-400 text-lg mb-10">Get instant access to real-time token intelligence across multiple blockchains.</p>
<Link href="/dashboard" className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-8 py-4 rounded-lg font-medium hover:bg-cyan-500/20 transition-all">
          Launch Dashboard
        </Link>
</div>
<div className="md:w-1/2 relative">
<img alt="Starlight Premium Business Cards" className="w-full h-auto rounded-2xl shadow-2xl premium-shadow rotate-3 transform hover:rotate-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDXChI-P4RgS1N_OzsKLuNPWXYaDvOkLZTwK_L9Lw96I2wfOigOU9XP_pbxfJQEa5fgYl6s18359kT2zZHYo4hMApDTyFo8MXR7ndFIz47OTtJvWDU61T3q2VTlhQWN8FahgmhSN7aEP3_tMkWz7IWXCHsOhJE7NstR0_wKGhx7RW1NQDgGmJM1QIIp-1hNDYXQgtIWmUyxumhvQlXr-0JSNEkhbxk8rBMOfwcoIGyNzkuzA-6e_v72Q6ZtC967uy5KyTPnnea9AVY2"/>
</div>
</div>
</section>
{/* END: CTA Section */}
</main>
{/* BEGIN: Footer */}
<footer className="bg-[#0a0a0a] border-t border-white/5 pt-24 pb-12 px-6">
<div className="max-w-7xl mx-auto">
<div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-20">
<div className="col-span-2">
<div className="flex items-center space-x-2 mb-6">
<div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
<span className="text-white font-bold text-[10px]">ST</span>
</div>
<span className="text-lg font-bold">Silent Tracker</span>
</div>
<p className="text-xs text-gray-500 leading-relaxed max-w-xs">
          A token intelligence dashboard powered by Birdeye API and ChainGPT. Not financial advice. Always DYOR.
        </p>
<div className="mt-12 flex items-center space-x-2 text-[10px] uppercase tracking-widest text-green-500">
<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
<span>All systems operational</span>
</div>
</div>
<div>
<h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Product</h5>
<ul className="space-y-4 text-sm text-gray-500">
<li><a className="hover:text-white transition-colors" href="/dashboard">Dashboard</a></li>
<li><a className="hover:text-white transition-colors" href="/trending">Trending</a></li>
<li><a className="hover:text-white transition-colors" href="/radar">Token Radar</a></li>
<li><a className="hover:text-white transition-colors" href="/dashboard">Analytics</a></li>
</ul>
</div>
<div>
<h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Company</h5>
<ul className="space-y-4 text-sm text-gray-500">
<li><a className="hover:text-white transition-colors" href="#features">About</a></li>
<li><a className="hover:text-white transition-colors" href="https://github.com/maulana-tech/silent-tr">GitHub ↗</a></li>
<li><a className="hover:text-white transition-colors" href="https://birdeye.so">Birdeye API ↗</a></li>
<li><a className="hover:text-white transition-colors" href="https://chaingpt.org">ChainGPT ↗</a></li>
</ul>
</div>
<div>
<h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Resources</h5>
<ul className="space-y-4 text-sm text-gray-500">
<li><a className="hover:text-white transition-colors" href="/dashboard">Documentation</a></li>
<li><a className="hover:text-white transition-colors" href="/dashboard">API Reference</a></li>
<li><a className="hover:text-white transition-colors" href="#faq">FAQ</a></li>
</ul>
</div>
<div>
<h5 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Follow us</h5>
<ul className="space-y-4 text-sm text-gray-500">
<li><a className="hover:text-white transition-colors" href="#">Twitter ↗</a></li>
<li><a className="hover:text-white transition-colors" href="#">LinkedIn ↗</a></li>
<li><a className="hover:text-white transition-colors" href="#">AngelList ↗</a></li>
</ul>
</div>
</div>
<div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-tighter">
<div className="flex items-center space-x-4 mb-4 md:mb-0">
<span className="font-bold text-gray-400">Powered By</span>
<span>Birdeye API • ChainGPT • Next.js</span>
</div>
<span>© Silent Tracker 2026</span>
</div>
</div>
</footer>
{/* END: Footer */}

        </div>
      </div>
    </div>
  );
}

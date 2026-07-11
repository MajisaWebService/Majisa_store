import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-orange/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-brand-rose/10 blur-[120px]" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-brand-cyan mb-6">
          ✨ Premium Custom T-Shirts
        </span>
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
          Design Your Style, <br />
          <span className="text-gradient">Wear Your Identity.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
          Create customized high-quality T-shirts instantly. Add text, upload logos, customize placements, and see your creation on a real-time preview canvas.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/customize"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-brand-gradient hover:opacity-95 transform hover:-translate-y-0.5 transition-all shadow-lg shadow-brand-orange/20"
          >
            Start Customizing Now
          </Link>
          <Link
            href="#features"
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
          >
            Explore Features
          </Link>
        </div>

        {/* Feature grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {/* Feature 1 */}
          <div className="glass p-8 rounded-2xl text-left border border-white/5 hover:border-brand-orange/20 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
              👕
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Premium Quality Fabrics</h3>
            <p className="text-gray-400 leading-relaxed">
              We use 100% combed cotton and organic blends (up to 240 GSM) ensuring a soft touch, comfortable fit, and durability after washing.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="glass p-8 rounded-2xl text-left border border-white/5 hover:border-brand-rose/20 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-rose/10 flex items-center justify-center text-brand-rose font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
              🎨
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Interactive Visual Canvas</h3>
            <p className="text-gray-400 leading-relaxed">
              Add custom text layers, choose from google fonts, adjust sizes, and drag-and-drop uploaded logos with complete placement control.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="glass p-8 rounded-2xl text-left border border-white/5 hover:border-brand-cyan/20 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center text-brand-cyan font-bold text-xl mb-6 group-hover:scale-110 transition-transform">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Durable Prints & Fast Delivery</h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced digital direct-to-garment (DTG) printing offers vibrant colors that do not crack or peel, shipped to you in 3-5 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Highlight Mockups Section */}
      <section className="bg-brand-slate-950/40 py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
              Create a Design in <span className="text-gradient">Less Than 2 Minutes.</span>
            </h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-brand-orange text-lg">✓</span> Select T-shirt base type & color
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-brand-orange text-lg">✓</span> Enter custom text and choose fonts/colors
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-brand-orange text-lg">✓</span> Upload your own PNG/JPEG logo or graphic
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-brand-orange text-lg">✓</span> Place elements anywhere on front or back
              </li>
            </ul>
            <Link
              href="/customize"
              className="inline-block px-6 py-3 rounded-lg text-sm font-bold bg-white/5 hover:bg-brand-gradient hover:border-transparent transition-all border border-white/10"
            >
              Get Customizing
            </Link>
          </div>
          <div className="lg:w-1/2 relative flex justify-center">
            {/* Visual representation card */}
            <div className="glass p-6 rounded-3xl relative border border-white/10 max-w-sm w-full">
              <div className="aspect-square bg-slate-900 rounded-2xl mb-4 relative flex items-center justify-center overflow-hidden">
                {/* Simulated T-shirt image placeholder */}
                <div className="w-56 h-56 bg-slate-800 rounded-full flex items-center justify-center opacity-85">
                  👕
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-brand-orange/40 w-36 h-36 flex items-center justify-center">
                  <span className="text-[10px] text-brand-orange font-bold uppercase tracking-widest bg-slate-900/90 px-2 py-0.5 rounded">Print Area</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">Custom Classic Tee</h4>
                  <p className="text-xs text-gray-400">White / Size L</p>
                </div>
                <span className="text-brand-cyan font-bold text-sm">INR 499.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

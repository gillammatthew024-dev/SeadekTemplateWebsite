export function Footer() {
  return (
    <footer className="py-8 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="tracking-widest">
            PORTFOLIO
          </div>
          
          <p className="text-gray-400">
            © 2026 Portfolio. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

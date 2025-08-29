'use client';

export function NewsTicker() {
  const newsItems = [
    "Supreme Court declares Articles of Impeachment vs VP Sara Duterte as unconstitutional",
    "President Marcos addresses the nation on economic recovery plans",
    "Iglesia ni Cristo holds National Rally for Peace with 1.5 million attendees",
    "OFW remittances reach all-time high this quarter",
    "Renewable energy projects accelerate nationwide development",
    "Filipino scientists develop breakthrough cancer treatment",
    "Gilas Pilipinas prepares for FIBA World Cup qualifiers"
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .ticker-animation {
          animation: ticker-scroll 45s linear infinite;
        }
        .ticker-animation:hover {
          animation-play-state: paused;
        }
        .angled-edge {
          clip-path: polygon(0 0, calc(100% - 40px) 0, 100% 100%, 0 100%);
        }
      `}</style>
      <div className="bg-gray-300 dark:bg-gray-600 overflow-hidden h-12 flex items-center">
        {/* Breaking News Label with Angled Edge */}
        <div className="relative">
          <div className="bg-blue-500 dark:bg-blue-600 h-12 flex items-center px-6 pr-16 angled-edge">
            <span className="text-white font-bold text-sm uppercase tracking-wider whitespace-nowrap">
              Breaking News
            </span>
          </div>
        </div>
        
        {/* Ticker Content */}
        <div className="flex-1 overflow-hidden bg-gray-300 dark:bg-gray-600 h-12">
          <div className="flex items-center h-full ticker-animation">
            {newsItems.map((item, index) => (
              <div key={index} className="flex items-center">
                <span className="whitespace-nowrap text-black dark:text-white font-medium text-sm px-8">
                  {item}
                </span>
                <div className="w-1 h-1 bg-black/40 dark:bg-white/40 mx-4 flex-shrink-0"></div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {newsItems.map((item, index) => (
              <div key={`duplicate-${index}`} className="flex items-center">
                <span className="whitespace-nowrap text-black dark:text-white font-medium text-sm px-8">
                  {item}
                </span>
                <div className="w-1 h-1 bg-black/40 dark:bg-white/40 mx-4 flex-shrink-0"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

export function NewsTicker() {
  return (
    <>
      <style jsx global>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .ticker-animation {
          animation: ticker-scroll 60s linear infinite;
          animation-play-state: running;
        }
      `}</style>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 border-y-2 border-blue-200 dark:border-blue-700 overflow-hidden shadow-lg">
        <div className="flex items-center py-6">
          <div className="flex items-center space-x-3 text-lg font-bold text-blue-600 dark:text-blue-400 px-6">
            <div className="w-3 h-3 bg-blue-600 animate-pulse"></div>
            <span className="tracking-wide">LATEST NEWS</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex space-x-16 text-lg font-medium text-gray-800 dark:text-gray-200 ticker-animation">
            <span className="whitespace-nowrap font-medium">
              Supreme Court declares Articles of Impeachment vs VP Sara Duterte as unconstitutional
            </span>
            <span className="whitespace-nowrap font-medium">
              President Marcos addresses the nation on economic recovery plans
            </span>
            <span className="whitespace-nowrap font-medium">
              Iglesia ni Cristo holds National Rally for Peace with 1.5 million attendees
            </span>
            <span className="whitespace-nowrap font-medium">
              OFW remittances reach all-time high this quarter
            </span>
            <span className="whitespace-nowrap font-medium">
              Renewable energy projects accelerate nationwide development
            </span>
            <span className="whitespace-nowrap font-medium">
              Filipino scientists develop breakthrough cancer treatment
            </span>
            <span className="whitespace-nowrap font-medium">
              Gilas Pilipinas prepares for FIBA World Cup qualifiers
            </span></div>
          </div>
        </div>
      </div>
    </>
  );
}
'use client';

import { formatDistanceToNow } from 'date-fns';

interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  channel: string;
  views: string;
  publishedAt: Date;
}

interface FeaturedVideosSectionProps {
  videos: Video[];
}

export function FeaturedVideosSection({ videos }: FeaturedVideosSectionProps) {
  return (
    <div className="mt-12">
      <div id="featured-videos" className="px-6 py-4 border-b-2 border-blue-600 dark:border-blue-500">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800 dark:text-gray-200" style={{color: '#333333'}}>Featured Videos</h2>
      </div>
      <div className="pt-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="cursor-pointer">
              <div className="space-y-3 p-3 bg-white dark:bg-gray-800">
                <div className="relative w-full bg-gray-200 dark:bg-gray-700" style={{aspectRatio: '16/9'}}>
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span>{video.channel}</span>
                    <span>{video.views} views</span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-600">
                    {formatDistanceToNow(video.publishedAt, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
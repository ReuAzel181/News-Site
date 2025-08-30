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
      <div id="featured-videos" className="py-4">
        <div className="flex items-center mb-3">
          <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
          <h2 className="text-xl font-black uppercase tracking-wide text-left text-deep-blue news-title">Featured Videos</h2>
        </div>
      </div>
      <div className="pt-8 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="cursor-pointer">
              <div className="space-y-3 p-3">
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
                  <h3 className="font-semibold line-clamp-2 news-title">
                    {video.title}
                  </h3>
                  <p className="text-sm line-clamp-2 news-content">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs news-meta">
                    <span>{video.channel}</span>
                    <span>{video.views} views</span>
                  </div>
                  <div className="text-xs news-meta">
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
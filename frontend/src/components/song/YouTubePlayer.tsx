// YouTube 플레이어 컴포넌트

interface YouTubePlayerProps {
  videoId: string;
  autoplay?: boolean;
}

export function YouTubePlayer({ videoId, autoplay = false }: YouTubePlayerProps) {
  const autoplayParam = autoplay ? '?autoplay=1' : '';
  
  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}${autoplayParam}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}


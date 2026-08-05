type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  caption?: string;
};

export function YouTubeEmbed({
  videoId,
  title,
  caption,
}: YouTubeEmbedProps) {
  return (
    <figure className="youtube-embed">
      <div className="youtube-embed-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

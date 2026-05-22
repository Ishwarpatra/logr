// Parse a pasted video link (YouTube / Vimeo / Loom) into an embeddable URL,
// provider, and a poster thumbnail where one is reliably derivable.

export type ParsedVideo = {
  provider: "youtube" | "vimeo" | "loom";
  embedUrl: string;
  poster: string | null;
};

export function parseVideoUrl(raw: string): ParsedVideo | null {
  const url = raw.trim();
  if (!url) return null;

  // YouTube — watch, youtu.be, shorts, embed
  const yt = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  if (yt) {
    const id = yt[1];
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      poster: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // Vimeo — vimeo.com/123456789 or player.vimeo.com/video/123456789
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    return { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeo[1]}`, poster: null };
  }

  // Loom — loom.com/share/<id> or /embed/<id>
  const loom = url.match(/loom\.com\/(?:share|embed)\/([A-Za-z0-9]+)/);
  if (loom) {
    return { provider: "loom", embedUrl: `https://www.loom.com/embed/${loom[1]}`, poster: null };
  }

  return null;
}

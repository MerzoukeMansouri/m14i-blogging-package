"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentBlock } from "../types";

interface ContentBlockRendererProps {
  block: ContentBlock;
  ImageComponent?: React.ComponentType<{
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
  }>;
}

export function ContentBlockRenderer({
  block,
  ImageComponent
}: ContentBlockRendererProps) {
  switch (block.type) {
    case "text":
      return (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {block.content}
          </ReactMarkdown>
        </div>
      );

    case "image":
      return (
        <div className="my-4">
          {block.src ? (
            <>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                {ImageComponent ? (
                  <ImageComponent
                    src={block.src}
                    alt={block.alt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img
                    src={block.src}
                    alt={block.alt}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {block.caption && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {block.caption}
                </p>
              )}
            </>
          ) : (
            <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm">
              Aucune image
            </div>
          )}
        </div>
      );

    case "video":
      return (
        <div className="my-4">
          {block.url ? (
            <>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                {block.url.includes("youtube.com") || block.url.includes("youtu.be") ? (
                  <iframe
                    src={getYouTubeEmbedUrl(block.url)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : block.url.includes("vimeo.com") ? (
                  <iframe
                    src={getVimeoEmbedUrl(block.url)}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    URL vidéo non supportée
                  </div>
                )}
              </div>
              {block.caption && (
                <p className="text-xs text-muted-foreground mt-1 italic">
                  {block.caption}
                </p>
              )}
            </>
          ) : (
            <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm">
              Aucune vidéo
            </div>
          )}
        </div>
      );

    case "gallery":
      return (
        <div className={`my-4 grid gap-2 ${getGalleryColumns(block.columns)}`}>
          {block.images.length === 0 ? (
            <div className="col-span-full aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm">
              Aucune image dans la galerie
            </div>
          ) : (
            block.images.map((image, index) => (
              <div key={index}>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  {ImageComponent ? (
                    <ImageComponent
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {image.caption && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {image.caption}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      );

    case "quote":
      return (
        <blockquote className="my-4 border-l-4 border-[#B87333] pl-4 italic">
          <p className="text-lg text-foreground mb-1">
            "{block.content}"
          </p>
          {(block.author || block.role) && (
            <footer className="text-sm text-muted-foreground not-italic">
              {block.author && <span className="font-semibold">{block.author}</span>}
              {block.role && <span>, {block.role}</span>}
            </footer>
          )}
        </blockquote>
      );

    default:
      return null;
  }
}

// Helper functions
function getGalleryColumns(columns: 2 | 3 | 4): string {
  switch (columns) {
    case 2:
      return "grid-cols-2";
    case 3:
      return "grid-cols-3";
    case 4:
      return "grid-cols-2 md:grid-cols-4";
    default:
      return "grid-cols-3";
  }
}

function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function getVimeoEmbedUrl(url: string): string {
  const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
  return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
}

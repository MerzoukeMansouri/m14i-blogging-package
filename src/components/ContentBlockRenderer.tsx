"use client";

import { useState, useEffect } from "react";
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
  classNames?: {
    text?: string;
    image?: string;
    imageCaption?: string;
    video?: string;
    videoCaption?: string;
    quote?: string;
    quoteContent?: string;
    quoteFooter?: string;
    pdf?: string;
    pdfEmbed?: string;
    pdfTitle?: string;
    pdfDescription?: string;
    pdfDownloadButton?: string;
    carousel?: string;
    carouselSlide?: string;
    carouselImage?: string;
    carouselCaption?: string;
    carouselTitle?: string;
    carouselArrow?: string;
    carouselDot?: string;
    carouselDotActive?: string;
  };
}

export function ContentBlockRenderer({
  block,
  ImageComponent,
  classNames
}: ContentBlockRendererProps) {
  switch (block.type) {
    case "text":
      return (
        <div className={classNames?.text || "prose prose-sm max-w-none break-words"}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {block.content}
          </ReactMarkdown>
        </div>
      );

    case "image":
      return (
        <div className={classNames?.image || "my-4"}>
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
                <p className={classNames?.imageCaption || "text-xs text-muted-foreground mt-1 italic"}>
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
        <div className={classNames?.video || "my-4"}>
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
                <p className={classNames?.videoCaption || "text-xs text-muted-foreground mt-1 italic"}>
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

    case "carousel":
      return <CarouselRenderer block={block} ImageComponent={ImageComponent} classNames={classNames} />;

    case "quote":
      return (
        <blockquote className={classNames?.quote || "my-4 border-l-4 border-[#B87333] pl-4 italic"}>
          <p className={classNames?.quoteContent || "text-lg text-foreground mb-1"}>
            "{block.content}"
          </p>
          {(block.author || block.role) && (
            <footer className={classNames?.quoteFooter || "text-sm text-muted-foreground not-italic"}>
              {block.author && <span className="font-semibold">{block.author}</span>}
              {block.role && <span>, {block.role}</span>}
            </footer>
          )}
        </blockquote>
      );

    case "pdf":
      const displayMode = block.displayMode || "both";
      const pdfHeight = block.height || "600px";

      return (
        <div className={classNames?.pdf || "my-4"}>
          {block.url ? (
            <>
              {/* Title and Description */}
              {(block.title || block.description) && (
                <div className="mb-3">
                  {block.title && (
                    <h4 className={classNames?.pdfTitle || "text-lg font-semibold mb-1"}>
                      {block.title}
                    </h4>
                  )}
                  {block.description && (
                    <p className={classNames?.pdfDescription || "text-sm text-muted-foreground"}>
                      {block.description}
                    </p>
                  )}
                </div>
              )}

              {/* PDF Embed */}
              {(displayMode === "embed" || displayMode === "both") && (
                <div className={classNames?.pdfEmbed || "relative rounded-lg overflow-hidden border border-border bg-muted"}>
                  <iframe
                    src={`${block.url}#view=FitH`}
                    className="w-full"
                    style={{ height: pdfHeight }}
                    title={block.title || "PDF Document"}
                  />
                </div>
              )}

              {/* Download Button */}
              {(displayMode === "download" || displayMode === "both") && (
                <div className={displayMode === "both" ? "mt-3" : ""}>
                  <a
                    href={block.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames?.pdfDownloadButton || "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {displayMode === "download" ? "Télécharger le PDF" : "Télécharger"}
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm">
              Aucun PDF
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

// Carousel Component
interface CarouselRendererProps {
  block: Extract<ContentBlock, { type: "carousel" }>;
  ImageComponent?: React.ComponentType<{
    src: string;
    alt: string;
    fill?: boolean;
    className?: string;
  }>;
  classNames?: ContentBlockRendererProps["classNames"];
}

function CarouselRenderer({ block, ImageComponent, classNames }: CarouselRendererProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    slides,
    autoPlay = false,
    autoPlayInterval = 3000,
    showDots = true,
    showArrows = true,
    loop = true,
    aspectRatio = "16/9"
  } = block;

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev === slides.length - 1) {
          return loop ? 0 : prev;
        }
        return prev + 1;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, slides.length, loop]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => {
      if (prev === 0) {
        return loop ? slides.length - 1 : 0;
      }
      return prev - 1;
    });
  };

  const goToNext = () => {
    setCurrentSlide((prev) => {
      if (prev === slides.length - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "16/9": return "aspect-video";
      case "4/3": return "aspect-[4/3]";
      case "1/1": return "aspect-square";
      case "21/9": return "aspect-[21/9]";
      default: return "aspect-video";
    }
  };

  if (slides.length === 0) {
    return (
      <div className={classNames?.carousel || "my-4"}>
        <div className={`${getAspectRatioClass()} rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm`}>
          Aucune slide dans le carousel
        </div>
      </div>
    );
  }

  return (
    <div className={classNames?.carousel || "my-4 relative group"}>
      {/* Slides Container */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={classNames?.carouselSlide || `min-w-full ${getAspectRatioClass()}`}
            >
              <div className="relative w-full h-full bg-muted">
                {ImageComponent ? (
                  <ImageComponent
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    className={classNames?.carouselImage || "w-full h-full object-cover"}
                  />
                )}

                {/* Overlay with title and caption */}
                {(slide.title || slide.caption) && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    {slide.title && (
                      <h3 className={classNames?.carouselTitle || "text-white font-semibold text-lg mb-1"}>
                        {slide.title}
                      </h3>
                    )}
                    {slide.caption && (
                      <p className={classNames?.carouselCaption || "text-white/90 text-sm"}>
                        {slide.caption}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            disabled={!loop && currentSlide === 0}
            className={classNames?.carouselArrow || "absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"}
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={!loop && currentSlide === slides.length - 1}
            className={classNames?.carouselArrow || "absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"}
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && slides.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={
                index === currentSlide
                  ? classNames?.carouselDotActive || "w-3 h-3 rounded-full bg-primary"
                  : classNames?.carouselDot || "w-3 h-3 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Helper functions
function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

function getVimeoEmbedUrl(url: string): string {
  const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
  return videoId ? `https://player.vimeo.com/video/${videoId}` : "";
}

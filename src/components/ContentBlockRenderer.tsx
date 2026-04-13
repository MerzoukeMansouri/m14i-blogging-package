"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import type { ContentBlock, ChartBlock } from "../types";

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
    chart?: string;
    chartCaption?: string;
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
        <div className={classNames?.text || "blog-prose prose prose-sm max-w-none break-words"}>
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
              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted group">
                {ImageComponent ? (
                  <ImageComponent
                    src={block.src}
                    alt={block.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={block.src}
                    alt={block.alt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                {/* Image overlay with view action */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
                <button
                  onClick={() => window.open(block.src, "_blank")}
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white text-black rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  aria-label="View full image"
                  type="button"
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
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              {block.caption && (
                <p className={classNames?.imageCaption || "text-xs text-muted-foreground mt-2 italic text-center"}>
                  {block.caption}
                </p>
              )}
            </>
          ) : (
            <EmptyState message="Aucune image" />
          )}
        </div>
      );

    case "video":
      return (
        <div className={classNames?.video || "my-4"}>
          {block.url ? (
            <>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
                {(() => {
                  const embedUrl = getEmbedUrl(block.url);
                  if (!embedUrl) {
                    return (
                      <div className="flex items-center justify-center h-full text-white">
                        URL vidéo non supportée
                      </div>
                    );
                  }

                  const isYouTube = block.url.includes("youtube") || block.url.includes("youtu.be");
                  const allow = isYouTube
                    ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    : "autoplay; fullscreen; picture-in-picture";

                  return (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full"
                      allow={allow}
                      allowFullScreen
                    />
                  );
                })()}
              </div>
              {block.caption && (
                <p className={classNames?.videoCaption || "text-xs text-muted-foreground mt-1 italic"}>
                  {block.caption}
                </p>
              )}
            </>
          ) : (
            <EmptyState message="Aucune vidéo" />
          )}
        </div>
      );

    case "carousel":
      return <CarouselRenderer block={block} ImageComponent={ImageComponent} classNames={classNames} />;

    case "chart":
      return <ChartRenderer block={block} classNames={classNames} />;

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
                <div className="mb-4 p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-600"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="12" y1="18" x2="12" y2="12" />
                        <line x1="9" y1="15" x2="15" y2="15" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      {block.title && (
                        <h4 className={classNames?.pdfTitle || "text-lg font-semibold mb-1 text-foreground"}>
                          {block.title}
                        </h4>
                      )}
                      {block.description && (
                        <p className={classNames?.pdfDescription || "text-sm text-muted-foreground"}>
                          {block.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Embed */}
              {(displayMode === "embed" || displayMode === "both") && (
                <div className={classNames?.pdfEmbed || "relative rounded-lg overflow-hidden border-2 border-border bg-muted shadow-lg group"}>
                  <iframe
                    src={`${block.url}#view=FitH&toolbar=0&navpanes=0`}
                    className="w-full"
                    style={{ height: pdfHeight }}
                    title={block.title || "PDF Document"}
                  />
                  {/* Fullscreen hint */}
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Cliquez pour agrandir
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {(displayMode === "download" || displayMode === "both") && (
                <div className={displayMode === "both" ? "mt-4 flex gap-2 flex-wrap" : "flex gap-2 flex-wrap"}>
                  <a
                    href={block.url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classNames?.pdfDownloadButton || "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium shadow-sm"}
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
                    Télécharger le PDF
                  </a>
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm font-medium shadow-sm"
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
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    Ouvrir dans un nouvel onglet
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-50"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Aucun PDF</span>
            </div>
          )}
        </div>
      );

    default:
      return null;
  }
}

const CHART_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

interface ChartRendererProps {
  block: ChartBlock;
  classNames?: ContentBlockRendererProps["classNames"];
}

function ChartRenderer({ block, classNames }: ChartRendererProps) {
  const { chartType, title, data, xAxisLabel, yAxisLabel, caption, height = 300 } = block;

  if (!data || data.length === 0) {
    return (
      <div className={classNames?.chart || "my-4"}>
        <EmptyState message="Aucune donnée" />
      </div>
    );
  }

  const seriesName = yAxisLabel || title || "value";
  const rechartsData = data.map((d: { label: string; value: number }) => ({ name: d.label, [seriesName]: d.value }));

  const renderPieLabel = ({ name, percent }: { name?: string; percent?: number }) =>
    `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`;

  return (
    <div className={classNames?.chart || "my-4"}>
      {title && (
        <p className="text-sm font-semibold mb-2 text-foreground">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {chartType === "pie" ? (
          <PieChart>
            <Pie
              data={rechartsData}
              dataKey={seriesName}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius="70%"
              label={renderPieLabel}
            >
              {rechartsData.map((_: unknown, i: number) => (
                <Cell key={i} fill={data[i]?.color || CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        ) : chartType === "line" ? (
          <LineChart data={rechartsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--blog-border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined} />
            <YAxis tick={{ fontSize: 12 }} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={seriesName} stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        ) : chartType === "area" ? (
          <AreaChart data={rechartsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--blog-border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined} />
            <YAxis tick={{ fontSize: 12 }} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={seriesName} stroke={CHART_COLORS[0]} fill="url(#chartAreaGradient)" strokeWidth={2} />
          </AreaChart>
        ) : (
          <BarChart data={rechartsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--blog-border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -5 } : undefined} />
            <YAxis tick={{ fontSize: 12 }} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined} />
            <Tooltip />
            <Legend />
            <Bar dataKey={seriesName} radius={[4, 4, 0, 0]}>
              {rechartsData.map((_: unknown, i: number) => (
                <Cell key={i} fill={data[i]?.color || CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
      {caption && (
        <p className={classNames?.chartCaption || "text-xs text-muted-foreground mt-2 italic text-center"}>
          {caption}
        </p>
      )}
    </div>
  );
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

// Helper functions for video embeds
function getEmbedUrl(url: string): string | null {
  const youtubeId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  const vimeoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
  if (vimeoId) {
    return `https://player.vimeo.com/video/${vimeoId}`;
  }

  return null;
}

// Helper component for empty state
function EmptyState({ message }: { message: string }): React.ReactElement {
  return (
    <div className="aspect-video rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground text-sm">
      {message}
    </div>
  );
}

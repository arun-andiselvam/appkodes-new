"use client";

import { Play } from "lucide-react";

/**
 * The poster, with a play button over it. Never the player.
 *
 * Used on the card and again inside the dialog, so the two look identical and
 * the second click lands where the eye already is.
 *
 * It lives in its own file so components/sections/video-modal.tsx can use it
 * without being imported by the testimonials bundle. The modal is loaded on
 * demand and this is not, so a shared import between them would drag the modal
 * back into the initial chunk.
 */
export function VideoPoster({
  poster,
  title,
  onPlay,
  size = "card",
}: {
  poster: string;
  title: string;
  onPlay: () => void;
  size?: "card" | "dialog";
}) {
  const button = size === "dialog" ? "w-20 h-20" : "w-14 h-14";
  const icon = size === "dialog" ? "w-7 h-7" : "w-5 h-5";

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group relative block w-full aspect-video overflow-hidden bg-foreground/5"
      aria-label={`Play: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className={`${button} rounded-full bg-background/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Play className={`${icon} translate-x-0.5`} />
        </span>
      </span>
    </button>
  );
}

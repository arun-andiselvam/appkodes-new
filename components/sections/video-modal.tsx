"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoPoster } from "@/components/sections/video-poster";
import type { TestimonialSlide } from "@/content/types";

/**
 * The video lightbox, split out so Radix only downloads when somebody opens one.
 *
 * !! THIS FILE IS LOADED ON DEMAND. KEEP IT THAT WAY. !!
 *
 * @radix-ui/react-dialog is the single largest piece of application code on
 * this site after the framework itself. Measured on 22 August 2026, the chunk
 * carrying it and the testimonials was 34KB transferred of a 204KB page, and
 * it was downloaded on every page that renders a review, which is the home
 * page, every service page and the case studies index.
 *
 * Almost nobody presses play. Loading a modal library for all of them so a few
 * can watch a clip is the wrong trade, so the poster stays in the main bundle
 * and this arrives when it is clicked.
 *
 * Importing this statically anywhere puts it straight back into the initial
 * bundle. See the dynamic() call in components/sections/testimonials.tsx.
 *
 * Unmounting on close disposes of the iframe, so a closed dialog is not a
 * video still playing behind the page.
 */
export function VideoModal({
  slide,
  onClose,
}: {
  slide: Extract<TestimonialSlide, { kind: "video" }>;
  onClose: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent
        showCloseButton
        className="max-w-4xl w-[calc(100vw-2rem)] p-0 gap-0 border-foreground/10 bg-background"
      >
        <DialogHeader className="px-6 pt-6 pb-4 text-left">
          <DialogTitle className="text-xl font-display tracking-tight">
            {slide.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Client testimonial video, played from YouTube.
          </DialogDescription>
        </DialogHeader>

        {playing ? (
          <div className="relative aspect-video bg-foreground/5">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${slide.youtubeId}?autoplay=1&rel=0`}
              title={slide.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <VideoPoster
            poster={slide.poster}
            title={slide.title}
            size="dialog"
            onPlay={() => setPlaying(true)}
          />
        )}

        <p className="px-6 py-4 text-sm text-muted-foreground">
          {playing
            ? "Playing from youtube-nocookie.com."
            : "Nothing loads from YouTube until you press play."}
        </p>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { VideoPoster } from "@/components/sections/video-poster";
import type { TestimonialSlide } from "@/content/types";

/**
 * A client video: the poster always, the player only once it is wanted.
 *
 * The same component as the private VideoDialog inside
 * components/sections/testimonials.tsx, lifted into its own file for the
 * contact page on 10 September 2026. Importing it from testimonials.tsx would
 * have made that whole client module part of the contact page's bundle to get
 * fifteen lines out of it.
 *
 * !! DO NOT IMPORT VideoModal STATICALLY !!
 *
 * The dialog is Radix, the largest piece of application code on this site
 * after the framework, measured at 34KB of a 204KB page on 22 August 2026. It
 * arrives on the click that asks for it. A static import undoes that silently,
 * because nothing about the page looks any different when it happens.
 *
 * Nothing reaches YouTube until somebody presses play inside the dialog: the
 * poster is a local file under public/testimonials, and the iframe is the
 * youtube-nocookie host that frame-src in proxy.ts already allows.
 */
const VideoModal = dynamic(
  () => import("@/components/sections/video-modal").then((m) => m.VideoModal),
  {
    // A modal nobody has opened has nothing to render on the server.
    ssr: false,
  },
);

export function VideoDialog({
  slide,
}: {
  slide: Extract<TestimonialSlide, { kind: "video" }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <VideoPoster poster={slide.poster} title={slide.title} onPlay={() => setOpen(true)} />
      {open && <VideoModal slide={slide} onClose={() => setOpen(false)} />}
    </>
  );
}

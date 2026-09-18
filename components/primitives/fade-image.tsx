"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * A `fill` image that shows a shimmer until it arrives, then fades in.
 *
 * Asked for on 18 September 2026 for the blog thumbnails: each card should
 * show its own placeholder rather than a blank hole, and the picture should
 * arrive with a short reveal rather than popping in.
 *
 * !! `fill` ONLY. THE PARENT MUST BE position: relative !!
 *
 * The shimmer is an absolutely positioned sibling covering the same box as the
 * image, so it relies on the parent every `fill` image already needs. It sits
 * before the image in the DOM, so anything the caller layers on top - the
 * date and gradient on a card - still paints above both.
 *
 * !! THE complete CHECK IS NOT REDUNDANT !!
 *
 * A thumbnail served from the browser cache can finish loading before React
 * hydrates and attaches onLoad, and then the event never reaches us: the
 * picture would sit at opacity 0 behind a shimmer forever. So on mount we also
 * ask the element whether it already has pixels.
 *
 * The caller's transition classes are replaced, not merged. Tailwind's
 * `transition-transform` and `transition-opacity` both write
 * transition-property, and whichever comes later in the stylesheet wins, so
 * the hover zoom the cards use would silently lose its easing. This sets both
 * properties at once instead; pass the hover transform itself as usual.
 *
 * !! fade={false} FOR AN LCP IMAGE, AND THE ARTICLE HERO IS ONE !!
 *
 * Chrome does not count an element at opacity 0 as painted, so fading the
 * largest image in pushes Largest Contentful Paint back by the length of the
 * fade. With `fade` off the shimmer still covers the frame until the picture
 * arrives, but the picture itself is never hidden: it paints over the shimmer
 * the moment it has pixels, and LCP lands exactly when it did before.
 */
export function FadeImage({
  className = "",
  onLoad,
  alt,
  fade = true,
  ...props
}: ImageProps & { fade?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <>
      {!loaded && <span aria-hidden className="image-shimmer absolute inset-0" />}
      <Image
        ref={ref}
        alt={alt}
        {...props}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={
          fade
            ? `${className} transition-[opacity,transform] duration-500 ${
                loaded ? "opacity-100" : "opacity-0"
              }`
            : className
        }
      />
    </>
  );
}

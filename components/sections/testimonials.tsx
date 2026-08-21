"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import { siTrustpilot, siYoutube } from "simple-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInView } from "@/hooks/use-in-view";
import type { TestimonialSlide } from "@/content/types";
import { clientLogos, testimonialSlides, trustpilotSnapshot } from "@/content/testimonials";
import { Section } from "@/components/primitives/section";
import { Container } from "@/components/primitives/container";
import { Eyebrow } from "@/components/primitives/eyebrow";
import { SectionTitle } from "@/components/primitives/section-title";

/**
 * The poster, with a play button over it. Never the player.
 *
 * Used on the card and again inside the dialog, so the two look identical and
 * the second click lands where the eye already is.
 */
function VideoPoster({
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

/**
 * Two clicks before a single byte of YouTube is fetched.
 *
 * Opening the dialog only swaps a local still from a small box to a large one.
 * The iframe mounts on the play press inside it, which is the first moment we
 * know somebody actually wants the video rather than a closer look at the
 * card. A page carrying four autoloading embeds would pull several megabytes
 * of player code for something most visitors never press, on a page that ships
 * under one megabyte in total.
 *
 * Radix handles the focus trap, the escape key, the scroll lock and the
 * backdrop press. Unmounting on close disposes of the iframe, so a closed
 * dialog is not a video still playing behind the page.
 */
function VideoDialog({
  slide,
}: {
  slide: Extract<TestimonialSlide, { kind: "video" }>;
}) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        // Reset so reopening shows the poster again rather than resuming.
        if (!next) setPlaying(false);
      }}
    >
      {/*
        No DialogTrigger. It would need asChild to wrap this button, which means
        forwarding refs and props through VideoPoster just to end up setting the
        same state this component already owns. Calling setOpen directly keeps
        one poster component for both the card and the dialog, so they cannot
        drift apart.
      */}
      <VideoPoster poster={slide.poster} title={slide.title} onPlay={() => setOpen(true)} />

      <DialogContent
        showCloseButton
        className="max-w-4xl w-[calc(100vw-2rem)] p-0 gap-0 border-foreground/10 bg-background"
      >
        <DialogHeader className="px-6 pt-6 pb-4 text-left">
          <DialogTitle className="text-xl font-display tracking-tight">{slide.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Client testimonial video, played from YouTube.
          </DialogDescription>
        </DialogHeader>

        {playing ? (
          <div className="relative aspect-video bg-foreground/5">
            <iframe
              className="absolute inset-0 w-full h-full"
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

/**
 * Trustpilot green, the one colour on the page that is not ours.
 *
 * Every star and the wordmark carry it, which is the point. Rendering their
 * ratings in our blue would dress somebody else's data as our own design, and
 * the whole argument of this section is that these numbers came from
 * elsewhere. One colour, used only where the proof is external.
 */
const TRUSTPILOT_GREEN = `#${siTrustpilot.hex}`;

/**
 * Where a card came from, named rather than hinted at.
 *
 * The first version put the bare Trustpilot star in the corner at sixteen
 * pixels and forty percent opacity, which was unreadable twice over. It was
 * too small to identify, and Trustpilot's logo is itself a star, so beside a
 * five star rating it read as a sixth washed out star rather than as a source.
 *
 * Mark plus wordmark at full strength fixes both. It also gives video cards
 * somewhere obvious to say YouTube in red, so the two sources are told apart
 * at a glance instead of by reading the card.
 */
const SOURCES = {
  trustpilot: { icon: siTrustpilot, label: "Trustpilot", color: TRUSTPILOT_GREEN },
  youtube: { icon: siYoutube, label: "YouTube", color: `#${siYoutube.hex}` },
} as const;

function SourceMark({
  source,
  className = "",
}: {
  source: keyof typeof SOURCES;
  className?: string;
}) {
  const { icon, label, color } = SOURCES[source];
  return (
    <span className={`inline-flex items-center gap-2 shrink-0 ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5 fill-current" style={{ color }}>
        <path d={icon.path} />
      </svg>
      <span className="text-sm font-medium">{label}</span>
    </span>
  );
}

/*
 * Flags are circular SVGs from public/flags, not emoji.
 *
 * Emoji were tried first and were wrong twice over. The artwork is roughly
 * four units wide to three tall, so a circle either letterboxes it or crops
 * the design away, and Windows ships no flag glyphs at all, which turned the
 * badge into two cropped letters on a large share of visitors.
 *
 * These are drawn round, so they fill the badge with nothing cut off and look
 * the same everywhere.
 *
 * Only the twelve countries quoted are in public/flags, about half a kilobyte
 * each. They came from the circle-flags package, which is not a dependency
 * because nothing imports it and it carries four hundred flags for the twelve
 * we use. To add one, take the file from github.com/HatScripts/circle-flags
 * and drop it in named by its lower case country code.
 */
function flagSrc(code: string) {
  return `/flags/${code.toLowerCase()}.svg`;
}

/**
 * Initials stand in where a reviewer has no picture. Eight of sixteen have none.
 *
 * The flag sits on the corner of the portrait rather than in the line below
 * it. These reviews come from eleven countries, and that reach is worth seeing
 * at a glance instead of reading as another code in a row of grey text.
 */
function Avatar({ name, photo, country }: { name: string; photo?: string; country: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <span className="relative shrink-0">
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          loading="lazy"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      ) : (
        <span className="w-10 h-10 rounded-full border border-foreground/15 flex items-center justify-center text-xs font-mono text-muted-foreground">
          {initials}
        </span>
      )}
      {/*
        The ring is the page background rather than a border, so the badge
        reads as sitting on top of the portrait instead of beside it.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flagSrc(country)}
        alt={country}
        title={country}
        loading="lazy"
        width={20}
        height={20}
        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full ring-2 ring-background"
      />
    </span>
  );
}

function SlideCard({ slide }: { slide: TestimonialSlide }) {
  if (slide.kind === "video") {
    return (
      <figure className="h-full flex flex-col border border-foreground/10 bg-background">
        <VideoDialog slide={slide} />
        <figcaption className="p-6 lg:p-8 flex-1 flex flex-col">
          {/* Same slot the reviews use for Trustpilot, so the two read as a pair. */}
          <SourceMark source="youtube" className="mb-5" />
          {/*
            Set at the same size and colour as a review body rather than a
            heading. The two card types sit next to each other in one rail, and
            a larger caption made the videos read as a different component
            wedged into the same row.
          */}
          <p className="leading-relaxed text-foreground/80">{slide.title}</p>
          {slide.description && (
            <p className="mt-3 leading-relaxed text-muted-foreground">{slide.description}</p>
          )}
          {slide.speaker && (
            <p className="mt-auto pt-6 text-sm text-muted-foreground">
              {[slide.speaker, slide.role].filter(Boolean).join(", ")}
            </p>
          )}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="h-full flex flex-col border border-foreground/10 bg-background p-6 lg:p-8">
      <div className="flex items-center justify-between gap-4 mb-5">
        <span className="flex gap-0.5" aria-label="Rated 5 out of 5 on Trustpilot">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star
              key={i}
              aria-hidden="true"
              className="w-4 h-4 fill-current"
              style={{ color: TRUSTPILOT_GREEN }}
            />
          ))}
        </span>
        {/* Attribution on every card, so no quote can be read as ours. */}
        <SourceMark source="trustpilot" />
      </div>
      <blockquote className="flex-1 leading-relaxed text-foreground/80">{slide.text}</blockquote>
      <figcaption className="mt-6 pt-6 border-t border-foreground/10 flex items-center gap-3">
        <Avatar name={slide.name} photo={slide.photo} country={slide.country} />
        <span className="min-w-0">
          <span className="block font-medium truncate">{slide.name}</span>
          {/* Country moved onto the portrait, so this line carries the date alone. */}
          <span className="block text-xs font-mono text-muted-foreground">{slide.date}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/** Fisher-Yates, on a copy. */
function shuffled<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function TestimonialsSection({
  /**
   * Whether to close with the client logo band.
   *
   * Off on /resources/case-studies, which shows the same six marks in its own
   * row near the top. On everywhere else, and on the home page in particular,
   * where this is the only place they appear.
   */
  showClients = true,
}: { showClients?: boolean } = {}) {
  const [sectionRef, isVisible] = useInView<HTMLElement>();
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /*
   * Every card is reordered on every load, so the one sitting eleventh gets
   * read as often as the one sitting second. Twenty cards in a slider means
   * most visitors see the first four and stop.
   *
   * The shuffle runs in an effect rather than during render, and that is not a
   * detail. Randomising while rendering would produce different markup on the
   * server and the client, and React would throw a hydration mismatch. So the
   * first paint uses the authored order, which matches the server exactly, and
   * the reorder lands immediately after. The section sits well below the fold,
   * so it has always happened before anyone scrolls to it.
   *
   * Videos shuffle in with the reviews rather than sitting pinned at the
   * front, so a visitor who reads only the first few cards still meets one
   * some of the time.
   *
   * The first slot is the exception and always holds a review. A video opening
   * the section leads with a thumbnail and a play button, which asks for a
   * click before it has given the reader anything. A review is readable where
   * it sits, so the section starts by being useful and the videos are found
   * rather than demanded.
   */
  const [slides, setSlides] = useState<TestimonialSlide[]>(testimonialSlides);

  // Shuffling during render would give the server one order and the client
  // another, so this is deliberately a post-hydration effect. The single
  // setState is the whole point of it, not an accident.
  useEffect(() => {
    const order = shuffled(testimonialSlides);
    const firstReview = order.findIndex((slide) => slide.kind === "review");
    if (firstReview > 0) {
      [order[0], order[firstReview]] = [order[firstReview], order[0]];
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlides(order);
  }, []);

  /*
   * Put the rail back to the start once the new order has actually rendered.
   *
   * Resetting inside the shuffle effect was too early. setSlides is not
   * applied synchronously, so that call landed on the old DOM and the browser
   * then moved the scroll anyway: reordering children of a snap container
   * makes it anchor to whichever card was in view, which leaves the rail
   * somewhere in the middle with cards to the left the reader never saw.
   *
   * Keying this on slides runs it after the reorder is on screen, and the
   * behaviour is instant rather than smooth so nobody watches it travel back.
   */
  useEffect(() => {
    // scrollTo fires a scroll event, which the rail's onScroll turns into a
    // syncEdges call, so the arrow disabled states follow without help here.
    trackRef.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [slides]);

  const videoCount = slides.filter((slide) => slide.kind === "video").length;
  const reviewCount = slides.length - videoCount;

  /*
   * Native scrolling with snap points rather than a transform driven track.
   * It keeps the trackpad swipe, the touch fling and keyboard scrolling that a
   * hand rolled carousel throws away. The arrows only push the same scroller
   * along by one card, so there is one source of truth for position.
   */
  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener("resize", syncEdges);
    return () => window.removeEventListener("resize", syncEdges);
  }, [syncEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  };

  return (
    <Section
      spacing="tight"
      id="testimonials"
      ref={sectionRef}
      className="border-t border-foreground/10 overflow-hidden"
    >
      <Container>
        {/* Header */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-12 lg:mb-14 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-2xl">
            <Eyebrow className="mb-6">
              What people say
            </Eyebrow>
            <SectionTitle className="mb-6">
              Not our words.
              <br />
              <span className="text-muted-foreground">Theirs.</span>
            </SectionTitle>
            {/*
              An earlier draft claimed we could not choose which reviews
              appeared. Then these were filtered to the five star ones, which
              made that sentence false. Admitting the pick, beside a score that
              counts every review, is both true and the stronger claim.
            */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every quote here is a real Trustpilot review. We did choose which ones to
              show you. The score beside them is the part we do not control, and it
              counts all {trustpilotSnapshot.reviewCount} reviews.
            </p>
          </div>

          {/* The number we do not choose. */}
          <a
            href={trustpilotSnapshot.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group shrink-0 border border-foreground/10 p-6 hover:border-foreground/30 transition-colors"
          >
            <SourceMark source="trustpilot" className="mb-4" />
            <span className="flex items-baseline gap-2">
              <span className="font-display text-4xl lg:text-5xl tracking-tight tabular-nums">
                {trustpilotSnapshot.score}
              </span>
              <span className="text-muted-foreground">out of {trustpilotSnapshot.outOf}</span>
            </span>
            <span
              className="mt-2 flex gap-0.5"
              aria-label={`${trustpilotSnapshot.label}, ${trustpilotSnapshot.score} out of ${trustpilotSnapshot.outOf}`}
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className="w-4 h-4 fill-current"
                  style={{ color: i < 4 ? TRUSTPILOT_GREEN : "transparent", stroke: TRUSTPILOT_GREEN }}
                />
              ))}
            </span>
            <span className="mt-2 block text-sm">{trustpilotSnapshot.label}</span>
            <span className="mt-1 block text-xs font-mono text-muted-foreground">
              {trustpilotSnapshot.reviewCount} reviews · checked {trustpilotSnapshot.checked}
            </span>
            <span className="mt-3 block text-sm underline underline-offset-4 group-hover:text-foreground">
              Read all of them
            </span>
          </a>
        </div>
      </Container>

      {/*
        The track bleeds past the container so cards run to the edge of the
        screen. That is what tells a reader there is more to the right without
        needing a scrollbar to say so.
      */}
      <div
        ref={trackRef}
        onScroll={syncEdges}
        className="flex gap-6 overflow-x-auto overscroll-x-contain snap-x snap-mandatory scroll-px-6 lg:scroll-px-12 px-6 lg:px-12 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            data-slide
            className={`snap-start shrink-0 w-[300px] sm:w-[360px] transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: `${Math.min(index, 6) * 70}ms` }}
          >
            <SlideCard slide={slide} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <Container className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          disabled={atStart}
          aria-label="Previous reviews"
          className="w-11 h-11 border border-foreground/15 flex items-center justify-center transition-colors hover:border-foreground/40 disabled:opacity-30 disabled:hover:border-foreground/15"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          disabled={atEnd}
          aria-label="More reviews"
          className="w-11 h-11 border border-foreground/15 flex items-center justify-center transition-colors hover:border-foreground/40 disabled:opacity-30 disabled:hover:border-foreground/15"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        {/*
          Counts reviews against reviews. Adding the four videos into this
          figure would read as "20 of 29" and quietly claim four of Trustpilot's
          reviews are films of our clients.
        */}
        <span className="ml-2 text-sm font-mono text-muted-foreground">
          {reviewCount} of {trustpilotSnapshot.reviewCount} reviews, plus {videoCount} videos
        </span>
      </Container>

      {/*
        Client logo band.

        !! THE CASE STUDIES PAGE SHOWS THESE MARKS ABOVE, SO IT TURNS THIS OFF !!

        The same six logos ran twice on /resources/case-studies once that page
        gained its own client row at the top, which read as a mistake rather
        than as emphasis. The band is not deleted because the home page has no
        other client row and this is the only place those marks appear there.

        So it is a prop rather than a removal. Default on, off where something
        above has already shown them.
      */}
      {showClients && (
        <>
          <Container className="mt-16 lg:mt-20 pt-12 border-t border-foreground/10">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase text-center">
              Businesses we have built for
            </p>
          </Container>

          {/*
            Two copies because the keyframe travels -50%, with the trailing gap
            inside each set rather than on the flex parent. A gap on the parent
            makes the halves unequal and the row jumps every loop, which is the
            same bug the integrations marquees had.
          */}
          <div className="mt-10 flex overflow-hidden">
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="flex items-center gap-16 pr-16 shrink-0 marquee">
                {clientLogos.map((client) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    key={`${client.name}-${setIndex}`}
                    src={client.logo}
                    alt={client.name}
                    loading="lazy"
                    aria-hidden={setIndex === 1}
                    className="h-8 lg:h-10 w-auto shrink-0 grayscale opacity-60 hover:opacity-100 transition-opacity duration-300 dark:invert"
                  />
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

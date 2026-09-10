"use client";

import { Fragment, useState, useEffect, useId } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { QuoteLauncher } from "@/components/quote/launcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X, ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { actions, site } from "@/content/site";
import { mainNav } from "@/content/navigation";
import { quoteCtaLabel } from "@/content/quote-flow";
import type { NavItem } from "@/content/types";

/**
 * Is this menu item the branch of the site the visitor is standing in?
 *
 * Exact match is not enough once the site is siloed. Somebody reading
 * /services/customer-support-ai is three levels inside
 * Services, and a menu that marks nothing has stopped telling them where they
 * are. Prefix match, with the boundary checked, so /servicesomething could
 * never light up Services.
 */
/** Menu names carry spaces. Element ids should not. */
function panelKey(base: string, name: string) {
  return `${base}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function isCurrentBranch(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  /** Name of the menu item whose panel is open, or null. One at a time. */
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  /** Which mobile section is expanded. The mobile menu is an accordion. */
  const [openSection, setOpenSection] = useState<string | null>(null);
  const panelId = useId();
  /** The route the menu state belongs to. See the reset below. */
  const [lastPathname, setLastPathname] = useState(pathname);

  /**
   * Whether the bar is drawn as a solid panel rather than sitting transparent
   * over the page.
   *
   * Named because it drives the class list, the per property transition timing
   * and nothing else should have to re-derive it. It was written inline twice
   * and the two would have gone out of step the first time either changed.
   */
  const solid = isScrolled || isMobileMenuOpen;

  /*
   * !! THE THRESHOLD HAS TWO VALUES, AND THAT IS THE POINT !!
   *
   * This read `setIsScrolled(window.scrollY > 20)` on every scroll event. One
   * threshold means that at a scroll position of about twenty pixels, a
   * movement of one pixel flips the state, and the header answers a flip by
   * animating its width from 1400 to 1200, its height from 20 to 14, its
   * border colour, its shadow and its blur. Momentum scrolling parks somebody
   * on that boundary regularly, and a trackpad nudge there reads as the bar
   * blinking.
   *
   * The blur is the part that shows worst. Look at the transition below: it
   * switches backdrop-filter with a 1ms duration, so it is a hard on and off
   * rather than a fade, deliberately. A state that thrashes therefore strobes
   * the blur rather than easing it.
   *
   * So the bar goes solid above 24 and only goes back to transparent below 12.
   * Anything inside that band leaves it where it is. Reported 3 September 2026.
   *
   * Coalesced into one rAF as well. The handler ran on every scroll event,
   * which on a trackpad is far more often than the screen refreshes, and each
   * one read window.scrollY and forced React through a state update that
   * usually changed nothing. Passive, because nothing here calls
   * preventDefault and the listener should never be able to hold up a scroll.
   */
  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      setIsScrolled((was) => (was ? window.scrollY > 12 : window.scrollY > 24));
    };
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  /*
   * Escape closes whatever is open. Without it a keyboard visitor who has
   * opened a panel by tabbing into it has no way out except tabbing through
   * every link inside.
   */
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenPanel(null);
      setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /*
   * A menu left open across a navigation covers the page the visitor just
   * asked for. App Router keeps the header mounted between routes, so nothing
   * closes it unless this does. Clicking a link inside a mega-menu panel is
   * the case that needs it: the pointer never leaves <nav>, so the mouseleave
   * that normally closes the panel never fires.
   *
   * Adjusted during render rather than in an effect. React documents this as
   * the way to reset state when a prop changes, and the effect version renders
   * the new page once with the old menu still open before correcting itself.
   */
  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpenPanel(null);
    setIsMobileMenuOpen(false);
    setOpenSection(null);
  }

  /*
    !! DO NOT LOCK BODY SCROLL HERE. IT BREAKS SCROLLING ON ANDROID. !!

    This set `document.body.style.overflow = "hidden"` while the menu was open
    and cleared it on close. The exact repro, from a OnePlus on Chrome, 10
    September 2026: load the page and scroll and it is fine; reload, open the
    menu and close it without scrolling first, and the page will not scroll
    past the header afterwards.

    The cause is the interaction with `content-visibility: auto`, which
    app/globals.css puts on `main > section:nth-child(n + 4)`. The document's
    height below the fold is an estimate from `contain-intrinsic-size` until a
    section has been on screen once. Taking the body out of scrolling and
    putting it back makes Chrome recompute that while nothing is rendered, and
    the scroll range collapses to roughly the part that had been painted.

    No lock is needed. The overlay is `fixed inset-0` and covers the page, it
    scrolls itself, and `overscroll-contain` on it stops that scroll chaining
    through to the document behind. Nothing touches the body at all now, so
    there is no state to restore and nothing for content-visibility to get
    wrong.
  */

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      {/*
        The panel is a DOM child of <nav> even though it is drawn below it, so
        moving the pointer from a menu item down into the panel never leaves
        <nav> and never fires this. That is the whole reason it is nested here
        rather than being a sibling: a mega-menu that closes in the gap between
        the trigger and its own contents is unusable with a mouse.
      */}
      <nav
        onMouseLeave={() => setOpenPanel(null)}
        /*
          Opening a panel deliberately does NOT put the bar into its scrolled
          state. It used to, and hovering Services at the top of the page pulled
          the header in from 1400 to 1200 and drew a border round it, so the
          whole bar jumped sideways under the pointer. The bar belongs to the
          page position, not to the menu. Only the panel appears.
        */
        /*
          !! THE BORDER AND THE RADIUS ARE ALWAYS THERE. ONLY THE COLOUR MOVES !!

          This toggled `border` and `rounded-2xl` on and off under
          `transition-all`, and it flickered a hard cornered rectangle through
          the middle of every transition. Two causes, and the first is easy to
          miss.

          `border-style` does not animate. Adding the `border` class takes it
          from none to solid, which snaps, so the full weight of the line
          arrived on the first frame. `border-radius` meanwhile was animating
          from 0 to 1rem across half a second. A line at full strength around
          corners that have not rounded yet is a rectangle, and it sat on
          screen for most of those 500ms.

          So the border is declared always, 1px solid transparent, and the
          radius is always 1rem. Neither is visible while the bar is
          transparent and neither has to change shape. Only `border-color`
          moves, and that does animate.

          !! ONLY ONE BORDER COLOUR CLASS AT A TIME, AND THIS IS WHY !!

          The first version of this fix put `border-transparent` in the base
          class list and `border-foreground/10` in the scrolled branch, so both
          were on the element together. They are the same utility at the same
          specificity, which means the winner is whichever Tailwind emits later
          in the stylesheet, not whichever is written last in the attribute.
          `.border-transparent` lands about a kilobyte after
          `.border-foreground/10` in the generated CSS, so transparent won
          permanently and the border never appeared at all.

          The colour therefore lives in the branches. `border` on its own stays
          in the base, because the width and style have to be constant for the
          reason above.

          !! THE DELAY IS ASYMMETRIC, AND IT HAS TO BE !!

          On the way in, the colour and the shadow wait for the geometry to
          finish, then fade in over 200ms. 500 is the full width transition, so
          the line starts only once the bar has actually stopped moving. That
          is the literal request and it is worth keeping literal: at 380 the
          last few percent of travel is still running, which is what made an
          earlier version of this still read as arriving mid-transition.

          On the way out they take no delay. A symmetric delay would hold a
          finished border on screen while the bar expanded back to full width,
          which is the same rectangle in reverse. Fading the line out first and
          moving the geometry underneath is the order that reads correctly in
          both directions.
        */
        /*
          !! THE BLUR IS SWITCHED, NEVER ANIMATED, AND THAT IS THE SECOND BUG !!

          backdrop-filter was in this list on a 500ms duration and it made the
          return to the plain header look stuck.

          Tailwind writes the utility as
          `backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-...)`,
          so dropping the class unsets the variable and the whole value
          collapses to nothing. CSS cannot interpolate a filter list against
          nothing, so it falls back to discrete animation, and a discrete
          transition flips at the halfway point. The blur therefore stayed
          glued on for 250ms while the bar was already expanding, then vanished
          in one frame. Nothing else was stuck. It was the one property that
          could not move.

          It is now 1ms, which makes the flip effectively instant, and the
          delay decides when that instant happens. Going in it waits with the
          border so the panel solidifies as one thing. Coming out it goes
          immediately, because a blur over a background that is already fading
          is the part a reader notices first.

          -webkit-backdrop-filter is listed too. Safari reads that one, and a
          property named in the class but missing from this list would animate
          on its own default rather than on the timing declared here.
        */
        /*
          !! translateZ(0) IS NOT DECORATION, IT PINS THE BLUR TO ITS OWN LAYER !!

          Added 3 September 2026, for a header reported as blinking in two
          places: at the bottom of a long page, and while a carousel moved
          behind it.

          Those look like two bugs and they are one. backdrop-filter has to
          re-sample and re-blur whatever is painted behind this bar on every
          frame that the thing behind it changes. At the bottom of a page that
          is the footer, where components/backgrounds/animated-wave.tsx runs a
          canvas the whole time it is on screen. Beside a carousel it is the
          marquee in app/globals.css, which never stops. Both hold the backdrop
          in a permanent state of re-blur, and a bar being re-rasterised into
          the page every frame is what reads as a blink.

          An identity 3D transform forces this element onto its own compositing
          layer, so the blurred result is kept as a texture instead of being
          redrawn into whatever is beneath it. It is the ordinary workaround
          for backdrop-filter flicker and it changes nothing visually, because
          translating zero on the Z axis of an untransformed element is the
          identity.

          Safe against the two things a transform can break. The mega-menu
          panel is `absolute` inside this element, which is already
          `position: relative`, so its containing block does not move. The
          full screen mobile menu is `position: fixed` and would be captured by
          a transformed ancestor, but it is a sibling of this <nav> rather than
          a child of it. Check that again before moving either one.

          transform is deliberately absent from transitionProperty below. It
          never changes, so it has nothing to animate.
        */
        style={{
          transform: "translateZ(0)",
          transitionProperty:
            "max-width, background-color, backdrop-filter, -webkit-backdrop-filter, border-color, box-shadow",
          transitionDuration: solid
            ? "500ms, 500ms, 1ms, 1ms, 200ms, 200ms"
            : "500ms, 250ms, 1ms, 1ms, 150ms, 150ms",
          transitionDelay: solid
            ? "0ms, 0ms, 500ms, 500ms, 500ms, 500ms"
            : "0ms, 0ms, 0ms, 0ms, 0ms, 0ms",
          transitionTimingFunction: "ease",
        }}
        className={`relative mx-auto rounded-2xl border ${
          solid
            ? "border-foreground/10 bg-background/80 backdrop-blur-xl shadow-lg max-w-[1200px]"
            : "border-transparent bg-transparent max-w-[1400px]"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo. Also the home link, which is why Home is not in the menu. */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            {/*
              !! `priority` CAME OFF THIS ON 26 AUGUST 2026. HERE IS WHY !!

              priority emits a `<link rel="preload" as="image">` into the head,
              and this one landed *above* the article hero's preload on every
              blog post. Two image preloads, both at high priority, and the
              browser worked down the list: the wordmark at the top of the page
              beat the picture that is actually the LCP element. Measured on
              the live site, that hero spent 2.4 seconds in Load Delay having
              been correctly preloaded the entire time.

              `eager` keeps it fetched immediately rather than lazily, so the
              header still paints with no pop-in. It just no longer claims a
              preload slot and a high priority it does not deserve, for 137 by
              28 pixels of wordmark.

              `sizes` is a second, smaller point: without it Next builds a
              1x/2x srcset off the declared 818px width, so a phone downloaded
              the full size asset to draw a 137px mark.
            */}
            {/*
              !! unoptimized IS LOad BEARING, IT IS WHAT KEEPS THE ALPHA !!

              Commit 344aa12 on 26 August 2026 diagnosed this and named this
              exact asset, "the site wordmark in the header of every page", as
              one of seventeen transparent files at risk. It fixed the six
              client logos and left the rest. The badge's turn came on
              1 September in aefda69. This is the wordmark's, reported on
              3 September as a black slab behind the mark on an iPhone.

              /_next/image answers image/jpeg for any Accept header that does
              not name a configured format, that fallback is not configurable,
              and jpeg has no alpha, so the keyed-out ground flattens to black.
              Cloudflare ignores Vary: Accept, so one crawler with a wildcard
              Accept poisons the edge for every reader after it.

              Measured on www.hitasoft.com the morning this was fixed: w=32,
              64, 128, 640, 750 and 1080 were all cached as image/jpeg, while
              48, 96, 256, 384 and 828 were webp. A phone at 3x draws this at
              about 471 device pixels and picks 640 out of the srcset, which is
              why it broke on a phone and looked fine on every desktop.

              unoptimized points the tag at /hitasoft-logo.webp itself, so
              there is no negotiation to get wrong and no poisoned URL to
              purge. The file is 818x167 drawing at 137x28, so the optimizer
              was saving a few hundred bytes for the privilege of this.

              !! THIS IS BELT AND BRACES, NOT THE FIX !!

              The fix is the Cloudflare rule written into next.config.mjs by
              344aa12, which stops the edge caching responses to requests that
              never asked for webp. That still has to be applied in the
              dashboard, and until it is, every remaining transparent asset
              under public/ can break the same way.
            */}
            <Image
              src={site.logo.src}
              alt={site.logo.alt}
              width={site.logo.width}
              height={site.logo.height}
              unoptimized
              loading="eager"
              fetchPriority="low"
              sizes="140px"
              className={`w-auto transition-all duration-500 ${isScrolled ? "h-6" : "h-7"}`}
            />
          </Link>

          {/*
            Desktop navigation. This was md: while the menu held three items.
            Five items plus a wordmark, a theme toggle and a button do not fit
            at 768, so the breakpoint moved up and the gap came down from 12.
          */}
          <div className="hidden lg:flex items-center gap-8">
            {mainNav.map((item) => {
              const active = isCurrentBranch(pathname, item.href);
              const open = openPanel === item.name;
              return (
                <Fragment key={item.name}>
                <Link
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  aria-current={active ? "page" : undefined}
                  aria-expanded={item.panel ? open : undefined}
                  aria-controls={item.panel ? panelKey(panelId, item.name) : undefined}
                  onMouseEnter={() => setOpenPanel(item.panel ? item.name : null)}
                  onFocus={() => setOpenPanel(item.panel ? item.name : null)}
                  /*
                    Weight stays at 400. It went to 600 for one revision, to
                    fix labels disappearing against the dot matrix behind the
                    header, and a bold menu was heavier than anything else on
                    a site built out of hairlines and a serif display face.
                    Contrast was the actual problem, so contrast is what
                    changed: the resting colour is full strength rather than 70
                    per cent, and the inactive state is now carried by the
                    underline alone.
                  */
                  className={`text-sm transition-colors duration-300 relative group inline-flex items-center gap-1.5 ${
                    active || open
                      ? "text-foreground"
                      : "text-foreground hover:text-foreground"
                  }`}
                >
                  {item.name}
                  {item.panel && (
                    <ChevronDown
                      aria-hidden
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        open ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  {/*
                    The hover rule doubles as the current page marker. On the
                    active route it is already drawn, so the menu says where you
                    are without a second device competing with it.
                  */}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>

                {/*
                  The panel sits here, directly after the item that opens it,
                  so tab order matches what the visitor sees. It was rendered
                  after the whole menu and the call to action, which meant
                  opening Services with the keyboard then tabbing through five
                  unrelated controls to reach it.
                */}
                {item.panel && (
                  <MegaPanel
                    id={panelKey(panelId, item.name)}
                    item={item}
                    open={open}
                    pathname={pathname}
                  />
                )}
                </Fragment>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle compact={isScrolled} />
            <Button
              asChild
              size="sm"
              className={`bg-primary hover:bg-primary/90 text-primary-foreground rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
            >
              <QuoteLauncher placement="header">
                {/*
                  The icon says the button opens an assistant rather than a
                  form, which is the one thing the two words cannot. aria-hidden
                  because the label already names the action - a screen reader
                  announcing "sparkles free quote" is noise.
                */}
                <Sparkles aria-hidden />
                {quoteCtaLabel}
              </QuoteLauncher>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle compact />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

      </nav>

      {/* Mobile Menu - Full Screen Overlay */}
      <div
        /*
          !! `invisible` WHEN CLOSED, OR IT EATS THE PAGE'S SCROLL !!

          This was `opacity-0 pointer-events-none` and stayed in the layout, a
          full screen `fixed` box that is its own scroll container. On Android
          Chrome that still swallowed touch scrolling once the menu had been
          opened and closed, so the whole site became unscrollable until a
          reload. `pointer-events: none` does not reliably keep a scroller out
          of touch hit testing there. Reported 10 September 2026.

          `visibility: hidden` takes it out of hit testing altogether, and
          because visibility is in `transition-all` the fade still plays: the
          value stays `visible` for as long as either end of the transition is
          visible, so the box holds for the full 500ms and only then goes.
        */
        className={`lg:hidden fixed inset-0 bg-background z-40 overflow-y-auto overscroll-contain transition-all duration-500 ${
          isMobileMenuOpen
            ? "visible opacity-100 pointer-events-auto"
            : "invisible opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        {/*
          The close button lives in the overlay, not in the header bar. The bar
          sits under this at z-40 vs z-50 and is deliberately covered, so its
          own toggle is unreachable while the menu is open.
        */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Close menu"
          className="absolute right-6 top-6 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
        >
          <X aria-hidden className="h-6 w-6" />
        </button>

        <div className="flex flex-col min-h-full px-8 pt-28 pb-8">
          {/*
            Was five links at text-5xl, centred with justify-center. The silo
            adds children under two of them, and a fifty pixel accordion does
            not fit on a phone once it is open. Top level drops to 3xl, the
            children sit at base, and the list starts at the top of the screen
            instead of the middle so an expanded section has room to grow.
          */}
          <div className="flex-1 flex flex-col gap-1">
            {mainNav.map((item, i) => {
              const active = isCurrentBranch(pathname, item.href);
              const expanded = openSection === item.name;
              return (
                <div
                  key={item.name}
                  className={`border-b border-foreground/10 transition-all duration-500 ${
                    isMobileMenuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: isMobileMenuOpen ? `${i * 60}ms` : "0ms",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`py-4 text-3xl font-display transition-colors duration-300 ${
                        active ? "text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                    {/*
                      A separate control from the link. Tapping the word goes
                      to the silo parent, which is a real page worth reaching;
                      tapping the chevron opens the children. Merging the two
                      is how a parent page becomes unreachable on a phone.
                    */}
                    {item.panel && (
                      <button
                        onClick={() =>
                          setOpenSection(expanded ? null : item.name)
                        }
                        aria-label={`${expanded ? "Hide" : "Show"} ${item.name} pages`}
                        aria-expanded={expanded}
                        className="p-3 -mr-3 text-muted-foreground"
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            expanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {item.panel && expanded && (
                    <div className="pb-5 flex flex-col gap-4">
                      {item.panel.groups.map((group) => (
                        <div key={group.href}>
                          <Link
                            href={group.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-base font-medium text-foreground"
                          >
                            {group.name}
                          </Link>
                          {group.children && (
                            <ul className="mt-2 flex flex-col gap-2 pl-4 border-l border-foreground/10">
                              {group.children.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-sm text-muted-foreground"
                                  >
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                      {item.panel.footer && (
                        <Link
                          href={item.panel.footer.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm text-muted-foreground inline-flex items-center gap-1.5"
                        >
                          {item.panel.footer.name}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom CTAs */}
          <div
            className={`flex gap-4 pt-8 mt-8 border-t border-foreground/10 transition-all duration-500 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href={actions.caseStudies}>Case studies</Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-primary text-primary-foreground rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <QuoteLauncher placement="mobile_menu">
                {/*
                  The icon says the button opens an assistant rather than a
                  form, which is the one thing the two words cannot. aria-hidden
                  because the label already names the action - a screen reader
                  announcing "sparkles free quote" is noise.
                */}
                <Sparkles aria-hidden />
                {quoteCtaLabel}
              </QuoteLauncher>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * One menu item's panel.
 *
 * Two shapes, picked from the data rather than from a flag. Services holds
 * six silos with sixteen child pages between them, and six columns of that
 * is a wall. So a panel whose groups have children draws a rail of silo names
 * on the left, and the group under the pointer fills the right. Industries and
 * Resources hold no children under any group, so those draw as cards, three to
 * a row.
 *
 * !! KEYBOARD REACHES THE CHILDREN THROUGH THE PARENT PAGES !!
 *
 * Tab order runs down the rail. Focusing a rail item swaps the pane, and the
 * next Tab moves to the next rail item rather than into the pane, so the child
 * links in a rail panel are taken out of the tab order deliberately. Every one
 * of them is listed on the silo page the rail item points at, which is a real
 * page rather than a menu, so nothing here is reachable by mouse only.
 *
 * The panel stays mounted while closed rather than being conditionally
 * rendered, so the fade has something to fade, and `pointer-events-none` keeps
 * the invisible copy from swallowing clicks meant for the page underneath.
 */
function MegaPanel({
  id,
  item,
  open,
  pathname,
}: {
  id: string;
  item: NavItem;
  open: boolean;
  pathname: string;
}) {
  const panel = item.panel;
  const groups = panel?.groups ?? [];
  const tiered = groups.some((group) => group.children?.length);

  /** Which silo the right hand pane is showing. Rail panels only. */
  const [activeIndex, setActiveIndex] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);

  /*
   * Back to the first silo once the panel closes, so it opens the same way
   * every time rather than wherever the pointer happened to leave it. Adjusted
   * during render, which is what React documents for resetting state on a
   * changed input. An effect would show the stale pane for one frame.
   */
  if (wasOpen !== open) {
    setWasOpen(open);
    if (!open) setActiveIndex(0);
  }

  if (!panel) return null;

  return (
    <div
      id={id}
      aria-hidden={!open}
      /*
        !! `invisible` ON THE CLOSED PANEL IS A CLS FIX, NOT A TIDY UP !!

        PageSpeed reported CLS 0.199 on the desktop run, and every culprit it
        named was in here: two of these panels' `font-display text-2xl` silo
        names, the /resources trigger, a pair of eyebrows. Nothing from the
        page itself appeared at all.

        The panel is a child of <header>, which animates `top`, `left` and
        `right` from 0 to 1rem over 500ms once the page scrolls past 24px. Those
        are layout properties rather than transforms, so the bar genuinely
        narrows by 32px and every frame is a real re-layout. This panel is
        `left-0 right-0` inside it, so it narrows too and its three column card
        grid reflows, moving every silo name sideways.

        It was doing that while closed and invisible, because `opacity-0` does
        not exempt an element from layout shift. Chrome's heuristic skips
        `visibility: hidden` and `display: none` and nothing else, so a menu
        nobody had opened was scoring most of the page's CLS. Lighthouse scrolls
        during its run, which is what fires it.

        !! `transition-all` STAYS. NAMING THE PROPERTIES HERE BROKE THE DROP !!

        The first version of this fix replaced `transition-all` with
        `transition-[opacity,transform,visibility]`, so that the closed branch
        could give `visibility` a delay of its own. It shipped a panel that
        snapped into place instead of easing down.

        Tailwind 4 does not write these as `transform`. `-translate-y-2` emits
        `translate: var(--tw-translate-x) var(--tw-translate-y)`, using the
        separate `translate` property, and `scale` and `rotate` are separate in
        the same way. A list naming `transform` therefore covers none of them,
        the fade still ran, and the drop jumped. `all` covers whatever the
        utilities happen to emit, which is the whole argument for keeping it.

        !! THE FADE OUT SURVIVES BECAUSE visibility IS TRANSITIONED, NOT TOGGLED !!

        A bare `visibility: hidden` on the closed branch would take the panel
        away on the first frame of closing, with no fade at all. `transition-all`
        covers `visibility` too, and a visibility transition holds the value at
        `visible` for as long as either end of it is visible. So the panel keeps
        its box for the full 300ms, fades out, and goes hidden only at the end.
        Opening is immediate for the same reason, from the other direction.

        That rule is what removes the need for a per-property delay, and so for
        naming properties at all. If a future engine ever flips it early the
        symptom is a fade that cuts short, which is worth knowing before
        reaching for the property list again.
      */
      className={`absolute left-0 right-0 top-full pt-2 transition-all duration-300 ${
        open
          ? "visible opacity-100 translate-y-0 pointer-events-auto"
          : "invisible opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      {/*
        Fully opaque. At 95% the page behind still read through the panel —
        the hero watermark and headline sat visibly under the menu copy — and
        a blur cannot rescue text laid over moving artwork.
      */}
      <div className="bg-background border border-foreground/10 rounded-2xl shadow-lg overflow-hidden">
        {tiered ? (
          <div className="grid grid-cols-[minmax(240px,300px)_1fr]">
            {/* The rail. One row per silo, each a link to the silo page. */}
            <div className="border-r border-foreground/10 p-2">
              {groups.map((group, i) => {
                const selected = i === activeIndex;
                const here = isCurrentBranch(pathname, group.href);
                return (
                  <Link
                    key={group.href}
                    href={group.href}
                    tabIndex={open ? undefined : -1}
                    onMouseEnter={() => setActiveIndex(i)}
                    onFocus={() => setActiveIndex(i)}
                    aria-current={here ? "true" : undefined}
                    className={`group/rail flex items-center justify-between gap-3 rounded-lg px-4 py-3 transition-colors ${
                      selected ? "bg-foreground/5" : "hover:bg-foreground/5"
                    }`}
                  >
                    <span className="min-w-0">
                      <span
                        className={`block text-sm font-medium ${
                          here ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {group.name}
                      </span>
                      {/*
                        The short line, not the blurb. See railNote on NavGroup
                        in content/types.ts for why they are separate strings.
                        It truncates rather than wraps, because a second line
                        here costs more height than the footer strip this
                        replaced gave back.
                      */}
                      {group.railNote && (
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {group.railNote}
                        </span>
                      )}
                    </span>
                    <ArrowRight
                      aria-hidden
                      className={`w-4 h-4 shrink-0 text-muted-foreground transition-all ${
                        selected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/*
              The pane, and the reason the panel does not resize.

              Every silo is rendered, all of them stacked into the same single
              grid cell, and only the selected one is drawn. A CSS grid sizes
              itself to its tallest child, so the height is the tallest silo's
              height no matter which one is showing, and it is worked out from
              the content rather than from a number somebody typed. Add a
              fourth child page to a silo and the panel grows once, for every
              silo, instead of jumping as the pointer moves down the rail.

              It was one pane rendered from the active silo, which meant two
              children were shorter than four and the whole panel snapped taller
              and shorter under the pointer.

              The hidden copies are inert: aria-hidden, no pointer events, and
              their links were already out of the tab order.
            */}
            <div className="grid px-8 py-7">
              {groups.map((group, i) => {
                const selected = i === activeIndex;
                return (
                  <div
                    key={group.href}
                    aria-hidden={!selected}
                    className={`col-start-1 row-start-1 transition-opacity duration-200 ${
                      selected ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <Link
                      href={group.href}
                      tabIndex={-1}
                      className="group/parent inline-flex items-center gap-2"
                    >
                      <span className="font-display text-2xl tracking-tight transition-colors group-hover/parent:text-muted-foreground">
                        {group.name}
                      </span>
                    </Link>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-lg">
                      {group.blurb}
                    </p>

                    {/*
                      gap-x-4 was 16 pixels, and each row bleeds its hover panel
                      12 pixels past the column on both sides so the text inside
                      stays aligned with the heading above it. That left 4 pixels
                      between one lit row and the next column's text, which read
                      as the highlight running underneath its neighbour. The gap
                      has to clear twice the bleed with room to spare, so 40.
                    */}
                    <ul className="mt-6 grid grid-cols-2 gap-x-10 gap-y-1">
                      {(group.children ?? []).map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            tabIndex={-1}
                            aria-current={pathname === child.href ? "page" : undefined}
                            className={`block rounded-lg px-3 py-2.5 -mx-3 transition-colors hover:bg-foreground/5 ${
                              pathname === child.href ? "bg-foreground/5" : ""
                            }`}
                          >
                            <span className="block text-sm font-medium text-foreground">
                              {child.name}
                            </span>
                            <span className="block mt-0.5 text-xs text-muted-foreground leading-relaxed">
                              {child.blurb}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /*
            Three across, whatever the card count. A silo with four wraps the
            fourth onto a second row rather than squeezing the columns
            narrower, which keeps the card width identical across every panel.
          */
          <div className="grid grid-cols-3 gap-x-10 gap-y-8 px-8 py-8">
            {groups.map((group) => {
              const here = isCurrentBranch(pathname, group.href);
              return (
                <Link
                  key={group.href}
                  href={group.href}
                  tabIndex={open ? undefined : -1}
                  className="group/card"
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className={`font-display text-2xl tracking-tight transition-colors ${
                        here
                          ? "text-muted-foreground"
                          : "text-foreground group-hover/card:text-muted-foreground"
                      }`}
                    >
                      {group.name}
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover/card:opacity-100 group-hover/card:translate-x-0"
                    />
                  </span>
                  <span className="mt-2 block text-sm text-muted-foreground leading-relaxed">
                    {group.blurb}
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        {panel.footer && (
          <div className="border-t border-foreground/10 px-8 py-4">
            <Link
              href={panel.footer.href}
              tabIndex={open ? undefined : -1}
              className="group/footer inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {panel.footer.name}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/footer:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  /* The full-screen mobile menu scrolls the page underneath it otherwise. */
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileMenuOpen]);

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
        style={{
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
            <Image
              src={site.logo.src}
              alt={site.logo.alt}
              width={site.logo.width}
              height={site.logo.height}
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
        className={`lg:hidden fixed inset-0 bg-background z-40 overflow-y-auto transition-all duration-500 ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
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
 * five silos with fourteen child pages between them, and five columns of that
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
      className={`absolute left-0 right-0 top-full pt-2 transition-all duration-300 ${
        open
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
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

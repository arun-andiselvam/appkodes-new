"use client";

import { Fragment, useState, useEffect, useId } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Menu, X, ChevronDown, ArrowRight, LayoutGrid, FileText,
  Briefcase, MapPinned, Clapperboard, Truck, ShoppingBag, Stethoscope,
  ArrowLeftRight, Video, Heart, Camera, House, Radio, Car, Gavel, Coffee,
  ShoppingCart, Users, CalendarCheck, Tv, Wrench, MessageSquare,
  BookOpen, Wallet, Rocket, Palette, Store, Bike, Smartphone, Layers,
  type LucideIcon,
} from "lucide-react";
import { QuoteLauncher } from "@/components/quote/launcher";
import { siWhatsapp } from "simple-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { actions, site, whatsappContact } from "@/content/site";
import { mainNav } from "@/content/navigation";
import type { NavCallout, NavColumnGroup, NavFeature, NavItem, NavSolution, NavStripLink } from "@/content/types";

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

/** The menu leaves out items kept only for the sitemap and breadcrumbs. */
const menuItems = mainNav.filter((item) => !item.menuHidden);

/*
 * WhatsApp's own mark for the header button, in currentColor so it matches
 * the label on the brand-blue button: white in light mode, obsidian in dark.
 * WhatsApp green was tried on 18 September 2026 and clashed with the palette.
 * aria-hidden: the label already says WhatsApp.
 */
function WhatsappIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="fill-current">
      <path d={siWhatsapp.path} />
    </svg>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  /** Slid up out of view: set while scrolling down, cleared on any scroll up. */
  const [isHidden, setIsHidden] = useState(false);
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
   * !! THE BAR HIDES ON THE WAY DOWN AND COMES BACK ON THE WAY UP !!
   *
   * Changed 18 September 2026 at the client's request. The bar used to shrink
   * into a narrower floating card once the page scrolled. Now it keeps its full
   * width and height at every position: it slides out of view while reading
   * down the page, and any scroll back up brings it straight back, solid.
   *
   * isScrolled still uses two thresholds, 24 in and 12 out, so a trackpad
   * parked on the boundary cannot strobe the background on and off.
   *
   * Direction is read against the last position that produced a decision,
   * not the last frame, and only moves of 6px or more count. A slow scroll up
   * therefore still adds up to a reveal, and momentum jitter does not flip it.
   * Near the top (under 80px) it is always shown.
   *
   * Coalesced into one rAF and passive, as before: the handler runs far more
   * often than the screen refreshes, and nothing here calls preventDefault.
   *
   * A jump from an in-page link (the service page's section bar, "#faq" and
   * the like) is not the reader scrolling, so it never reveals the bar
   * (client, 19 September 2026): the scroll that follows such a click keeps
   * the bar hidden and becomes the new baseline.
   */
  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;
    let jumping = false;
    let jumpTimer = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      setIsScrolled((was) => (was ? y > 12 : y > 24));
      if (y < 80) {
        setIsHidden(false);
        lastY = y;
        return;
      }
      if (jumping) {
        jumping = false;
        setIsHidden(true);
        lastY = y;
        return;
      }
      const dy = y - lastY;
      if (Math.abs(dy) < 6) return;
      setIsHidden(dy > 0);
      lastY = y;
    };
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href^='#']");
      if (!link || link.getAttribute("href") === "#") return;
      jumping = true;
      window.clearTimeout(jumpTimer);
      // If the link does not scroll (already in place), stop ignoring.
      jumpTimer = window.setTimeout(() => (jumping = false), 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick, true);
      window.clearTimeout(jumpTimer);
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
      /*
        Full width at every scroll position. Only `transform` moves, and only
        while hidden: a transform on this element makes it the containing block
        for the full screen mobile menu below, which is `position: fixed`. So
        it is `none` whenever the bar is showing, and the bar never hides while
        that menu or a mega-menu panel is open. Focus arriving inside a hidden
        bar, from a keyboard, brings it back.
      */
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        transform: isHidden && !isMobileMenuOpen && !openPanel ? "translateY(-100%)" : "none",
        transition: "transform 300ms ease",
      }}
      onFocus={() => setIsHidden(false)}
    >
      {/*
        The solid background, on its own layer behind the bar.

        !! NOT ON <header> ITSELF. backdrop-filter WOULD TRAP THE MOBILE MENU !!

        A backdrop-filter makes an element the containing block for fixed
        descendants, exactly like a transform, and the mobile menu is one. This
        layer is a sibling of it rather than an ancestor, so the blur can stay
        on permanently and only the opacity fades. translateZ(0) keeps the
        blurred result on its own compositing layer, which is what stopped the
        bar blinking over the footer canvas and the marquees (3 September 2026).
      */}
      {/*
        The fade behind the transparent bar at the top of the page. Page colour
        solid for the top 40% and clear by 144px, well past the bar's 80px, so
        an animated hero backdrop (the signal traces) never runs behind the
        menu text. Ending it at the bar's own edge let a trace just under the
        labels read as an underline. Added 18 September 2026. Hands over to the
        solid layer below once the page scrolls.
      */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-background from-40% to-transparent transition-opacity duration-300 ${
          solid ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 border-b border-foreground/10 bg-background/80 backdrop-blur-xl shadow-sm transition-opacity duration-300 ${
          solid ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "translateZ(0)" }}
      />
      {/*
        The panel is a DOM child of <nav> even though it is drawn below it, so
        moving the pointer from a menu item down into the panel never leaves
        <nav> and never fires this. That is the whole reason it is nested here
        rather than being a sibling: a mega-menu that closes in the gap between
        the trigger and its own contents is unusable with a mouse.
      */}
      <nav
        onMouseLeave={() => setOpenPanel(null)}
        className="relative mx-auto max-w-[1400px]"
      >
        <div
          className="flex items-center justify-between px-6 lg:px-8 h-20"
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
              preload slot and a high priority it does not deserve, for 186 by
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

              unoptimized points the tag at the .webp itself, so
              there is no negotiation to get wrong and no poisoned URL to
              purge. The file is 1080x163 drawing at 186x28, so the optimizer
              was saving a few hundred bytes for the privilege of this.

              !! THIS IS BELT AND BRACES, NOT THE FIX !!

              The fix is the Cloudflare rule written into next.config.mjs by
              344aa12, which stops the edge caching responses to requests that
              never asked for webp. That still has to be applied in the
              dashboard, and until it is, every remaining transparent asset
              under public/ can break the same way.
            */}
            {/*
              Two copies, one per theme: the navy half of the mark disappears
              on the dark background, so dark mode swaps in the white-navy
              variant. See the note on site.logo in content/site.ts. Both stay
              eager so the toggle never shows a gap; each file is about 8KB.
            */}
            <Image
              src={site.logo.src}
              alt={site.logo.alt}
              width={site.logo.width}
              height={site.logo.height}
              unoptimized
              loading="eager"
              fetchPriority="low"
              sizes="190px"
              className="w-auto h-7 dark:hidden"
            />
            <Image
              src={site.logo.srcOnDark}
              alt={site.logo.alt}
              width={site.logo.width}
              height={site.logo.height}
              unoptimized
              loading="eager"
              fetchPriority="low"
              sizes="190px"
              className="w-auto h-7 hidden dark:block"
            />
          </Link>

          {/*
            Desktop navigation. This was md: while the menu held three items.
            Five items plus a wordmark, a theme toggle and a button do not fit
            at 768, so the breakpoint moved up and the gap came down from 12.
          */}
          <div className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => {
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
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="bg-primary hover:bg-primary-hover hover:shadow-glow text-primary-foreground rounded-lg px-6"
            >
              <a href={whatsappContact.href} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon />
                {whatsappContact.label}
              </a>
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

        {/*
          pt-20, not pt-28. The 112px was room for the header bar, from when it
          sat above this overlay. The overlay covers the bar now and carries its
          own close button, which ends 68px down (top-6 plus h-11), so 80px
          clears it. Trimmed on 10 September 2026 so the menu and both buttons
          fit on a phone screen; a very short screen still scrolls.
        */}
        <div className="flex flex-col min-h-full px-8 pt-20 pb-8">
          {/*
            Was five links at text-5xl, centred with justify-center. The silo
            adds children under two of them, and a fifty pixel accordion does
            not fit on a phone once it is open. Top level drops to 3xl, the
            children sit at base, and the list starts at the top of the screen
            instead of the middle so an expanded section has room to grow.
          */}
          <div className="flex-1 flex flex-col gap-1">
            {menuItems.map((item, i) => {
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
                      className={`py-3.5 text-3xl font-display transition-colors duration-300 ${
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

                  {item.panel?.columns && expanded && (
                    <div className="pb-5 flex flex-col gap-5">
                      {item.panel.columns.flat().map((group) => (
                        <div key={group.name}>
                          <p className="text-base font-medium text-foreground">{group.name}</p>
                          <ul className="mt-2 flex flex-col gap-2 pl-4 border-l border-foreground/10">
                            {group.links.map((link) => (
                              <li key={link.href}>
                                <MenuLink
                                  href={link.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="text-sm text-muted-foreground"
                                >
                                  {link.name}
                                </MenuLink>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.panel?.solutions && expanded && (
                    <ul className="pb-5 flex flex-col gap-3">
                      {item.panel.solutions.map((solution) => (
                        <li key={solution.name}>
                          <MenuLink
                            href={solution.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block"
                          >
                            <span className="block text-base font-medium text-foreground">{solution.name}</span>
                            <span className="block text-sm text-muted-foreground">{solution.note}</span>
                          </MenuLink>
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.panel && !item.panel.columns && !item.panel.solutions && expanded && (
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

          {/*
            Bottom CTAs. No border-t of their own: the last menu item already
            draws a rule beneath itself, so a second one here printed two lines
            with an empty strip between them. mt-6 in place of mt-8 plus pt-8.
          */}
          <div
            className={`flex gap-4 mt-6 transition-all duration-500 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Button
              asChild
              variant="outline"
              className="flex-1 rounded-lg h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href={actions.caseStudies}>Case studies</Link>
            </Button>
            <Button
              asChild
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <a href={whatsappContact.href} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon />
                {whatsappContact.label}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}


/**
 * next/link for paths on this site, a plain anchor for anything absolute.
 * The Services links still point at appkodes.com, see content/navigation.ts.
 * A WhatsApp link opens in a new tab so the site stays where it was.
 */
function MenuLink({
  href,
  children,
  className,
  tabIndex,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  tabIndex?: number;
  onClick?: () => void;
}) {
  if (/^https?:\/\//.test(href)) {
    const newTab = href.startsWith("https://wa.me/");
    return (
      <a
        href={href}
        className={className}
        tabIndex={tabIndex}
        onClick={onClick}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} tabIndex={tabIndex} onClick={onClick}>
      {children}
    </Link>
  );
}

/*
 * Thin-line glyphs for the Solutions menu, keyed from content/navigation.ts.
 */
const SOLUTION_ICONS: Record<string, LucideIcon> = {
  arrowLeftRight: ArrowLeftRight,
  clapperboard: Clapperboard,
  video: Video,
  heart: Heart,
  camera: Camera,
  house: House,
  radio: Radio,
  stethoscope: Stethoscope,
  car: Car,
  gavel: Gavel,
  coffee: Coffee,
  shoppingCart: ShoppingCart,
  users: Users,
  calendarCheck: CalendarCheck,
  tv: Tv,
  wrench: Wrench,
  messageSquare: MessageSquare,
  truck: Truck,
  // Resources menu categories.
  bookOpen: BookOpen,
  wallet: Wallet,
  rocket: Rocket,
  palette: Palette,
  store: Store,
  bike: Bike,
  smartphone: Smartphone,
  layers: Layers,
};

/**
 * The Solutions menu, 18 September 2026: appkodes.com's eighteen ready-made
 * apps as a three-column list, filled down each column in their order there.
 * A thin-line icon, the solution's name, and a note naming the product it
 * resembles, on hairline rows in the same quiet style as the Services list.
 */
function SolutionsPanel({
  solutions,
  callout,
  open,
}: {
  solutions: NavSolution[];
  callout?: NavCallout;
  open: boolean;
}) {
  const tab = open ? undefined : -1;
  const rows = Math.ceil(solutions.length / 3);
  // The Resources categories share one placeholder href, so rows key on name.
  return (
    <div className="grid grid-cols-[1fr_292px]">
    <ul
      className="grid grid-cols-3 grid-flow-col gap-x-10 px-9 py-6 border-r border-foreground/10"
      style={{ gridTemplateRows: `repeat(${rows}, auto)` }}
    >
      {solutions.map((solution) => {
        const Icon = SOLUTION_ICONS[solution.icon] ?? Briefcase;
        return (
          <li key={solution.name}>
            <MenuLink
              href={solution.href}
              tabIndex={tab}
              className="group/sol flex items-center gap-3.5 py-3 transition-colors"
            >
              {/*
                Hover: the icon turns blue, grows a little and tilts, on an
                overshooting curve so it settles with a small spring. Transform
                only, so it costs no layout. Off for reduced motion.
              */}
              <Icon
                aria-hidden
                strokeWidth={1.25}
                className="w-6 h-6 shrink-0 text-muted-foreground transition-[color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/sol:text-primary motion-safe:group-hover/sol:scale-115 motion-safe:group-hover/sol:-rotate-8"
              />
              <span className="min-w-0">
                <span className="block text-[15px] tracking-[-0.01em] transition-colors group-hover/sol:text-primary">
                  {solution.name}
                </span>
                <span className="block text-xs text-muted-foreground truncate">{solution.note}</span>
              </span>
            </MenuLink>
          </li>
        );
      })}
    </ul>

      {callout && (
        /* The same blue card as the Services menu, a plain contact step. */
        <div
          className="m-3 rounded-xl p-6 flex flex-col text-white"
          style={{ background: "var(--feature-card)" }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/80">
            {callout.eyebrow}
          </span>
          <p className="mt-3 text-2xl font-display tracking-tight leading-[1.1]">{callout.title}</p>
          <p className="mt-2 text-sm text-white/90 leading-relaxed">{callout.text}</p>
          <Button
            asChild
            size="sm"
            className="mt-auto self-start rounded-lg bg-white px-4 text-[color:var(--feature-card-ink)] hover:bg-white/90"
          >
            <MenuLink href={callout.cta.href} tabIndex={tab}>
              {callout.cta.name}
              <ArrowRight aria-hidden />
            </MenuLink>
          </Button>
        </div>
      )}
    </div>
  );
}

/*
 * Thin-line glyphs beside each Services group label, keyed from
 * content/navigation.ts so the data file stays free of React imports. They
 * replaced a link count (04, 03), which told the reader nothing useful.
 */
const GROUP_ICONS: Record<string, LucideIcon> = {
  services: Briefcase,
  onDemand: MapPinned,
  entertainment: Clapperboard,
  delivery: Truck,
  buySell: ShoppingBag,
  healthcare: Stethoscope,
};

/**
 * The Services mega menu, 18 September 2026. Chosen by the client from four
 * drafts as a combination of two: the editorial list (small labels with a
 * count over short, quiet links that slide an arrow in on hover, and a strip
 * of next steps under them) and the tiles draft's brand-blue feature card.
 * Every link leaves the tab order while the panel is closed, as in the other
 * panels.
 */
function ColumnsPanel({
  columns,
  feature,
  strip,
  open,
}: {
  columns: NavColumnGroup[][];
  feature?: NavFeature;
  strip?: NavStripLink[];
  open: boolean;
}) {
  const tab = open ? undefined : -1;
  const groups = columns.flat();
  return (
    <div className="grid grid-cols-[1fr_292px]">
      {/* 292px: the card keeps its 268px width with a 12px gap on both sides. */}
      {/* The rule on the right is the separator from the feature card. */}
      <div className="flex flex-col border-r border-foreground/10">
        <div className="grid grid-cols-3 gap-x-10 gap-y-7 px-9 pt-8 pb-7">
          {groups.map((group) => {
            const Icon = GROUP_ICONS[group.icon] ?? Briefcase;
            return (
            <div key={group.name}>
              <p className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                {group.name}
                <Icon aria-hidden strokeWidth={1.25} className="w-[18px] h-[18px] opacity-70" />
              </p>
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <MenuLink
                      href={link.href}
                      tabIndex={tab}
                      className="group/link flex items-center gap-1.5 py-1 text-[15px] tracking-[-0.01em] transition-colors hover:text-primary"
                    >
                      {link.name}
                      <ArrowRight
                        aria-hidden
                        className="w-3.5 h-3.5 text-primary opacity-0 -translate-x-1.5 transition-all group-hover/link:opacity-100 group-hover/link:translate-x-0"
                      />
                    </MenuLink>
                  </li>
                ))}
              </ul>
            </div>
            );
          })}
        </div>

        {strip && strip.length > 0 && (
          <div
            className="mt-auto grid border-t border-foreground/10"
            style={{ gridTemplateColumns: `repeat(${strip.length}, minmax(0, 1fr))` }}
          >
            {strip.map((item) => {
              const cell =
                "flex items-center gap-3 px-9 py-4 text-left border-r border-foreground/10 last:border-r-0 transition-colors hover:bg-foreground/[0.03]";
              const body = (
                <>
                  <span className="grid place-items-center w-9 h-9 shrink-0 rounded-full bg-primary/10 text-primary [&_svg]:w-4 [&_svg]:h-4">
                    {item.icon === "whatsapp" ? (
                      <WhatsappIcon />
                    ) : item.icon === "quote" ? (
                      <FileText aria-hidden />
                    ) : (
                      <LayoutGrid aria-hidden />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{item.name}</span>
                    <span className="block text-xs text-muted-foreground">{item.note}</span>
                  </span>
                </>
              );
              // "quote" opens the same assistant as every costed-plan button.
              return item.href === "quote" ? (
                <QuoteLauncher key={item.name} placement="header" tabIndex={tab} className={cell}>
                  {body}
                </QuoteLauncher>
              ) : (
                <MenuLink
                  key={item.name}
                  href={item.href === "whatsapp" ? whatsappContact.href : item.href}
                  tabIndex={tab}
                  className={cell}
                >
                  {body}
                </MenuLink>
              );
            })}
          </div>
        )}
      </div>

      {feature && (
        /*
          Fixed colours in both themes, from app/brand.css: the card is its own
          blue object, and white on #0040cc is well past AA (8.06:1).
        */
        <div
          className="m-3 rounded-xl p-6 flex flex-col text-white"
          style={{ background: "var(--feature-card)" }}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-white/80">
            {feature.eyebrow}
          </span>
          <p className="mt-3 text-2xl font-display tracking-tight leading-[1.1]">{feature.title}</p>
          <p className="mt-2 text-sm text-white/90 leading-relaxed">{feature.text}</p>
          <div className="mt-auto pt-5 grid grid-cols-2 gap-3 border-t border-white/20">
            {feature.stats.map((stat) => (
              <span key={stat.label}>
                <span className="block text-2xl font-display">{stat.value}</span>
                <span className="block text-xs text-white/80">{stat.label}</span>
              </span>
            ))}
          </div>
          <Button
            asChild
            size="sm"
            className="mt-5 self-start rounded-lg bg-white px-4 text-[color:var(--feature-card-ink)] hover:bg-white/90"
          >
            <QuoteLauncher placement="header" tabIndex={tab}>
              {feature.cta}
              <ArrowRight aria-hidden />
            </QuoteLauncher>
          </Button>
        </div>
      )}
    </div>
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

        The panel is a child of <header>, which until 18 September 2026 animated
        `top`, `left` and `right` from 0 to 1rem over 500ms past 24px of scroll. Those
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
      {/*
        The --menu-* tokens from app/brand.css: white with the usual line and
        shadow in light mode, a deep navy with a brighter edge and a plain
        shadow in dark, where the page's own obsidian left the panel melting into
        the hero (18 September 2026). --muted-foreground is re-pointed at
        --menu-muted inside the panel.
      */}
      <div
        className="text-popover-foreground border rounded-2xl overflow-hidden"
        style={{
          background: "var(--menu-surface)",
          borderColor: "var(--menu-border)",
          boxShadow: "var(--menu-shadow)",
          ["--muted-foreground" as string]: "var(--menu-muted)",
        }}
      >
        {panel.solutions ? (
          <SolutionsPanel solutions={panel.solutions} callout={panel.callout} open={open} />
        ) : panel.columns ? (
          <ColumnsPanel columns={panel.columns} feature={panel.feature} strip={panel.strip} open={open} />
        ) : tiered ? (
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

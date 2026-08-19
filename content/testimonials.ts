import type { TestimonialSlide } from "./types";

/**
 * Real clients only.
 *
 * !! WHAT WAS HERE BEFORE WAS INVENTED !!
 *
 * Four quotes attributed to Sarah Chen at Meridian Labs, Marcus Webb at Flux
 * Systems, Elena Rodriguez at Beacon AI and James Liu at Prism Analytics. None
 * of those people exist. They praised deployment pipelines and 99.99% uptime,
 * which is not what Appkodes sells. Same failure as the SOC 2 badge in the
 * security section and the Stripe stat the template shipped with.
 *
 * Everything below is a real Trustpilot review, read off the public profile on
 * 19 August 2026 and published under a name anyone can check against the
 * source. Names, dates and photographs are the reviewers' own.
 *
 * Long reviews are cut at a sentence boundary rather than mid thought, so no
 * quote ends up saying something its author did not. Nothing is reworded.
 *
 * Trustpilot's own titles are dropped. It builds them from the opening words,
 * so half arrive truncated mid sentence, and one had scraped navigation text
 * spliced through it. The review body is the part with something in it.
 *
 * !! THESE ARE THE FIVE STAR REVIEWS, NOT ALL OF THEM !!
 *
 * The profile also holds three one star reviews, every one about a catalogue
 * script rather than delivered work. Picking the good ones is ordinary and
 * every company does it, but the page has to say so. The copy states outright
 * that we chose these, the score beside them counts all twenty nine, and the
 * link goes to the lot. A curated wall passing itself off as the whole record
 * is the exact failure this file already shipped once.
 *
 * Photographs are local files under public/testimonials rather than hotlinks.
 * That keeps img-src closed, survives Trustpilot moving their CDN, and means
 * the page makes no third party request. Six came off the profile and eight
 * were supplied by Appkodes on 19 August 2026, two of those replacing the 73
 * pixel stills Trustpilot serves.
 *
 * Two still have none and fall back to initials: Fast Fiber Networks and
 * Bader. Drop a file into public/testimonials and add a photo line to pick it
 * up.
 *
 * Display names are the ones on Trustpilot, not fuller ones we happen to know.
 * The supplied files for John and Gomez are titled John Sario and Jairo Gomez,
 * and those surnames stay off the page. A reader checking a quote against the
 * profile should find the same name, and a reviewer who published only a first
 * name chose that.
 *
 * Client videos share this array, so a clip sits among the reviews rather than
 * in a row of its own. Order here is the order on screen, and the four videos
 * lead because a client on camera outranks anything in text.
 *
 * Thumbnails are downloaded into public/testimonials rather than pulled from
 * i.ytimg.com, for the same reason as the portraits. Nothing reaches Google
 * until somebody asks for the video.
 *
 * !! CAPTIONS ARE OURS, NOT YOUTUBE'S !!
 *
 * The titles on the channel are written for search and do not belong on a
 * page. One reads "Positive client review for our Amazon Clone product -
 * Appkdoes Fantacy", misspelling the company. Captions below say what the clip
 * is, and no speaker is named because the channel does not name them. Guessing
 * one is exactly what this file was cleaned of.
 *
 * !! ALL FOUR ARE ABOUT CATALOGUE PRODUCTS !!
 *
 * Joysale, the Amazon clone and the Airbnb clone. docs/positioning.md keeps
 * the catalogue in the footer, so the captions describe the work rather than
 * the product line. Worth filming a client of the automation practice, because
 * these four prove Appkodes delivers and say nothing about what the rest of
 * this page is selling.
 */
export const testimonialSlides: TestimonialSlide[] = [
  {
    kind: "video",
    id: "video-joysale",
    youtubeId: "XG2Lz8Sj6hY",
    title: "Seven figures of trade, and the team behind it",
    poster: "/testimonials/yt-XG2Lz8Sj6hY.jpg",
  },
  {
    kind: "video",
    id: "video-marketplace",
    youtubeId: "ZaTmxoCxKO8",
    title: "A marketplace client on how the build went",
    poster: "/testimonials/yt-ZaTmxoCxKO8.jpg",
  },
  {
    kind: "video",
    id: "video-rentals",
    youtubeId: "2zfgzGZCpF8",
    title: "A rentals client on working with the team",
    poster: "/testimonials/yt-2zfgzGZCpF8.jpg",
  },
  {
    kind: "video",
    id: "video-support",
    youtubeId: "14MBwxh8H3I",
    title: "What the support actually looks like",
    poster: "/testimonials/yt-14MBwxh8H3I.jpg",
  },
  {
    kind: "review",
    id: "juan-vasquez",
    name: "Juan Vásquez",
    country: "CL",
    date: "Sep 2025",
    text: "I've worked with Appkodes for 7 years on 4 different projects. We constantly require support or the implementation of new features, and we have the guarantee that the quality of their work remains the same throughout this time.",
    photo: "/testimonials/juan-vasquez.jpg",
  },
  {
    kind: "review",
    id: "global-softwin",
    name: "Global Softwin",
    country: "BR",
    date: "May 2025",
    text: "Appkodes exceeded all of our expectations! From the very first contact, the team demonstrated a high level of professionalism, technical expertise, and commitment to quality.",
    photo: "/testimonials/global-softwin.jpg",
  },
  {
    kind: "review",
    id: "wassim",
    name: "Wassim",
    country: "FR",
    date: "Apr 2025",
    text: "Appkodes team helped me to launch my healthcare application very quickly. Their software was very close to my requirements and adding some extra features made my project easy.",
    photo: "/testimonials/wassim.png",
  },
  {
    kind: "review",
    id: "kolawole-alaba-johnson",
    name: "Kolawole Alaba Johnson",
    country: "NG",
    date: "Apr 2025",
    text: "I so much love your services and I will continue to patronize your company.",
    photo: "/testimonials/kolawole-alaba-johnson.jpg",
  },
  {
    kind: "review",
    id: "yasha-firuz",
    name: "Яша Фируз",
    country: "AU",
    date: "Apr 2025",
    text: "I worked with AppKodes for a website and mobile app development project, and overall, I'm very satisfied with the results. Their team was responsive and flexible throughout the process, and they delivered a product that met my expectations both in design and functionality.",
    photo: "/testimonials/yasha-firuz.png",
  },
  {
    kind: "review",
    id: "prem-sharma",
    name: "Prem Sharma",
    country: "CA",
    date: "Apr 2025",
    text: "It was a good experience working with the team. They understood my ideas clearly and built everything as expected. The team was supportive, quick to respond, and helped me whenever I needed changes. Thank you for your hard work and support!",
    photo: "/testimonials/prem-sharma.png",
  },
  {
    kind: "review",
    id: "fast-fiber-networks",
    name: "Fast Fiber Networks",
    country: "IN",
    date: "Apr 2025",
    text: "I have got a mobile app project going on successfully with the team. Their Support is good. turn around time for any requirement is great. Every detail of my app is meticulously designed. THANK YOU APPKODES.",
  },
  {
    kind: "review",
    id: "bader",
    name: "Bader",
    country: "SA",
    date: "Apr 2025",
    text: "Appkodes is a leader in developing high-quality applications and websites. It was a pleasure working with them, and this certainly won’t be our last collaboration. My experience was exceptional, they developed an outstanding app and website, with smooth and refined interactions.",
  },
  {
    kind: "review",
    id: "vannala-raju",
    name: "Vannala Raju",
    country: "IN",
    date: "Apr 2025",
    text: "Overall very good experience. I have been availing services for past 3 years. They are available for discussions and resolving issues whenever we faced any. Mr. Saravana has been looking after our project and I'm very much happy with his timely response. I would definetely recommend.",
    photo: "/testimonials/vannala-raju.png",
  },
  {
    kind: "review",
    id: "ahmed-nhari",
    name: "Ahmed Nhari",
    country: "MA",
    date: "Apr 2024",
    text: "Initially, I was hesitant to deal with them, believing their customer service would be poor. However, I was surprised. They act with great responsibility and professional efficiency. My regards to them.",
    photo: "/testimonials/ahmed-nhari.jpg",
  },
  {
    kind: "review",
    id: "deniz-secer",
    name: "Deniz Seçer",
    country: "TR",
    date: "Jan 2024",
    text: "You have been supporting me very quickly in every matter, especially in the last 2 months, and this makes me very happy.",
    photo: "/testimonials/deniz-se-er.png",
  },
  {
    kind: "review",
    id: "anu-joseph",
    name: "Anu Joseph",
    country: "OM",
    date: "Jul 2023",
    text: "Very professional. Our project was quite complex and they covered all the aspects. Appkodes did an amazing and professional job developing and creating our Apple and Android apps. I was positively impressed with the communication you can absolutely trust on what they say.",
    photo: "/testimonials/anu-joseph.png",
  },
  {
    kind: "review",
    id: "joely-cineas",
    name: "Joely Cineas",
    country: "US",
    date: "Jul 2023",
    text: "Mani and Saravanan of the Appkodes team are amazing, they have done the best to create and support my project! I give them 10/10 stars for their efforts and work!",
    photo: "/testimonials/joely-cineas.jpg",
  },
  {
    kind: "review",
    id: "gomez",
    name: "Gomez",
    country: "CA",
    date: "Apr 2023",
    text: "It was really great, they are there for me whenever I had a problem or to fix something. Thank you so much Ameer",
    photo: "/testimonials/gomez.jpg",
  },
  {
    kind: "review",
    id: "john",
    name: "John",
    country: "US",
    date: "Feb 2023",
    text: "I've been working with Appkodes for almost a year and i can recommend them to work with as they are so much friendly and professional and you can clearly see it once you start your project right away. They are intact and they are transparent with their communication.",
    photo: "/testimonials/john.jpg",
  },
  {
    kind: "review",
    id: "zack-gizaw",
    name: "Zack Gizaw",
    country: "US",
    date: "Dec 2022",
    text: "I have to be honest, sometimes it's hard to find a company or someone abroad to do your project. Not only might you waste your time and money, there is this thing called trust. In business you must trust the person you are dealing with.",
    photo: "/testimonials/zack-gizaw.jpg",
  },
];

/**
 * The number we do not choose.
 *
 * A rating and a count are facts rather than somebody's words, so they are
 * safe to print. The date is not decoration. A figure with no date is a claim
 * the reader cannot age, and this one moves every time a client writes
 * something, so check it whenever the site is touched.
 */
export const trustpilotSnapshot = {
  score: "4.4",
  outOf: "5",
  reviewCount: 29,
  label: "Excellent",
  checked: "19 August 2026",
  profileUrl: "https://www.trustpilot.com/review/appkodes.com",
} as const;

/**
 * Real clients, restored.
 *
 * The template shipped a row under "Trusted by forward-thinking teams" listing
 * Meridian Labs, Flux Systems, Beacon AI, Prism Analytics, Nova Tech, Quantum
 * Corp, Atlas Digital and Vertex Labs. The first four are where the invented
 * quotes came from and the other four appeared nowhere else. It went out with
 * the fake testimonials on 19 August 2026, since asserting that eight
 * companies which do not exist are clients is the thing this file is cleaned
 * of.
 *
 * These six are the logos appkodes.com already publishes, so they are cleared
 * by the company itself rather than by us. Files are the full size originals
 * from the media library, not the 175 pixel carousel thumbnails, and they are
 * copied into public/clients so the page depends on nothing at appkodes.com
 * staying put.
 *
 * All six are dark artwork on transparent backgrounds, checked rather than
 * assumed, which is why the row inverts in dark mode instead of disappearing.
 *
 * "Forward-thinking" is not coming back. docs/positioning.md bans the
 * buzzwords, and a label that says what the row is beats one that flatters the
 * reader.
 */
export const clientLogos = [
  { name: "Bring the Noise", logo: "/clients/bring_the_noise.webp" },
  { name: "ByChat", logo: "/clients/bychat.webp" },
  { name: "Chosen", logo: "/clients/chosen.webp" },
  { name: "Handy Feet", logo: "/clients/handy_feet.webp" },
  { name: "Stuffill", logo: "/clients/stuffill.webp" },
  { name: "VRA Health", logo: "/clients/vra_health.webp" },
] as const;

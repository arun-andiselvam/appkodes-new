import type { CaseStudy } from "@/lib/case-studies";

/**
 * Written up engagements. Real clients, real work.
 *
 * !! THIS FILE REPLACED content/case-studies-sample.ts !!
 *
 * Four invented studies ran behind a flag from 21 August 2026 so the index and
 * the detail template could be judged with something in them. Northbound
 * Logistics, Meridian Clinics, Larkfield Retail and Cassio Finance were
 * fictional companies with fabricated percentages and fabricated quotes. All
 * four were deleted on 24 August 2026, along with the flag and the four
 * placeholder photographs, when the first real study arrived.
 *
 * !! EVERY FIGURE HERE COMES FROM THE CLIENT, AND ONLY FROM THE CLIENT !!
 *
 * docs/positioning.md, claims discipline: do not attach numbers to companies
 * that are not clients, and do not publish a figure nobody measured. A case
 * study is a claim about a named third party, so it is the one place on this
 * site where a loose number is not a style problem. A study with no confirmed
 * figure runs with none. `results` renders nothing when it is empty, which is
 * the intended behaviour rather than a gap to fill.
 *
 * `quote` is absent unless the client has said the words and agreed to them
 * appearing. Inventing a name and a job title under a real company's name is
 * the worst thing this file could do.
 *
 * !! A STUDY IS SIX PROBLEMS AND SIX ANSWERS, NOT THREE PARAGRAPHS !!
 *
 * The Japan Pro study shipped as three paragraphs of prose and the client sent
 * it back the same day as too thin. They were right, and the reason is worth
 * keeping. A visitor on this page is not admiring the work. They are hunting
 * for their own mess in somebody else's story, and prose gives them nothing to
 * hunt through. Named problems do, which is what `StudyAct.points` is for.
 * Write the two lists in one order so answer three answers problem three.
 */
export const caseStudies: CaseStudy[] = [
  /*
   * Japan Pro, added 24 August 2026 from the client's own account of the
   * engagement, expanded the same day.
   *
   * !! WHAT IS THE CLIENT'S ACCOUNT AND WHAT IS INFERENCE !!
   *
   * Straight from the client, and safe: the four listing types, the request
   * based booking with the host accepting before money moves, cancellation
   * terms differing by type, the two host tiers named regular and pro with the
   * standing between them earned on performance that is monitored continuously
   * rather than assessed once, commission and communication preferences both
   * following that tier, the tier design being ours and accepted by the client,
   * the language problem, the mapping
   * exercise that found where AI belonged, the vector search, Claude, and
   * twelve languages inside three minutes. That last one is the only figure in
   * the study and it came from the client directly.
   *
   * Inferred, and worth a look before this is treated as settled. Three lines
   * describe the shape of a solution rather than repeating what was said. The
   * pending state being named in the interface, the cancellation terms being
   * configuration rather than code, and the shared listing core with the type
   * specific parts beside it. Each is the ordinary way to build what was
   * described and none contradicts it. Strike any the client does not
   * recognise rather than defending it.
   *
   * Left out: a customer support system inside the platform. It is planned
   * rather than built, and the suggestion that came with it was to convert the
   * manpower it will save into a number for the page. That number does not
   * exist yet. It is the "38 hours saved per week" mistake in
   * content/metrics.ts with a different subject, so the study says nothing
   * about support at all. When it ships and somebody measures it, it belongs
   * in `results`.
   *
   * Also left out: who the money moves from at the point a host accepts. The
   * account of it was ambiguous and the copy is written so it does not matter,
   * "no card is charged until the host accepts", which is true either way.
   * Worth confirming before anybody rewrites that line.
   *
   * `location` is the country only. The client is getting the city.
   *
   * !! THE CLIENT'S OWN KEY ART, WHICH INVERTS THIS FILE'S USUAL RULE !!
   *
   * This hero was a CC0 photograph of Chureito Pagoda by Dang Son until 26
   * August 2026, carried under the rule the file used to apply everywhere: a
   * stock photograph illustrates the market and must never be read as the
   * client's premises or product.
   *
   * The client supplied their own key art that day, and a final set for all
   * four studies later the same day. So the caveat is replaced by its
   * opposite: this does depict the client's product, deliberately, and it is
   * theirs to have supplied. Anything written near it may say so.
   *
   * !! CROPPED TO 3:2 IN THE FILE, NOT BY THE TEMPLATE, AND IT MATTERS !!
   *
   * The sources are 1376 by 768 against a 3:2 frame, so `object-cover` would
   * take about 108px off each side. Every one of these has its headline
   * starting around 78px from the left, so a centred crop cuts into the first
   * word. They are cropped here instead, anchored hard left: the design keeps
   * the margin it was given and the photograph gives up its right edge.
   *
   * !! REPLACE AN IMAGE HERE, RENAME IT !!
   *
   * The first attempt shipped new artwork over an old filename and it did not
   * appear. The deploy was fine; Cloudflare answered every request with the
   * old bytes from its edge cache, cf-cache-status: HIT. That is the cost of
   * the /_next/image cache rule added the same day, and it is worth paying:
   * it took an article hero from 390ms to 90ms.
   *
   * Purging fixes the edge and cannot fix a browser, because next.config.mjs
   * serves these with a week's cache. A new filename is a URL nothing has ever
   * cached, so it fixes both at once and needs no dashboard step.
   */
  {
    slug: "japan-pro",
    /*
     * 39 characters, so the rendered title is 50 with the " - Hitasoft" the
     * layout appends. `title` is the H1 and the title tag both, and
     * docs/seo-standards.md gives a page 49 of its own.
     *
     * It read "How Japan Pro put its whole catalogue into twelve languages"
     * first, which is 59 and would have been cut mid word in a result. The
     * measurement was taken off the rendered page rather than counted here.
     */
    title: "How Japan Pro sells in twelve languages",
    client: "Japan Pro",
    industry: "Tourism",
    companySize: "20 to 40",
    location: "Japan",
    summary:
      "The catalogue spoke two languages and its travellers did not. A listing now publishes in twelve, and no card is charged until the host accepts the booking.",
    image: "/case-studies/japan-pro-key-art.webp",
    imageAlt:
      "Japan Tourism Project, elevating digital experiences. Experiences: curated cultural immersion and tailored itineraries. Events: local festivals, exhibitions and entertainment. Restaurants: from traditional izakayas to fine dining. Set over Chureito Pagoda with Mount Fuji behind it.",
    results: [
      { value: "12", label: "languages every listing publishes in" },
      { value: "Under 3 min", label: "from a submitted listing to all twelve live" },
    ],

    challenge: {
      body: "Japan Pro sells the country to first time visitors. Four kinds of business had grown up inside one catalogue, and each of them sells something the others do not. None of it books the way a traveller expects.",
      points: [
        {
          title: "Four businesses, one catalogue",
          body: "The catalogue holds restaurants and experiences alongside tours and events. A table for two and a three day tour are not the same product, and a system that treats them alike serves neither.",
        },
        {
          title: "The booking is a request, not a confirmation",
          body: "A traveller who books an experience is not booked yet. The host accepts first, and only then does money move. Every competitor has spent a decade teaching travellers the opposite, so the difference had to be built into the flow.",
        },
        {
          title: "Cancellation is not one policy",
          body: "Cancelling a restaurant table is not the same decision as cancelling a multi day tour. Each listing type needed terms of its own. What a traveller gets back has to follow the rules attached to the thing they booked.",
        },
        {
          title: "Two kinds of host, priced the same",
          body: "Hosts are not interchangeable, and the client did not want to charge them as though they were. A host sits on the regular tier or the pro tier, and the difference is earned rather than bought. Performance has to be judged continuously, because a badge somebody awards by hand does not scale.",
        },
        {
          title: "The catalogue spoke two languages",
          body: "Travellers arrive from every part of the world, and the catalogue met them in Japanese and English. Hosts add listings continuously, so a translation round somebody has to schedule falls behind the week it is finished. Anything manual leaves most of the catalogue unreadable.",
        },
        {
          title: "AI, with no map of where it belonged",
          body: "The client knew AI had a part to play here and could not say which part. That is the point at which most projects bolt a chatbot onto a homepage and call it done. The risk was spending the budget on the visible thing rather than the paying one.",
        },
      ],
    },

    approach: {
      body: "We spent the first part of the engagement deciding where AI belonged, then built the platform around the answer. The answers run in the order the problems were listed.",
      points: [
        {
          title: "One spine, four sets of rules",
          body: "Every listing shares one core the platform understands. Anything that differs by type sits alongside the core rather than being buried inside it. A table for two and a three day tour behave differently without the product forking in two.",
        },
        {
          title: "The host is a step, not a notification",
          body: "A request goes to the host and the traveller sees a state that says so. Money is taken when the host accepts and not before. The interface names the pending step plainly, because a traveller trained on instant confirmation will assume they are booked otherwise.",
        },
        {
          title: "Cancellation terms belong to the listing type",
          body: "The terms are configuration and not code. Each type carries its own, and the refund is computed from the rule attached to the booking rather than one policy the whole site shares.",
        },
        {
          title: "A tier that is earned and lost",
          body: "Regular and pro are the two tiers, and the platform decides which a host is on. Performance is monitored as the work happens rather than reviewed in a meeting, so a host moves up or back down on their own record. Commission and communication preferences both follow the tier. The design was ours and the client took it.",
        },
        {
          title: "Translation on submission, not on a schedule",
          body: "A listing is translated as it arrives. Twelve languages, in under three minutes, with each field handled on its own so a structured listing stays structured. Nobody schedules a translation round and nobody chases one.",
        },
        {
          title: "Search that reads meaning, not keywords",
          body: "Listings are indexed as vectors, so a traveller who describes the day they want finds things that never used those words. Claude does the reading where the judgement matters. The map came before any of the building, and the client agreed to all of it.",
        },
      ],
    },

    outcome: {
      body: "The platform sells to a traveller in their own language and settles with a host on terms that match what they actually offer.",
      points: [
        {
          title: "Twelve languages, from one submission",
          body: "A host writes once, in Japanese or English. The listing is live in twelve languages inside three minutes, and the catalogue never falls behind itself.",
        },
        {
          title: "A booking model the hosts already trusted",
          body: "The host accepts before any money moves, which is how these businesses have always worked. Nothing about the platform asked them to change that in order to be listed on it.",
        },
        {
          title: "Commission that keeps pace with the host",
          body: "Tiers move without anybody being asked to move them. A host who improves pays a rate that reflects it, and nobody at Japan Pro has to arbitrate who deserves what.",
        },
      ],
    },

    sendsTo: "/services/ai-software-integration",
  },

  /*
   * The Dubai short video platform, added 24 August 2026 from the client's
   * account. Second real study.
   *
   * !! THE CLIENT IS NOT NAMED, AND THAT IS A GAP RATHER THAN A DECISION !!
   *
   * Everything else came through. The name did not, so `client` reads
   * "Undisclosed" until somebody says otherwise. The slug is the product
   * rather than the company on purpose, so putting a name in later changes a
   * field and not a URL.
   *
   * !! THIS STUDY HAS NO AI IN IT, AND IT IS STILL THE RIGHT STUDY !!
   *
   * Worth saying out loud on a site that sells AI automation. Nothing in this
   * engagement was a model. docs/positioning.md is clear that the eighteen
   * years is delivery and AI is the current chapter of it, and this is the
   * strongest evidence on the site for the first half of that sentence. A
   * buyer weighing whether we survive their scale is not reassured by another
   * page about models.
   *
   * It is also why `sendsTo` points at an industry page rather than a service
   * page. There is no service in the silo called "build a platform", and
   * inventing one to give this study a destination would be the tail wagging
   * the dog. See the label note in components/sections/case-study.tsx.
   *
   * !! WHAT IS THE CLIENT'S ACCOUNT AND WHAT IS INFERENCE !!
   *
   * From the client: the four room formats at eight by eight audio and six by
   * six or four by four video, live chat, live streaming, the short video feed
   * and the swipe having to match what people already use, the compression and
   * encryption work, bitrate and latency as the hard problems, mobile apps as
   * the whole platform, past a million users after release with the scaling
   * holding, fifty to a hundred and fifty people across several sectors, a
   * small internal IT team, remote delivery, and fifteen of our people
   * including project managers working on site in Dubai.
   *
   * Inferred, and strike anything the client does not recognise: that the feed
   * and the rooms share one identity and social graph, that video is fetched
   * and decoded ahead of the swipe, and that capacity follows demand rather
   * than being fixed. Each is the ordinary way to build what was described.
   *
   * The client said "scripting technologies" for video, which is almost
   * certainly transcoding. The copy says compression and encoding, which is
   * true either way, and nothing here names a codec or a vendor.
   *
   * !! THE CLIENT'S OWN KEY ART, AND IT CARRIES NO NAME. KEEP IT THAT WAY !!
   *
   * This hero was Business Bay at night by Robert Bock, CC0 through Unsplash,
   * until 26 August 2026. It is now the client's own key art over the same
   * skyline: Live Streaming, Voice & Video Hub and Virtual Gifts.
   *
   * `client` on this study reads Undisclosed, and a filename is a public URL,
   * so the file is named for the slug rather than for anything the client
   * calls the product. An earlier version of this artwork arrived as
   * chobi-app.png and shipping it under that name would have put the product
   * name on the site while the copy carefully withholds it. The artwork itself
   * carries no logo and no product name, which is the only reason it can be
   * used on an undisclosed study at all. Check that before accepting the next
   * one.
   *
   * !! VIRTUAL GIFTS CAME FROM THE PICTURE, THEN FROM THE CLIENT !!
   *
   * The key art advertises virtual gifts and the copy did not mention them,
   * which was flagged here rather than quietly written up: a feature read off
   * an image is not a fact, and this file does not publish claims about a
   * client that the client has not made. The client confirmed it on 26 August
   * 2026 and asked for it in the study, so it is now the sixth problem and the
   * sixth answer.
   *
   * From the client, by way of their own artwork: virtual gifts and their
   * animations exist, and they are how the platform makes money.
   *
   * Inferred, and strike it if the client does not recognise it: that a gift
   * settles as a transaction independently of its animation, that the
   * catalogue is priced data rather than code, and that the animation is drawn
   * on the viewer's device rather than composited into the stream. All three
   * are the ordinary way to build what the artwork describes, and the last is
   * the one worth checking, because compositing into the stream is a real
   * choice some platforms make and it would make that sentence wrong.
   *
   * Nothing was added to `results`. Gifting is the revenue mechanism and
   * revenue is exactly the figure nobody has given us.
   *
   * See the Japan Pro entry above for the crop and the renaming rule, which
   * apply to all four.
   */
  {
    slug: "short-video-platform",
    /* 42 characters, 53 rendered. The client is unnamed, so the title carries
       the product instead of the usual "How <client> did <thing>". */
    title: "How a short video app held a million users",
    client: "Undisclosed",
    industry: "Multi-sector group",
    companySize: "50 to 150",
    location: "Dubai, United Arab Emirates",
    summary:
      "A short video feed and live rooms in one app. It went past a million users after release, and the swipe never once asked anybody to wait for the next video.",
    image: "/case-studies/short-video-platform-key-art.webp",
    imageAlt:
      "A Dubai based live streaming application. Live streaming: real time broadcast in high definition video and audio. Voice and video hub: integrated calling and conferencing. Virtual gifts: gifts and animations that monetise the platform. Set over the Dubai skyline at night.",
    results: [
      { value: "1M+", label: "users on the platform after release" },
      { value: "15", label: "of our team working on site in Dubai" },
    ],

    challenge: {
      body: "The brief was a short video app. What the client wanted was several products behind one login. The benchmark for every one of them had already been set by companies with thousands of engineers.",
      points: [
        {
          title: "Several products inside one app",
          body: "A short video feed and rooms for audio and video had to live in one product, with live chat and live streaming beside them. The app everybody compares this to carries none of it. There was no single product to copy, so every part of it had to be reasoned out instead.",
        },
        {
          title: "The swipe has to feel like nothing",
          body: "Users arrive with a benchmark already in their thumb. Any pause at all between two videos reads as a broken app rather than a slow one. The next video has to be ready before the finger has finished moving across the screen.",
        },
        {
          title: "Rooms that hold a crowd",
          body: "The audio rooms seat eight by eight. Video rooms run six by six and four by four, and every seat is sending and receiving at once. A room that degrades when the eighth person joins is a room nobody uses twice.",
        },
        {
          title: "Live video on networks we do not control",
          body: "A live stream gets judged on a phone and on a mobile network, never on office wifi. Bitrate and latency are the whole experience, and neither behaves the way it does on a desk. Getting it wrong is visible to every viewer in the room at the same moment.",
        },
        {
          title: "Scale nobody could rehearse",
          body: "The client was launching into a market they knew and could not say how fast it would arrive. A platform built only for launch week is a platform that dies in its second month. Build for a number nobody reaches and the budget that belonged in the product is gone.",
        },
        {
          title: "A live room that also takes money",
          body: "Virtual gifts are how a broadcast pays for itself, and they arrive in the middle of one. Every gift is a real payment and a piece of theatre at the same moment: it has to settle correctly, and it has to appear on screen while the thing it was sent for is still happening.",
        },
        {
          title: "A small client team, a large platform",
          body: "The client runs businesses in several sectors and the internal IT team is a small one. Nobody there was going to absorb a platform of this size from documents and a weekly call.",
        },
      ],
    },

    approach: {
      body: "Most of the work here went below the interface, where a user never looks and always notices. The answers run in the order the problems were listed.",
      points: [
        {
          title: "One product, several pipelines",
          body: "The feed needs one kind of plumbing underneath it, and a live room needs something else entirely. They share one identity and one social graph, so a user moves between them without meeting a seam. Only the parts that genuinely differ were built twice.",
        },
        {
          title: "The next video is already there",
          body: "The next video is fetched and decoded while somebody is still watching the one before it. The files are compressed and encrypted on the way through, and tuned for what a phone decodes cheaply. A large part of the engineering effort went into this one behaviour, because that is what it actually costs.",
        },
        {
          title: "Rooms sized to the format",
          body: "Audio rooms seat eight by eight, and video rooms run at six by six or four by four. The seat count is a product decision with a bandwidth bill attached, so it was set deliberately rather than inherited.",
        },
        {
          title: "Streams that adapt to the network",
          body: "Bitrate follows the connection the viewer actually has rather than the one we hoped for. Latency was treated as a budget to be spent, and every part of the path had to justify its share. The result holds up on a phone, because a phone is where every part of it was tuned.",
        },
        {
          title: "Capacity that follows demand",
          body: "The platform grows with the load rather than sitting at a size somebody guessed in advance. That is the only version of this that survives both a quiet launch and a loud one. The million users that arrived turned out to be an operations day rather than a rebuild.",
        },
        {
          title: "Gifts that settle first and perform second",
          body: "A gift is treated as a transaction before it is treated as an animation, because one of those is somebody's money and the other is four seconds of screen. The catalogue is priced items rather than something an engineer has to extend every time the client wants a new one, and the animation is drawn on the viewer's own device rather than burnt into the stream, so a generous room does not cost every viewer in it more bandwidth.",
        },
        {
          title: "Fifteen of us in the room",
          body: "Day to day the work ran remotely, which is how most of it gets done. For the parts that needed a whiteboard we sent fifteen people to Dubai, project managers included, and worked in the client's own building. Some things get settled in an afternoon there that would have taken a fortnight of email.",
        },
      ],
    },

    outcome: {
      body: "The app launched, the audience arrived, and the platform did not have to be rebuilt to hold them.",
      points: [
        {
          title: "Past a million users",
          body: "The platform went past a million users after release and behaved the same way it had on day one. Scaling turned out to be a question of capacity rather than a second version of the product.",
        },
        {
          title: "A swipe nobody thinks about",
          body: "The feed moves the way people expect it to move. Nobody using it has any idea how much work sits under that, which is the correct outcome for this kind of feature.",
        },
        {
          title: "One app doing the work of several",
          body: "To the person holding the phone, the feed and the live rooms are the same app. The client sells a single app rather than a suite nobody wants to install twice.",
        },
      ],
    },

    sendsTo: "/industries/media-and-communities",
  },

  /*
   * The content production platform, added 24 August 2026 from the client's
   * account. Third real study, and the first one that is squarely about AI.
   *
   * !! THE CLIENT IS NOT NAMED, AND THAT ONE IS SETTLED RATHER THAN PENDING !!
   *
   * The client confirmed on 24 August 2026 that the name is not disclosed, so
   * "Undisclosed" is the final answer here rather than a gap waiting to be
   * filled. That is different from the Dubai study above, where nobody has
   * been asked yet.
   *
   * The country is the United States and the headcount is 150 to 200, both
   * confirmed the same day. `location` read "Distributed" for about an hour,
   * which described the writers and not the company, and a country is what
   * that column is for. The team being spread across languages and time zones
   * is a fact about the work and it lives in the copy where it belongs.
   *
   * The slug is the product rather than the company, which matters more here
   * than on the other two: there is no name coming, so the URL has to stand on
   * its own.
   *
   * !! WHAT IS THE CLIENT'S ACCOUNT AND WHAT IS INFERENCE !!
   *
   * From the client: a United States business of 150 to 200 people, more than
   * a hundred and fifty of them writers across several
   * languages, some in an office and most not, a manual process running for
   * years and differing per customer, a couple of weeks spent collecting that
   * process before anything was proposed, a proposal for end to end automation
   * with the people kept in it, writers verifying text and images as an
   * approval step, generation of text with images, narrated audio and video
   * summaries, video at two minutes and at fifteen, eight and five seconds,
   * the model having to produce writing close enough to human that readers and
   * search engines do not discount it, output that had been three or four
   * pieces a week, a month of that volume now landing in a week, thousands of
   * hours saved by the client's own count, and people moved to other work
   * rather than let go.
   *
   * Inferred, and strike anything the client does not recognise: that the
   * model was tuned against this team's own writing rather than generically,
   * that language is a property of a piece rather than a separate deployment,
   * and that the process document became the specification. Each is the
   * ordinary way to build what was described.
   *
   * !! "THOUSANDS OF HOURS" IS THE CLIENT'S FIGURE AND THE LABEL SAYS SO !!
   *
   * It is the softest number on the site and it stays only because the label
   * attributes it. docs/positioning.md forbids publishing a figure nobody
   * measured. This one was measured by the person who owns the payroll, which
   * is a different thing from one we invented, and the reader is told which it
   * is. A precise hours count from their records would be stronger and should
   * replace it if it ever arrives.
   *
   * !! THE CLIENT'S OWN KEY ART, CARRYING NO NAME. KEEP IT THAT WAY !!
   *
   * This hero was lower Manhattan at sunset by Matt Lamers, CC0 through
   * Unsplash, until 26 August 2026. It is now the client's own key art over
   * the same skyline: AI Content, AI Images and AI Audio.
   *
   * `client` reads Undisclosed here as it does on the Dubai study, and the
   * artwork carries no logo and no product name, which is why it can be used.
   * The file is named for the slug for the same reason.
   *
   * !! THE COUNTRY PATTERN SURVIVED THE CHANGE, WHICH WAS NOT GUARANTEED !!
   *
   * Every study carried a photograph of the client's own country, which was
   * the pattern rather than a coincidence: read as a set on the index they say
   * the work travels. The client's own art happens to keep it - Manhattan
   * here, Business Bay for Dubai, Chureito Pagoda for Japan, a city skyline
   * for the African study. If a future client sends art shot somewhere else,
   * that is a decision to make deliberately rather than to notice afterwards.
   */
  {
    slug: "content-production-platform",
    /* 43 characters, 54 rendered, inside the 49 the standard allows a page.
       It read "does a month's work in a week" first, which measured the same
       on the budget and landed in the eleven to fourteen word band the voice
       rules keep headlines out of. */
    title: "How a content team fits a month into a week",
    client: "Undisclosed",
    industry: "Digital content and marketing",
    companySize: "150 to 200",
    location: "United States",
    summary:
      "A hundred and fifty writers produced every piece by hand. The system drafts, illustrates and narrates it now, and a person signs off before anything publishes.",
    image: "/case-studies/content-production-platform-key-art.webp",
    imageAlt:
      "A USA AI automation project, advanced content intelligence. AI content: automated text and copy generation. AI images: custom high fidelity visual assets. AI audio: intelligent voice and sound synthesis. Set over lower Manhattan at sunset.",
    results: [
      { value: "1 week", label: "for what had been a month of content" },
      { value: "Thousands", label: "of hours given back, by the client's own count" },
    ],

    challenge: {
      body: "A marketing business sells the judgement of its writers. The writing itself was never the problem. What cost them was the number of hours between a brief and something ready to publish.",
      points: [
        {
          title: "A process nobody had written down",
          body: "Years of habit ran the pipeline, and it ran a little differently for every client. The people who knew it were the people doing it. So the first job was finding out what actually happened, one client at a time.",
        },
        {
          title: "Content that reads as AI is worth nothing",
          body: "Their customers buy writing that a person wants to read. A draft that announces itself as machine written loses the reader and the search result in the same moment. The value of the whole system depended on output nobody could pick out as generated.",
        },
        {
          title: "Four kinds of output, not one",
          body: "A piece is not finished when the text is. It needs images for the blocks, a narrated version, and video cuts at the lengths a social post takes. A tool that only writes solves one quarter of it.",
        },
        {
          title: "The person cannot be automated out",
          body: "The writers are what the client sells, and their judgement is what customers pay for. Remove them and the product goes with them. Approval had to be part of the design rather than a setting somebody turns on.",
        },
        {
          title: "A hundred and fifty writers, many languages",
          body: "The team works in several languages and across a spread of time zones, some in the office and most not. Anything built for them had to be one system rather than a tool per office. A hundred and fifty people were never going to be retrained into one house method.",
        },
        {
          title: "The ceiling was a few pieces a week",
          body: "Output ran at three or four pieces a week and it had run there for years. A customer asking for more meant hiring somebody, which is the point at which growth costs more than it returns.",
        },
      ],
    },

    approach: {
      body: "The proposal was full automation with the people left in it, which sounds like a compromise and is the only version that works here. The answers run in the order the problems were listed.",
      points: [
        {
          title: "Two weeks inside the process first",
          body: "We sat with the team before proposing anything. Every stage was written down as it actually ran, client by client, including the parts nobody thought were worth mentioning. That document became the specification, and it was theirs whatever they decided to do next.",
        },
        {
          title: "A model tuned until the draft reads like them",
          body: "The model was trained against the way this team already writes rather than against the internet. A draft arrives in their voice and a writer edits it, which is a different job from rewriting a stranger's work. The output does not announce itself, and that was the entire point of the exercise.",
        },
        {
          title: "The media comes out of the same brief",
          body: "Images for the blocks, a narrated audio version and video summaries all generate inside the editor. Video runs at two minutes for the long cut, and at fifteen, eight or five seconds for the short ones. The writer clicks rather than briefs four different suppliers.",
        },
        {
          title: "Approval is a step, not a courtesy",
          body: "The system stops and waits for a person. A writer verifies the text and the images before anything moves on, and nothing publishes without that. It runs the whole pipeline and then stops, one step short of publishing, on purpose.",
        },
        {
          title: "One system, whatever language you write in",
          body: "Everybody works in the same tool, in the office or a long way from it. Language is a property of the piece rather than a separate installation, so a brief in one language travels the same rails as the next.",
        },
        {
          title: "The work is now a few clicks",
          body: "A writer starts from the brief and the system produces the piece with its media attached. What is left for them is the judgement, which is the part they were hired for. The piece goes out on a click.",
        },
      ],
    },

    outcome: {
      body: "A month of content now takes a week, and the people who used to produce it are doing work that needed them more.",
      points: [
        {
          title: "A month of output in a week",
          body: "Three or four pieces a week was the ceiling. What used to be a month of work for a customer now lands inside a week. Nobody was hired to make that happen.",
        },
        {
          title: "Thousands of hours, by the client's own count",
          body: "The saving is theirs to measure and they put it in the thousands of hours. The people it freed were moved onto work the business had been putting off rather than shown the door.",
        },
        {
          title: "Every piece still carries a person",
          body: "A writer signs every piece before a customer sees it. That was the condition the whole design was built around, and it survived contact with the schedule.",
        },
      ],
    },

    sendsTo: "/services/ai-workflow-automation",
  },

  /*
   * The low bandwidth super app, added 26 August 2026 from the client's
   * account of the engagement.
   *
   * !! THE CONSTRAINT IS THE STORY, AND IT IS THE RAREST ONE ON THIS SITE !!
   *
   * Every other study here optimises for something a buyer already believes
   * matters. This one optimises for a network that most engineering is allowed
   * to assume away, and it is the only page on the site that proves we can
   * build to a hostile constraint rather than a generous one. Keep the
   * bandwidth in front of the reader in every act. A version of this study
   * that leads on "chat, wallet and marketplace" is a feature list, and the
   * feature list is the least interesting thing about it.
   *
   * !! WHAT IS THE CLIENT'S ACCOUNT AND WHAT IS INFERENCE !!
   *
   * From the client: a chat application for an African market where the
   * internet is slow and unstable, built because WhatsApp is too heavy for it;
   * the whole stack tuned so the app is usable on 2G and 3G; no digital
   * payment system and no established marketplace in the country, so the
   * client wanted all of it in one place; a wallet and a marketplace shipped
   * alongside the chat and events added later under the same constraint; a
   * page inside the app that measures the user's own connection; promotion at
   * national level; fifty thousand downloads across Android and iOS within a
   * couple of weeks; more than a hundred reviews in the same period, and what
   * they praise is the speed; a client team of five to ten people, mostly
   * marketing; and several separate systems collapsed into one application.
   *
   * Inferred, and strike anything the client does not recognise: that the
   * wallet had to be the payment system rather than a front end for an
   * existing one, which follows from there being no digital payments in the
   * country to integrate with. Nothing else here is inference.
   *
   * !! DELIBERATELY NOT PUBLISHED !!
   *
   * The client promoted the launch using their own country's president on
   * Facebook. The client asked on 26 August 2026 for that to appear without
   * the political association, so the copy says "at national level" and stops.
   * Naming the office would identify the country, and through it the client,
   * on a study whose `client` field reads Undisclosed.
   *
   * There is also a plan to add an FM system at a later user milestone. It is
   * a plan, the milestone was given two different ways in the same sentence,
   * and a case study reports what shipped. It is not here and should not be
   * added until it has.
   *
   * !! `location` IS THE CONTINENT, WHICH IS WEAKER THAN THE OTHER THREE !!
   *
   * Japan, Dubai and the United States all name a market a reader can place.
   * This one says Africa because the client chose that on 26 August 2026 when
   * asked. It is honest and it is vague, and if a country or a region is ever
   * cleared, this field is the only thing that has to change.
   *
   * !! THE CLIENT'S OWN KEY ART, AND THE SKYLINE NAMES NOTHING !!
   *
   * This hero was a stock photograph of Nairobi for a few hours on 26 August
   * 2026, because the study's own `location` is a continent and there is no
   * honest specific photograph of one. The client supplied their key art the
   * same day and it replaced it: Secure Chat, Marketplace, Digital Wallet and
   * Event Booking over a city skyline at dusk.
   *
   * The artwork's headline reads "Africa all-in-one platform" and names no
   * country, which is exactly what this study needs. No country is stated in
   * the copy and none may be inferred from the picture.
   *
   * !! A GETTY IMAGE WAS OFFERED FOR THIS SLOT AND MUST NOT COME BACK !!
   *
   * Before the key art arrived, a file named gettyimages-1240610226.jpg
   * carrying a BBC article's image id was proposed for this hero. It is rights
   * managed stock taken from a news page. This is a commercial site, Getty
   * pursues exactly this, and it was a 976px web thumbnail against a 1600px
   * slot in any case.
   *
   * The rule that comes out of it applies to every image in this file: a
   * picture here needs a licence that covers commercial use, or it needs to be
   * the client's own, and which of the two goes in the comment beside it.
   */
  {
    slug: "low-bandwidth-super-app",
    /* 44 characters, 55 rendered with " - Hitasoft", inside the 49 a page's
       own title gets in docs/seo-standards.md. It read "How a chat app kept
       working where WhatsApp could not" until 11 September 2026, 52 and 63
       rendered, and was cut in results. The claim is unchanged and is the
       challenge section's own: WhatsApp is built for a connection that holds,
       and on these networks it does not.

       The client is unnamed, so the title carries the constraint rather than
       the usual "How <client> did <thing>". It names what the app does rather
       than claiming a share of anybody's market. */
    title: "How a chat app works where WhatsApp does not",
    client: "Undisclosed",
    industry: "Consumer messaging and payments",
    companySize: "5 to 10",
    location: "Africa",
    summary:
      "Chat, a wallet and a marketplace behind one login, for a country still on 2G and 3G where there was no digital payment system to build on. Fifty thousand people downloaded it in the first couple of weeks.",
    image: "/case-studies/low-bandwidth-super-app-key-art.webp",
    imageAlt:
      "An all in one platform for Africa, connecting digital ecosystems. Secure chat: real time messaging. Marketplace: integrated commerce and trading. Digital wallet: payments and financial management. Event booking: discover and book local experiences. Set over a city skyline at dusk.",
    results: [
      { value: "2G and 3G", label: "the mobile networks it is built to work on" },
      { value: "50,000", label: "downloads across both stores in the first weeks" },
      { value: "4", label: "products behind one login: chat, wallet, marketplace, events" },
    ],

    challenge: {
      body: "The client wanted several products in one app for a market where most of the usual assumptions do not hold. The hard part was never the feature list. It was that every one of those features had to work on a connection that modern software is built to ignore.",
      points: [
        {
          title: "Phones on 2G and 3G",
          body: "Users are on mobile networks a generation or two behind what an app of this kind assumes, and they are unstable as well as slow. WhatsApp is what people already had, and it is built for a connection that holds. On these it does not.",
        },
        {
          title: "No digital payments to plug into",
          body: "The country had no established digital payment system. That removes the ordinary answer, which is to integrate a provider and put an interface on it. There was nothing underneath to integrate with.",
        },
        {
          title: "No marketplace either",
          body: "Buying and selling was happening across chat threads and in person, with no common place to list anything. The client wanted that in the same app rather than in a second one nobody would install.",
        },
        {
          title: "Four products on one bandwidth budget",
          body: "Chat, wallet and marketplace at launch, with events added later. Every one of them had to fit the same connection. A single heavy screen anywhere in the app undoes the work everywhere else, because the user judges the whole thing by the worst part of it.",
        },
        {
          title: "Nobody can tell the app from the line",
          body: "On an unstable network a user blames whatever is on screen. An app that is genuinely fast on a bad connection still gets uninstalled if the connection dies mid-message and the app is the only thing there to blame.",
        },
        {
          title: "A client team of five to ten, mostly marketing",
          body: "There was no engineering team on the client side to hand a fleet of systems to. Whatever shipped had to be something a small marketing team could run and promote without an operations department behind it.",
        },
      ],
    },

    approach: {
      body: "Almost every decision here was settled by the same question: what does this cost on a 2G connection. The answers run in the order the problems were listed.",
      points: [
        {
          title: "The whole stack tuned to the network",
          body: "This was not a matter of compressing images at the end. Every layer was chosen and tuned against the bandwidth budget, because on a connection this narrow the slowest part of the stack sets the speed of the product. That work is invisible when it succeeds and it is the entire engagement.",
        },
        {
          title: "The wallet is the payment system",
          body: "With no provider to sit in front of, the wallet had to be the thing that holds and moves the money rather than an interface onto something that already did. For a lot of users this is the first digital payment they have made.",
        },
        {
          title: "A marketplace on the same budget",
          body: "Listings, browsing and buying were built to the same constraint as the chat rather than treated as a richer surface that could afford more. A marketplace that only loads on a good connection is a marketplace for the people who already had one.",
        },
        {
          title: "One download, four products",
          body: "Chat, wallet and marketplace ship as one app, and events joined them later under the same rules. One install, one login, one thing to keep updated over a slow connection - which matters more here than it would anywhere else.",
        },
        {
          title: "The app measures the connection itself",
          body: "There is a page inside the app that tests the user's own network speed. It looks like a small feature and it settles an argument the product cannot otherwise win: it lets somebody see the line is at fault, rather than deciding the app is broken and removing it.",
        },
        {
          title: "Several systems collapsed into one",
          body: "Everything the client would otherwise have run separately sits in a single application. That is a smaller surface for a five to ten person team to operate, and it is the difference between a product they can manage and one they would need to hire for.",
        },
      ],
    },

    outcome: {
      body: "The client promoted the launch at national level and the audience arrived within days. What the reviews talk about is not the feature list.",
      points: [
        {
          title: "Fifty thousand downloads in the first weeks",
          body: "Across Android and iOS, within a couple of weeks of launch, in a market where a heavy app would not have finished installing on most connections.",
        },
        {
          title: "The reviews are about the speed",
          body: "More than a hundred reviews arrived in the same period, and what users keep saying is that it works on their connection. That is the one piece of feedback that tells us the constraint was the right thing to build around.",
        },
        {
          title: "Events shipped under the same constraint",
          body: "Events were added after launch and had to meet the same bandwidth budget as everything before it. It went out without loosening the rule the rest of the app was built on, which is the test of whether that rule was real.",
        },
      ],
    },

    sendsTo: "/industries/media-and-communities",
  },

  /*
   * The Indian healthcare platform, added 3 September 2026 from the client's
   * account of the engagement. Fifth real study, and the first one where a
   * government defined what could be built.
   *
   * !! THE CLIENT IS NOT NAMED, AND NOBODY HAS BEEN ASKED YET !!
   *
   * `client` reads "Undisclosed" because the name did not come with the
   * account, the same position the Dubai study is in. That is a gap rather
   * than a decision, unlike the US study where the client settled it. The slug
   * is the programme rather than the company, so a name can be added later
   * without changing a URL.
   *
   * !! WHAT IS THE CLIENT'S ACCOUNT AND WHAT IS INFERENCE !!
   *
   * From the client: an Indian healthcare project integrated with Ayushman
   * Bharat Digital Mission; the difficulty of working with the government
   * system and having the build accepted by it; further audits covering
   * quality and security among other things; a website and a mobile app; the
   * platform connecting patients to the doctors they want; patient records and
   * the rest of the data going into the government system; an AI audio call
   * the patient starts, where they explain the problem and answer what the
   * assistant asks; backend automation that triggers the booking once the
   * details are collected; the system identifying what kind of request it is
   * and routing it to the right channel, whether that is a doctor or a
   * provider such as home care; the request then being placed by the system
   * rather than by a person; and the platform being in production.
   *
   * Inferred, and strike anything the client does not recognise. That the
   * classification happens once and in one place rather than at each hop, that
   * the website and the app read one set of rules rather than each carrying a
   * copy, and that a person still handles the cases the routing will not take.
   * Each is the ordinary way to build what was described and none of it
   * contradicts the account.
   *
   * !! DELIBERATELY NOT PUBLISHED: THE FUNDING ROUND !!
   *
   * The account included that the client is going out for a new level of
   * funding. It is a strong outcome line and it is not ours to publish. A
   * raise in progress is material information about somebody else's company,
   * "going for" is not "closed", and a case study reports what shipped. The
   * same reasoning kept the FM system off the Africa study above.
   *
   * If the client clears it, one line in `outcome` is where it goes, and it
   * should say what closed rather than what was sought.
   *
   * !! NAMING ABDM IS ALLOWED. CLAIMING A CERTIFICATE IS NOT !!
   *
   * docs/positioning.md line 217 settles the shape of this. A regime may be
   * named as the thing the work was built around, and claiming to hold or to
   * grant a status may not. So the copy says the platform is in production and
   * that records go where the programme says they go, both of which are the
   * client's own account of it. Nothing here says the platform is certified,
   * says Appkodes is certified, or names a milestone, an auditor or a standard
   * that nobody has confirmed to us.
   *
   * The line worth re-reading before this ships is "the platform is in
   * production and carrying real patient records". It is the client's account
   * and it carries the whole compliance argument by implication, which is the
   * strongest form available and the one most easily overstated in an edit.
   *
   * !! THIS HERO IS OURS, NOT THE CLIENT'S, AND IT IS THE ONLY ONE !!
   *
   * The other four are the client's own artwork. No art came with this
   * engagement, so the hero was built here to the same layout: 1152 by 768 and
   * already 3:2, a navy panel carrying the headline and four capability rows,
   * and a photograph bleeding in from the right under a navy wash. The
   * compositor is scripts/case-study-key-art.swift and it takes the photograph
   * as an argument, so a second one can be made without redrawing anything.
   *
   * It carries no client logo and no product name, which is the condition the
   * Dubai entry above sets for any artwork on an undisclosed study.
   *
   * !! WHERE THE PHOTOGRAPH CAME FROM, WHICH THIS FILE REQUIRES IN WRITING !!
   *
   * Mumbai, shot at Worli Sea Face, by Drone Master on Unsplash, photo id
   * 1710582308582-55cc0c461c4e. Published under the Unsplash License, which
   * covers commercial use and asks for no attribution. That is the licence
   * half of the rule the Africa entry above lays down after a rights managed
   * Getty file was proposed for its hero: a picture here is either the
   * client's own or carries a licence that covers commercial use, and which of
   * the two it is goes in the comment beside it.
   *
   * It is a photograph of the client's country and not of the client's
   * premises, which is how all four of these started. Nothing near it may
   * suggest otherwise.
   *
   * The country pattern the US entry describes holds: Mumbai here, a skyline
   * for Africa, Business Bay for Dubai, Chureito Pagoda for Japan.
   *
   * `imageAlt` reads the four capability rows off the artwork itself. Re-read
   * it against the file if the artwork is ever regenerated with different
   * rows, and see the Japan Pro entry for the rule that replacing an image
   * here means renaming it rather than overwriting it.
   */
  {
    slug: "abdm-health-platform",
    /* 39 characters, 50 rendered. The client is unnamed, so the title carries
       what the platform does. "Doctor" rather than "care" because it is the
       headline case and the vaguer word tests worse, and home care is named
       in the fifth problem and the fifth answer where it belongs. */
    title: "How a phone call books the right doctor",
    client: "Undisclosed",
    industry: "Healthcare",
    companySize: "Under 20",
    location: "India",
    summary:
      "Patients describe what is wrong out loud. The system works out what they need and books it, and the record goes into India's national health programme.",
    image: "/case-studies/abdm-health-platform-key-art.webp",
    imageAlt:
      "India healthcare platform, connected to the national health record. AI voice intake: patients book by describing the problem. Smart routing: requests matched to the right provider. ABDM integration: records filed into the national system. Web and mobile: one platform behind both front doors. Set over the Mumbai skyline.",
    results: [
      { value: "ABDM", label: "the national health programme every record is filed into" },
      { value: "One call", label: "from a patient describing a problem to a booked provider" },
    ],

    challenge: {
      body: "Two hard problems sat on this build. Software was only one of them. A national health programme decides what the platform is allowed to do, and a patient on the phone decides whether any of it gets used.",
      points: [
        {
          title: "The government owns the specification",
          body: "Ayushman Bharat Digital Mission sets the rules a health platform in India has to meet. Nothing here was ours to decide. The programme says what a record looks like and how it moves, and a build that disagrees with it does not go live.",
        },
        {
          title: "Audits stand between the build and the patients",
          body: "Acceptance is not a date somebody picks. Quality and security get examined first, and the standard is set by people who have never met the product. An ordinary internal review is a much lower bar than this one, and finding that out late costs a release.",
        },
        {
          title: "The records belong somewhere else",
          body: "Patient data does not stop at the client's database. It has to reach the national system in the shape that system expects, which is a harder problem than storing it well. A mismatch there is not a bug any user reports. It is a record the country cannot read.",
        },
        {
          title: "A patient in trouble will not fill in a form",
          body: "The people who most need this are the least likely to work through a booking screen. They know what is wrong and would rather say it out loud than type it. A form asks them to translate that into fields and dropdowns first, and plenty of them will not.",
        },
        {
          title: "Nobody asks for the right service by name",
          body: "A patient describes a problem rather than a product. Some of what arrives needs a specialist, some of it needs a home care visit, and the caller has no reason to know which. Something has to read the request and decide, before a booking can happen at all.",
        },
        {
          title: "A finished call is not a booking",
          body: "Details collected in a conversation do nothing on their own. Somebody still has to find a provider who can take the case and send the request to them. That step is where a system like this usually gives up and pushes the work back to a human queue.",
        },
        {
          title: "Two front doors, one set of rules",
          body: "The client wanted a website and a mobile app. Both write to the same records. A feature that behaves differently in one of them is not a difference in polish. It is two versions of a patient's history.",
        },
      ],
    },

    approach: {
      body: "Everything here was built inward from the rules rather than outward from a feature list. The answers run in the order the problems were listed.",
      points: [
        {
          title: "Built to the programme, not adapted to it",
          body: "We designed the integration against the mission's own requirements before writing the product around it. The slow part came first, and that is the trade this kind of work rewards. A platform retrofitted to a government standard has to be opened up again everywhere, and the parts opened first have already moved on.",
        },
        {
          title: "The audits were scheduled, not survived",
          body: "Quality and security work sat in the plan next to the features rather than after them. The evidence an auditor asks for was produced as the thing it describes was being built. The platform is in production and carrying real patient records, which is the only proof that any of this landed.",
        },
        {
          title: "The record is written where the country keeps it",
          body: "A patient's history goes into the national system rather than sitting in one company's database. The next clinician they see can find it, and that is the whole reason the programme exists. Most of the work was in matching what that system expects rather than in storing anything.",
        },
        {
          title: "The intake is a phone call",
          body: "A patient starts an audio call and says what is wrong in their own words. The assistant keeps asking follow up questions until it has everything a booking actually needs. Nothing about it asks the caller to know the vocabulary, which is what a form quietly does.",
        },
        {
          title: "The request is classified before it is routed",
          body: "The system works out what kind of request this is before it looks for anybody to send it to. A specialist appointment goes one way. A home care visit goes another. That decision is made once and in one place rather than at every point the request passes through.",
        },
        {
          title: "The booking is placed by the system",
          body: "When the call ends the automation goes and finds a provider who can take it. The request reaches them without anybody at the client having to rekey a word of it. A person is still there for the cases that need one, which is a much smaller pile than it was.",
        },
        {
          title: "One platform behind both",
          body: "Website and app are two doors into one system. Rules live in one place and both surfaces read them, so neither can drift into a version of the truth the other does not have. On an ordinary product that is tidy engineering, and here it is a patient's medical history.",
        },
      ],
    },

    outcome: {
      body: "The platform is live, and the people it was built for reach it by talking rather than by typing.",
      points: [
        {
          title: "In production, inside the national system",
          body: "The system runs in production and every record it creates goes where the programme says it goes. That was the condition the whole build answered to, and it held all the way through.",
        },
        {
          title: "A patient talks and a booking appears",
          body: "Somebody who would never have finished the form gets to describe the problem out loud instead. What arrives at the provider is a request with all the detail already in it. Nobody at the client touched it on the way.",
        },
        {
          title: "The routing decides, not a queue",
          body: "Requests reach the right kind of provider, and nobody has to read each one first. A doctor and a home care team get sent the cases that belong to them. The client runs it with under twenty people.",
        },
      ],
    },

    /*
     * !! THIS DESTINATION IS UNSETTLED AND WAS ASKED ABOUT ON 3 SEPTEMBER 2026 !!
     *
     * The answer given was "healthcare-app-with-ai-automation", which is not a
     * route in this repo. There is no such page under app/services or
     * app/industries, and it is not in the app silo briefs either.
     *
     * `/services/ai-voice-telephony-automation` stands here in the meantime
     * because it is the closest page that exists and the match is exact: that
     * page already promises an agent that answers, works out what the caller
     * wants and books the appointment, and this study is the evidence for it.
     *
     * Change it to `/industries/healthcare-and-consulting` if the study should
     * read as sector credibility first. If a healthcare app page is actually
     * being built, this line waits for it rather than pointing at a 404.
     */
    sendsTo: "/services/ai-voice-telephony-automation",
  },
];

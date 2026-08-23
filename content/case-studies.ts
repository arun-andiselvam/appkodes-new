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
   * !! THE PHOTOGRAPH IS NOT THE CLIENT'S PREMISES !!
   *
   * public/case-studies/japan-pro.webp is Chureito Pagoda with Mount Fuji
   * behind it, by Dang Son, released CC0 on Wikimedia Commons. Public domain,
   * no attribution required, and recorded here anyway so nobody has to work
   * out later where it came from. It is editorial illustration of the market
   * this product serves, in the way a magazine runs a photograph beside a
   * piece. It does not depict Japan Pro, its offices or its listings, and no
   * caption may imply that it does.
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
    image: "/case-studies/japan-pro.webp",
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
   * !! THE PHOTOGRAPH IS NOT THE CLIENT'S PREMISES !!
   *
   * public/case-studies/short-video-platform.webp is Business Bay at night
   * with the Burj Khalifa behind it, by Robert Bock, released CC0 through
   * Unsplash and held on Wikimedia Commons. Public domain, no attribution
   * required, recorded here so nobody has to trace it later.
   *
   * Same rule as the Japan Pro image above. It places the engagement and
   * nothing more. No caption may imply it shows the client, their offices or
   * their product.
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
    image: "/case-studies/short-video-platform.webp",
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
];

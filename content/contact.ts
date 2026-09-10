/**
 * The contact page.
 *
 * !! THIS IS THE CONVERSION ENDPOINT FOR THE WHOLE SITE !!
 *
 * `actions.book` in content/site.ts is "/contact", so every call to action on
 * every page lands here. It is the last page a buyer sees before they either
 * write something or leave, which is why the copy answers what happens next
 * rather than selling anything further.
 *
 * The details below were read off https://www.hitasoft.com/contact on 21
 * August 2026, which is the company publishing them about itself and is as
 * good a source as exists.
 *
 * !! TWO VALUES ON THAT PAGE ARE PLACEHOLDERS AND ARE NOT COPIED HERE !!
 *
 * "+91 98765 43210" and "your@email.com" both appear in its HTML. Both are
 * `placeholder` attributes on that page's own form, not contact details.
 * 98765 43210 is the standard dummy Indian mobile, and copying it onto the
 * page every call to action points at would have been the worst possible
 * place for a number that rings nowhere.
 *
 * Everything read from that page was cross checked against two independent
 * places in it: the meta description, and the Organization and
 * ProfessionalService JSON-LD blocks it publishes. The mobile, the email and
 * the postal address all agree across them.
 *
 * The project enquiries number was supplied directly by the client on 21
 * August 2026 and is not on the live site, which still publishes the other
 * mobile as its only number. Worth updating there too.
 */

export type ContactChannel = {
  /** "Email", "Phone", "Office". */
  label: string;
  /** What the reader sees. */
  value: string;
  /** mailto:, tel:, or a maps link. Omit for something not clickable. */
  href?: string;
};

/**
 * One string for the Madurai address, read by the list entry below, by the
 * office card on the contact page and, through that list entry, by the
 * Organization schema. Change it here and all three follow.
 */
const MADURAI_ADDRESS =
  "Door No 9/1, Karthick Center, Kamala First Street, Chinna Chockikulam, Madurai 625002, Tamil Nadu, India";

/**
 * !! ONLY CONFIRMED DETAILS. NEVER A PLACEHOLDER. !!
 *
 * A number that rings nowhere, on the page every call to action points at, is
 * the worst failure available to this site. One confirmed line beats three
 * plausible ones.
 *
 * tel: hrefs carry no spaces or brackets, because a dialler parses the href
 * rather than the text. The displayed value keeps its spacing so a person can
 * read it.
 */
export const channels: ContactChannel[] = [
  {
    label: "Email",
    value: "info@hitasoft.com",
    href: "mailto:info@hitasoft.com",
  },
  /*
   * Split by what the caller wants, on instruction from the client 21 August
   * 2026. Two lines, one each, so nobody routing a project enquiry lands in
   * the queue for student ones.
   *
   * The mobile that was labelled "Phone" is now the student line. The project
   * line is a new number supplied directly rather than read off the live site,
   * which still publishes the other one as its only contact number.
   *
   * The Madurai landline, +91 452 4371112, is no longer shown. It was here
   * because hitasoft.com/contact lists it, and it came out when these two took
   * its place. Add it back as a third entry if it is still answered.
   */
  {
    label: "Project enquiries",
    value: "+91 77080 04693",
    href: "tel:+917708004693",
  },
  {
    // Written "Collect & Students Enquiries" in the instruction. Read as
    // College, since Collect is not a thing anybody enquires about and this
    // sits on the page every call to action points at. Say the word and it
    // goes back verbatim.
    label: "College and student enquiries",
    value: "+91 77080 06989",
    href: "tel:+917708006989",
  },
  {
    // Kept in this list although the contact page no longer draws it here.
    // The page shows offices as cards with a map, built from `offices` below,
    // and filters this entry out of the list. It stays because
    // lib/organization-schema.ts reads the address from it by label.
    label: "Office",
    value: MADURAI_ADDRESS,
  },
];

/**
 * The offices, drawn as cards with a map on the contact page. Added 10
 * September 2026, with the Chennai address supplied by the client that day.
 *
 * !! CHENNAI IS A VIRTUAL OFFICE, TAGGED "SALES OFFICE" ON INSTRUCTION !!
 *
 * The client asked for it to read so a visitor understands there is an
 * office in Chennai, and chose "Sales Office" on 10 September 2026. It sits
 * in an Awfis centre, which the address now names, so a visitor who turns up
 * knows to ask at the Awfis reception rather than looking for a Hitasoft
 * sign.
 *
 * The Chennai street is kept as supplied: "Sipet" and "Thiruvika" are the
 * client's spellings of SIPET and Thiru Vi Ka.
 *
 * !! THE MAP SEARCHES FOR THE PLACE, NOT THE ADDRESS !!
 *
 * The first version fed the postal address to the map and neither map drew
 * a pin: Google centred on the area and marked nothing. `mapQuery` names the
 * listing instead, so the embed resolves to a place and pins it. Madurai is
 * the company's own Google Business Profile, searched by the name the client
 * gave for it. Chennai is the Awfis centre the virtual office sits in, with
 * the street kept in the query because Awfis runs several centres in the
 * city. The displayed address stays the postal one either way.
 */
export type Office = {
  city: string;
  tag: string;
  address: string;
  /** What the map and the Maps link search for. A place name gets a pin. */
  mapQuery: string;
  /** A share link to the exact listing. Used for the Maps link when set. */
  mapLink?: string;
  /**
   * A full Google embed URL, used for the map instead of the mapQuery search
   * when set. The format is the one Share, then "Embed a map" produces.
   */
  embedSrc?: string;
};

export const offices: Office[] = [
  {
    city: "Madurai",
    tag: "Head office",
    address: MADURAI_ADDRESS,
    mapQuery: "Hitasoft Technology Solution, Madurai",
  },
  {
    city: "Chennai",
    tag: "Sales Office",
    address:
      "Awfis, MF 7A8, Sipet Hostel Road, Thiruvika Industrial Estate, Ekkatuthangal, Guindy, Chennai 600032, Tamil Nadu, India",
    // !! "Awfis Guindy" IN THE MIDDLE OF THE MAP, BY DECISION !!
    //
    // What the client asked for on 10 September 2026, after dropping the pin.
    // Only a search makes Google draw the name: centring on the listing's
    // coordinates with `ll` and no search left Google free to hide it, and at
    // z=16 it did. The search draws the label with Google's small red dot and
    // centres on it. It does not give the big pin or the card Madurai gets,
    // because no Awfis name matches exactly one listing, and a coordinate
    // query shows "Place info couldn't load". Both were tried.
    //
    // The note below, written before that decision, records that Google's
    // address for this listing is 54, Industrial Area rather than MF 7A8. The
    // client knows the office, so the map follows the client.
    //
    // Madurai gets a pin and a card because its name matches exactly one
    // Google listing. No Awfis name did. "Awfis Guindy" returns three centres,
    // and "Awfis Guindy (Vijay Enterprises)" is a different centre at 54,
    // Industrial Area, about 1.3km from MF 7A8, so it drew a card on the wrong
    // building. Chasing the exact listing ID was stopped on 10 September 2026
    // in favour of naming Awfis in the address. The share link below is the
    // client's own and lands on the right listing.
    // A search for the listing, because only a search makes Google draw the
    // "Awfis Guindy" name. See the note above.
    mapQuery: "Awfis Guindy (Vijay Enterprises)",
    // The client's own share link, so "Open in Google Maps" lands on the
    // exact listing rather than on a search that could match another centre.
    mapLink: "https://share.google/hCJthynd2Ra7z4PXp",
  },
];

/**
 * Where students, applicants and colleges get sent.
 *
 * Supplied by the client on 27 August 2026, for the quote assistant. Somebody
 * asking about a job, an internship or a course is a real person with a real
 * question, and they are not a lead - answering them properly and pointing
 * them at the person whose job it is beats either stringing them along or
 * brushing them off.
 *
 * The phone number is the same one the channels list above already publishes
 * as "College and student enquiries", split out on the client's instruction of
 * 21 August 2026 so nobody routing a project enquiry lands in the student
 * queue. One number, one meaning, defined once - if it ever changes, it
 * changes in both places or in neither.
 *
 * hrd@hitasoft.com and the name are new here and appear nowhere else on the
 * site. The claims discipline at the top of this file applies to them as much
 * as to anything else: they are published because the client supplied them,
 * and the assistant reads them out verbatim rather than paraphrasing an
 * address into something that bounces.
 */
export const hrContact = {
  name: "Mahalakshmi",
  role: "HR",
  email: "hrd@hitasoft.com",
  phone: "+91 77080 06989",
} as const;

/**
 * The direct line, for somebody who would rather talk than type.
 *
 * Supplied by the client on 27 August 2026. Plenty of buyers will not work
 * through a form however short it is, and the ones who want a person on the
 * other end are usually the serious ones. Making them fill in a modal to earn
 * a phone number is the wrong way round.
 *
 * !! IT IS NOT OFFERED TO EVERYBODY, AND THAT IS THE POINT !!
 *
 * This is somebody's actual mobile. The modal shows it only once a visitor has
 * answered a couple of questions, and the assistant is told never to hand it
 * to an off-topic conversation or a student enquiry - those have their own
 * routes. See components/quote/direct-line.tsx and lib/quote-corpus.ts.
 *
 * The number is the same one the channels list above publishes as "Project
 * enquiries", split from the student line on 21 August 2026. Two places, one
 * number: if it ever changes it changes in both, or in neither.
 *
 * `name` is deliberately empty. No founder is named anywhere on this site, and
 * the rule at the top of this file - only confirmed details, never a
 * placeholder - covers a person's name as much as a phone number. Fill it in
 * and it appears; leave it and everything reads "the founder", which is
 * accurate either way.
 *
 * `email` was supplied by the client on 28 August 2026, for the quote
 * assistant specifically - it is given out under the same rule as the phone
 * number above: only to a real project enquiry that has asked for contact
 * details, and never to a student or an off-topic conversation. See
 * lib/quote-chat-prompt.ts for where it is actually handed over.
 *
 * `linkedin` was supplied the same day, for one particular moment: the
 * assistant hitting the edge of what it knows and offering to put somebody
 * in front of the person who does, rather than leaving a gap. See the same
 * file for where that offer is made and what it leads to if accepted.
 */
export const founderContact = {
  name: "",
  role: "the founder",
  email: "aarun@hitasoft.com",
  linkedin: "https://www.linkedin.com/in/arun-andiselvam/",
  phone: "+91 77080 04693",
  /* No spaces or brackets: a dialler parses the href, not the text. */
  tel: "tel:+917708004693",
  /*
   * wa.me is WhatsApp's own short link and takes the number in full
   * international form with no plus and no spaces. The prefilled text saves
   * the visitor writing an opener and tells the person answering where the
   * message came from, which a bare "hi" does not.
   */
  whatsapp: `https://wa.me/917708004693?text=${encodeURIComponent(
    "Hi, I came from hitasoft.com and I would like to talk about a project.",
  )}`,
} as const;

export const contactCopy = {
  eyebrow: "Contact",
  title: "How can we help?",
  lede: "Tell us what is taking your team the longest. The first reply we send is a question or a time to talk, never a proposal.",
};

/**
 * What somebody wants to know before they fill a form in.
 *
 * Written against the fears in docs/positioning.md rather than as a product
 * FAQ. Cost that cannot be predicted is fear one, being left with something
 * nobody in house understands is fear two, and both are answered here.
 *
 * Nothing below promises anything the company cannot deliver by deciding to.
 * There is no response time in hours, no NDA commitment and no start date,
 * because none of those has been agreed by anybody.
 */
export const contactFaqs = [
  {
    question: "What happens after I send this?",
    answer:
      "Somebody reads it and replies within one working day. The reply is a question or a time to talk, not a proposal, because nobody can price work they have not looked at.",
  },
  {
    question: "What does the first step cost?",
    answer:
      "Nothing. The audit is free. You keep the costed plan and the risk list at the end of it, whether you go ahead with the build or not.",
  },
  {
    question: "Do we need an IT team to work with you?",
    answer:
      "No. Most companies we work with do not have one. We do the building and the running, and the handover is written for somebody who is not an engineer.",
  },
  {
    question: "What do you need from us to start?",
    answer:
      "Access to the system and one person who can answer questions about how the work is done today. That second one matters more than the first.",
  },
];

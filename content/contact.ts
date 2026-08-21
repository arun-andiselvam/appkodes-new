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
    // No href. A maps link would be guessing at a place ID, and the postal
    // address is the thing somebody actually needs.
    label: "Office",
    value:
      "Door No 9/1, Karthick Center, Kamala First Street, Chinna Chockikulam, Madurai 625002, Tamil Nadu, India",
  },
];

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
      "The review is a fixed price, agreed before it starts. You keep the costed plan and the risk list at the end of it, whether you go ahead with the build or not.",
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

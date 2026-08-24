import type { StrapiApp } from "@strapi/strapi/admin";
import {
  Autoformat,
  BlockQuote,
  Bold,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageInsert,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  Paragraph,
  PasteFromOffice,
  Table,
  TableCaption,
  TableToolbar,
} from "ckeditor5";
import { setPluginConfig, StrapiMediaLib, StrapiUploadAdapter } from "@_sh/strapi-plugin-ckeditor";

/**
 * The article editor.
 *
 * !! THE TOOLBAR IS THE CONTENT MODEL, NOT A LIST OF FEATURES !!
 *
 * The body used to be a dynamic zone of seven components. The client asked on
 * 24 August 2026 for a real rich text editor, so it is CKEditor now and the
 * site parses what it produces back into those same seven block kinds. See
 * lib/html-to-blocks.ts.
 *
 * Which means this toolbar is not a matter of taste. Every button here has to
 * map onto something `htmlToBlocks` understands and the article template can
 * draw. A button the site cannot render produces markup that silently
 * disappears from the published page, and the writer has no way to know.
 *
 * The default presets that ship with the plugin were not used for exactly that
 * reason. They enable an extensive set of CKEditor features, most of which
 * this site has no renderer for: font colour, alignment, media embeds, code
 * blocks, h1 and h4 through h6.
 *
 * !! HEADINGS ARE RESTRICTED TO TWO AND THREE ON PURPOSE !!
 *
 * h1 is the article title and the page may only have one, so it is not on
 * offer. Below h3 nothing is rendered differently and the contents panel stops
 * making sense. docs/blog-structure.md asks for a strict h2 and h3 hierarchy,
 * and the cheapest way to get one is an editor that cannot produce anything
 * else.
 *
 * !! ONE BLOCK KIND WAS LOST IN THE MOVE !!
 *
 * `callout`, the single line set apart, has no CKEditor equivalent and is not
 * worth a custom plugin yet. Block quote covers the nearest case. If callouts
 * turn out to matter, the honest way back is a CKEditor style rather than
 * asking writers to remember a convention.
 */
const hitasoftPreset = {
  name: "Hitasoft article",
  description: "Only what the site can render. See src/admin/app.tsx.",
  editorConfig: {
    /* Community Edition. The plugin is GPL and so is this usage of it. */
    licenseKey: "GPL",
    plugins: [
      Essentials,
      Paragraph,
      Heading,
      Bold,
      Italic,
      Link,
      List,
      BlockQuote,
      Table,
      TableToolbar,
      TableCaption,
      Image,
      ImageCaption,
      ImageInsert,
      ImageStyle,
      ImageToolbar,
      ImageTextAlternative,
      ImageUpload,
      /*
        Writers paste from Google Docs and Word constantly, and without this
        the paste arrives as a wall of inline styles that the parser then has
        to throw away. With it, CKEditor normalises the paste into real
        headings and lists first.
      */
      PasteFromOffice,
      Autoformat,
      /* Uploads land in the Strapi media library rather than as base64. */
      StrapiMediaLib,
      StrapiUploadAdapter,
    ],
    heading: {
      options: [
        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
      ],
    },
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "|",
      "bulletedList",
      "numberedList",
      "blockQuote",
      "|",
      "insertTable",
      "strapiMediaLib",
      "insertImage",
      "|",
      "undo",
      "redo",
    ],
    image: {
      /*
        The caption and the alt text are both in the toolbar because the site
        requires both on every figure, and the editorial check in the CMS
        refuses a save without them. Putting them one click away is the
        difference between a rule people follow and a rule people resent.
      */
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
      ],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "toggleTableCaption"],
    },
    link: {
      /*
        Internal links are the point of an article here. Every post has to send
        the reader down into a service or industry silo, so relative paths must
        survive rather than being rewritten as external URLs.
      */
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
    },
  },
};

export default {
  config: {
    locales: [],
  },
  register() {
    /*
      Passing only this preset replaces the two the plugin ships with, which
      is the intent. A writer who can choose "Default HTML editor" from a
      dropdown can turn on every feature this file exists to keep out.
    */
    setPluginConfig({ presets: [hitasoftPreset] });
  },
  bootstrap(_app: StrapiApp) {},
};

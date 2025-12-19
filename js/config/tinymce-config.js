/**
 * TinyMCE Configuration
 * Settings for TinyMCE rich text editor
 */

const tinyMCE_settings = {
  selector: ".editable",
  menubar: false,
  inline: true,
  nowrap: true,
  skin: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "oxide-dark"
    : "oxide",
  plugins: [
    "link",
    "autolink",
    "code",
    "codesample",
    "lists",
    "paste",
    "image",
    "help",
  ],
  default_link_target: "_blank",
  link_default_protocol: "https",
  paste_as_text: true,
  contextmenu: false,
  toolbar: [
    "blocks fontsize | bold italic underline | align lineheight |  removeformat ",
    "forecolor backcolor | numlist  bullist | superscript subscript | link image | undo redo | code",
  ],
  block_formats:
    "Paragraph=p;Heading 1=h1;Heading 2=h2;Heading 3=h3;Heading 4=h4;",
  fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt",
  setup: function (editor) {
    editor.on("BeforeAddUndo", function (e) {
      document.querySelector("#" + editor.id).dispatchEvent(new Event("input"));
    });
  },
};

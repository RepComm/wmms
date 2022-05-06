import { ContextPanel, EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel, Text } from "@repcomm/exponent-ts";
import { Editor } from "./components/editor.js";
import { ImgBtn } from "./components/imgbtn.js";
import { Tracks } from "./components/tracks.js";
EXPONENT_CSS_STYLES.mount(document.head);
EXPONENT_CSS_BODY_STYLES.mount(document.head);

async function main() {
  const container = new Panel().setId("container").addClasses("bg-color-darkest").setStyleItem("flex-direction", "column").mount(document.body);
  const header = new Panel().setId("header").setStyleItem("max-height", "2em").addClasses("bg-color-dark").mount(container);
  const title = new Text().setId("title").setTextContent("wmms - web multimedia studio").mount(header);
  const content = new ContextPanel().setId("content") // .setStyleItem("flex", "10")
  .setStyleItem("flex-direction", "column").addClasses("bg-color-darkest");

  function makeContextSwitchButtons(...ids) {
    for (let id of ids) {
      let _id = id;
      const btn = new ImgBtn().setTextContent(id).addClasses("header-button").on("click", evt => content.switchContext(_id)).mount(header);
      btn.setImage(`./images/${_id}-icon.svg`);
      btn.img.addClasses("header-button-image");
      btn.label.addClasses("header-button-label");
    }
  }

  makeContextSwitchButtons("tracks", "editor");
  content.mount(container);
  const editor = new Editor().setId("editor").mount(content);
  const tracks = new Tracks().setId("tracks").onTrackEvent(evt => {
    editor.setTrackId(evt.trackId);
    content.switchContext("editor");
  });
  content.addContext("tracks", tracks);
  content.addContext("editor", editor);
  content.switchContext("tracks");
}

main();
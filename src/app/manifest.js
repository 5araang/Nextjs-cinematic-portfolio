export default function manifest() {
  return {
    name:             "Sarang — Creative Developer",
    short_name:       "Sarang",
    description:      "Cinematic digital experiences at the intersection of design and code.",
    start_url:        "/",
    display:          "standalone",
    background_color: "#080808",
    theme_color:      "#ff6b1a",
    lang:             "en",
    icons: [
      { src: "/photo/favicon.png", sizes: "192x192", type: "image/png" },
      { src: "/photo/favicon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}

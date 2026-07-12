// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  output: "static",
  // Used for the sitemap and canonical URLs. Update this to your final domain.
  // Netlify gives you a default like https://cocolo-brand.netlify.app — paste
  // that here, or your custom domain (e.g. https://brand.cocolotravel.com) once set.
  site: "https://cocolo-brand.netlify.app",
  integrations: [
    starlight({
      title: "COCOLO Brand",
      description:
        "The brand identity, voice, and visual rules for COCOLO Travel.",
      // Brand CSS is layered on top of Starlight's defaults. The first file
      // pulls in the live tokens from the assets bucket; the second maps those
      // tokens onto Starlight's own theme variables and styles components.
      customCss: ["./src/styles/tokens.css", "./src/styles/brand.css"],
      // Use system fonts by default; the brand fonts are loaded in tokens.css.
      sidebar: [
        { label: "Overview", link: "/" },
        {
          label: "Foundations",
          items: [
            { label: "Colors", link: "/guidelines/colors/" },
            { label: "Typography", link: "/guidelines/typography/" },
            { label: "Spacing", link: "/guidelines/spacing/" },
          ],
        },
        {
          label: "Identity",
          items: [
            { label: "The idea", link: "/guidelines/concept/" },
            { label: "Logo", link: "/guidelines/logo/" },
            { label: "Voice & tone", link: "/guidelines/voice/" },
            { label: "Imagery", link: "/guidelines/imagery/" },
          ],
        },
        {
          label: "For developers",
          items: [{ label: "Using the tokens", link: "/guidelines/tokens/" }],
        },
      ],
      // No social links yet; add when ready.
    }),
  ],
});

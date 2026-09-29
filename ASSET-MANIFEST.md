# Asset and Ingredient Provenance

All images in `public/images/` were generated for this fictional SOVA concept using the built-in `image_gen` tool on 2026-09-28, then copied into this project. They are original concept mockups, not photographs of manufactured products. No runtime image-generation API is used.

## Final image prompt set

| File | Final prompt / composition |
|---|---|
| `hero.png` | Landscape 3:2 luxury botanical-science campaign photograph; SOVA matte warm-white and sage cleanser, serum, jar, and tube on pale limestone with translucent fluid smear, oat stem, leaf shadows, warm daylight; generous left breathing room; no people, pink, claims, UI, or watermark. |
| `cleanser.png` | Portrait 4:5 e-commerce photograph of one matte warm-white SOVA pump bottle on ivory stone, translucent cleansing gel swirl, oat stems, soft green shadow; no other legible text. |
| `serums.png` | Portrait 4:5 editorial photograph of two frosted SOVA dropper bottles, one sage and one ivory, with clear serum droplets on limestone and botanical shadow. |
| `moisture-treatment.png` | Portrait 4:5 editorial photograph of a sage moisturizer jar and warm-white treatment tube with a soft cream swipe on a clay limestone plinth. |
| `texture.png` | Landscape 3:2 extreme macro still life of clear serum droplets, white moisturizer smear, translucent glass, oat stem, ivory stone, and sage shadows; no text. |
| `body.png` | Portrait 4:5 premium body-care photograph of one pale sage SOVA pump bottle beside folded white linen, lotion swipe, and limestone shelf. |
| `dew.png` | Portrait 4:5 single frosted clear SOVA dropper bottle with ivory label, clear drops, tiny oat stem, warm cream limestone, soft botanical shadows. |
| `even.png` | Portrait 4:5 single deep olive SOVA dropper bottle with pale green label, serum droplet, limestone, and warm leaf shadow. |
| `moisturizer.png` | Portrait 4:5 single sage SOVA moisturizer jar with ivory lid, white cream swipe, and pale limestone plinth. |
| `mask.png` | Portrait 4:5 single ivory SOVA treatment tube with green cap on a clay stone pedestal, rich white cream fold, and oat detail. |
| `*-cutout.png` (six files) | For each corresponding single-product photograph (`cleanser.png`, `dew.png`, `even.png`, `moisturizer.png`, `mask.png`, `body.png`), edit the reference into a transparent-background e-commerce cutout. Retain only the single container, preserving its form, color, cap/pump, material texture, and SOVA mark. Remove all set elements, shadows, and background; center the complete product with generous transparent margins. Do not invent new text or props. |

The prompts shared a warm cream and mineral green palette, premium botanical-science art direction, realistic tactile materials, simple SOVA mark, and explicit exclusions for pink, people, badges, interface elements, claims, and watermarks. The cutouts are generated edits of the primary product images; their PNG files have alpha channels. Product data and descriptive alt text are maintained in `data/catalog.ts`.

## Ingredient note references

The ingredient library uses broad cosmetic role descriptions. These sources support those general descriptions; they do **not** validate any fictional SOVA finished formula or concentration.

- Glycerin / glycerol as a humectant: [Glycerol and the skin](https://pubmed.ncbi.nlm.nih.gov/18510666/); [glycerin-containing cream study](https://pubmed.ncbi.nlm.nih.gov/18498456/).
- Squalane as an emollient: [Cosmetic Ingredient Review safety assessment](https://journals.sagepub.com/doi/pdf/10.3109/10915818209013146).
- Niacinamide and visible skin appearance: [clinical study on facial appearance](https://pubmed.ncbi.nlm.nih.gov/16029679/). The site uses weaker cosmetic wording and does not transfer the study's efficacy findings to SOVA.
- Panthenol as a moisturizer: [Topical dexpanthenol review](https://pubmed.ncbi.nlm.nih.gov/12113650/).
- Oat-derived material in moisturizing products: [Colloidal oatmeal product review](https://pubmed.ncbi.nlm.nih.gov/23204849/). The site deliberately notes that effects depend on the specific material and formula.
- Jojoba oil as a wax ester and cosmetic emollient: [Jojoba review](https://pubmed.ncbi.nlm.nih.gov/24442052/); [jojoba wax characterization](https://pubmed.ncbi.nlm.nih.gov/29484216/).

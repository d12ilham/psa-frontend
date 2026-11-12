# Public Safety — Pending Slide Feedback Items

Extracted on 12 November 2026 from [Public-Safety-Slide-19-Status.md](./Public-Safety-Slide-19-Status.md).

**97 tracked items across 44 slide sections: 96 Complete, 1 Pending.**

Items retain their original slide order, item numbers, requested changes and original audit findings. The Status and Verified finding columns preserve the original audit snapshot. The new Completion status column records implementation progress. Historical review dates and links remain as recorded except where a completion entry records a new verification. The source audit is unchanged.

## Open slide summary

Counts cover the items tracked in this file. Slides with no remaining pending items are omitted.

| Slide number | Closed items / Total items for the slide |
|---|---|
| 88 | 2 / 3 |

**Total closed items / Total open items: 96 / 1.**

## Slide 19 — Core Skill Alignment

Page [Core Skill Alignment](http://127.0.0.1:3000/reports/public-safety-wir-2026/cross_sector_core_skill_alignment).

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Apply a light sector colour to the backgrounds of all four occupation cards. | Pending | All four card backgrounds remain white. Only the top accent strips use sector colours. Defence needs a pale gold tint, Emergency Services Officer and Firefighter a pale FES tint, and General Duties Police Officer a pale blue tint. | Complete |

Completed on 12 November 2026. Applied pale gold (#FBF3E3) to Defence, pale FES (#FCECE8) to Emergency Services Officer and Firefighter, and pale blue (#E7F1F6) to Police. Verified all four rendered backgrounds visually and through computed colours on [Core Skill Alignment](http://localhost:3001/reports/public-safety-wir-2026/cross_sector_core_skill_alignment). Occupation text and OSCA codes are preserved. The component passes ESLint. The white-background finding above is retained as the original audit record.

## Slide 20 — Core Skill Alignment graph

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Overhaul the shared-core-skills graphic to match the radar chart illustrated on the slide. | Pending | The page still displays a green hub-and-spoke graphic. It does not show the three overlapping occupation profiles on the illustrated ten-axis radar chart. | Complete |
| 2 | Show three distinct chart series and legend entries for Emergency Service Worker, Fire Fighter and Police Officer. | Pending | Current labels include Defence Force Member, combine Emergency Service Worker and Fire Fighter into one label, and show Police Officer separately. There are no corresponding plotted occupation profiles. | Complete |
| 3 | Match the illustrated arrangement, with the radar chart on the left and its legend and explanatory paragraph on the right. | Pending | The right side currently contains skill chips, a source caption and occupation chips. The explanatory paragraph is in a separate panel underneath. | Complete |
| 4 | Change the explanatory paragraph to begin “These three occupations encompass a range of core skills…” | Pending | The current paragraph begins “These four occupations encompass a range of core skills…”. The requested change applies to the three occupations represented in the replacement chart. | Complete |

Slide 20, item 1 completed on 12 November 2026. Replaced only the graph image with the ten-axis radar chart extracted directly from approved report page 12 (PDF page 14). The extraction preserves the three printed profiles without estimating or inventing data. Verified the asset loads at its full 1416 × 786 resolution on [Core Skill Alignment](http://localhost:3001/reports/public-safety-wir-2026/cross_sector_core_skill_alignment), with its proportions preserved in the existing chart area. ESLint passed. The surrounding legend/chips, layout and explanatory paragraph were not changed; items 2–4 remain Pending. The finding in item 1 above is retained as the original audit record.

Slide 20, item 2 completed on 12 November 2026. The approved radar image already contains the three printed profiles. Replaced the incorrect occupation chips with separate Emergency Service Worker, Fire Fighter and Police Officer legend entries. Their line swatches match the approved chart colours exactly: #DBAE6D, #F79063 and #A8D8EA respectively. Verified all three labels and computed swatch colours on localhost:3001; ESLint passed. The graphic, surrounding layout, skill chips, source caption and explanatory paragraph were not changed for this item. Items 3–4 remain Pending.

Slide 20, item 3 completed on 12 November 2026. The radar remains on the left; its three-entry legend is stacked on the right with the explanatory paragraph immediately below it. Removed the redundant skill chips from that chart area and retained the source caption beneath the chart row. Moved the paragraph without changing its wording; item 4 remains Pending. Verified the desktop arrangement at 1920 × 1080 and narrow-screen stacking at 390px on localhost:3001, with no chart-panel horizontal overflow. ESLint passed. No other page sections or approved chart values were changed.

Slide 20, item 4 completed on 12 November 2026. Changed only “four” to “three” in the chart explanation. Verified that the rendered paragraph on localhost:3001 begins “These three occupations encompass a range of core skills…”. The rest of the paragraph, all other page text, chart and layout are unchanged. ESLint passed. All four Slide 20 items are now Complete.

## Slide 21 — Specialist Skill Alignment

Reviewed on 11 November 2026 against [Specialist Skill Alignment](http://127.0.0.1:3000/reports/public-safety-wir-2026/cross_sector_specialist_skill_alignment) at a 1537px desktop viewport.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Change the central diagram label to “SPECIALIST SKILLS ALIGNMENT”. | Pending | The diagram still reads “SKILLS ALIGNMENT”. | Complete |
| 2 | Give all four skill boxes the same colour treatment, including a white Search and Rescue box. | Pending | Investigations, Incident Command and Intelligence have white backgrounds with dark text. Search and Rescue still has a dark-green background with white text. | Complete |
| 3 | Add “See the specialist skills alignment diagram to the right” to the introductory copy. | Pending | The introduction ends with “there are specialist roles and skills alignment between, for example:”. The requested direction is absent. The diagram retains its existing explanatory caption underneath. | Complete |

Slide 21, item 1 completed on 12 November 2026. Replaced only the central SVG label with “SPECIALIST SKILLS ALIGNMENT”, fitting the full wording inside the existing button. Updated the image alternative text to identify specialist skills alignment. Verified the rendered label visually on [Specialist Skill Alignment](http://localhost:3001/reports/public-safety-wir-2026/cross_sector_specialist_skill_alignment). SVG XML validation and ESLint passed. The four skill boxes, their colours, connecting lines, diagram dimensions and all other page content are unchanged; items 2–3 remain Pending.

Slide 21, item 2 completed on 12 November 2026. Changed only the Search and Rescue box background to white and its label to #1A2205, matching the other three skill boxes. Verified all four white boxes with dark labels visually on localhost:3001 after restoring the frontend server. SVG XML validation and git diff --check passed. The central label, icons, connectors, diagram dimensions and other page content are unchanged; item 3 remains Pending.

Slide 21, item 3 completed on 12 November 2026. Added only “See the specialist skills alignment diagram to the right.” to the introduction. Verified the sentence appears beside the diagram on localhost:3001; ESLint passed. Existing introduction text, diagram, caption and all other page content are unchanged. All three Slide 21 items are now Complete.

## Slide 22 — Specialist Skill Alignment example heading

Reviewed on 11 November 2026 against [Specialist Skill Alignment](http://127.0.0.1:3000/reports/public-safety-wir-2026/cross_sector_specialist_skill_alignment).

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Rename the “Example” section to “Cross Industry-Sector Specialist Skills Alignment Example”. | Pending | The live section heading remains “Example”. The requested full heading is absent. | Complete |

Slide 22, item 1 completed on 12 November 2026. Changed only the “Example” section heading to “Cross Industry-Sector Specialist Skills Alignment Example”. Verified the exact heading and its rendered layout on localhost:3001; ESLint passed. All other page content and styles are unchanged.

## Slide 23 — Match the introductory and comparison-table headers

Reviewed on 11 November 2026 against [Specialist Skill Alignment](http://127.0.0.1:3000/reports/public-safety-wir-2026/cross_sector_specialist_skill_alignment).

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Match the Defence / DEFMIL024 header in both locations. | Pending | The introductory card has a gold package badge, a 20px bold dark code and an 18px bold green title. The table uses 14px medium-weight gold text on a pale-gold background and omits the package badge. | Complete |
| 2 | Match the Public Safety / PUAAMS007 header in both locations. | Pending | The introductory card has an orange package badge, a 20px bold dark code and an 18px bold green title. The table uses 14px medium-weight orange text on a pale-orange background and omits the package badge. | Complete |
| 3 | Match the Police / POLSAR012 header in both locations. | Pending | The introductory card has a blue package badge, a 20px bold dark code and an 18px bold green title. The table uses 14px medium-weight blue text on a pale-blue background and omits the package badge. The title also includes “(SAR)” only in the table. | Complete |

Slide 23, item 1 completed on 12 November 2026. Matched only the Defence table header to the introductory Defence card: white card background, gold accent and training-package badge, 20px/700 dark DEFMIL024 code and 18px/700 green title. Verified both locations have identical computed typography and colours on localhost:3001 and visually checked the table header. ESLint passed. The Public Safety and Police headers, comparison criteria and other page content are unchanged; items 2–3 remain Pending.

Slide 23, item 2 completed on 12 November 2026. Applied the existing matched-header treatment only to the PUAAMS007 table header. Both locations now share the white background, orange accent and package badge, 20px/700 dark code and 18px/700 green title. Verified identical computed typography and colours in both locations and visually checked the table on localhost:3001; ESLint passed. The Defence and Police headers, comparison criteria and all other page content were not changed for this item. Item 3 remains Pending.

Slide 23, item 3 completed on 12 November 2026. Matched the Police table header to the introductory card's white background, blue accent/package badge, 20px/700 dark code and 18px/700 green title. Both locations now use the shared full title “Coordinate police search and rescue (SAR) operations”, retaining the approved acronym already present in the table. Verified identical text, computed typography and colours on localhost:3001 and visually checked the table header; ESLint passed. The Defence/Public Safety headers and all comparison criteria are unchanged. All three Slide 23 items are now Complete.

## Slide 24 — Connect the four skill summaries to the comparison table

Reviewed on 11 November 2026 against [Specialist Skill Alignment](http://127.0.0.1:3000/reports/public-safety-wir-2026/cross_sector_specialist_skill_alignment).

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Match the design of the four summary boxes in the corresponding comparison-table row headings so readers can connect the two sections. | Pending | Summary boxes have pale-green backgrounds, large numbers 1–4, bold headings and explanatory text. Table row headings remain plain text on white cells, without the matching numbered-box treatment. | Complete |

Slide 24, item 1 completed on 12 November 2026. Applied the existing skill-summary card treatment to each corresponding table row heading, matched by skill title. All four now have the pale-green #F0F5DF background, large numbers 1–4, 16px/700 headings and the matching explanatory descriptions. Verified all four rendered headings, numbers, text and computed colours on localhost:3001 and visually checked the table. ESLint passed. The original summaries, training-product headers and performance criteria are unchanged.

## Slide 25 — Units of Competency Insights heading

Reviewed on 11 November 2026 against [Specialist Skill Alignment](http://127.0.0.1:3000/reports/public-safety-wir-2026/cross_sector_specialist_skill_alignment).

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Place that heading above the explanatory paragraph beginning “Where these units of competency differ…”, as marked on the slide. | Pending | The paragraph currently appears first, followed by the heading above the table. The heading needs to precede the explanatory paragraph to match the marked location. | Complete |

Slide 25, item 2 completed on 12 November 2026. Moved only “Cross Industry-Sector Units of Competency Insights” so it precedes the paragraph beginning “Where these units of competency differ…”. Verified the live reading order on localhost:3001 is heading, explanatory paragraph, then comparison table. The heading ID and table region's accessible label are preserved. ESLint passed. Paragraph wording, table content and all other page content are unchanged.

## Slide 29 — Defence Industry-Sector Overview text alignment

Reviewed on 11 November 2026 against [Defence Industry-Sector Overview](http://127.0.0.1:3000/reports/public-safety-wir-2026/defence_industry_overview) at a 1537px desktop viewport.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Line up the overview text with the hero text and Sources heading, as indicated by the vertical red guide. | Pending | The hero title, hero paragraph and Sources heading start at approximately 65px from the viewport edge. The workforce-planning paragraph and datapoints heading start at approximately 41px, leaving a 24px misalignment. | Complete |

Slide 29, item 1 completed on 12 November 2026. Added horizontal padding only to the overview introduction: 24px on desktop and 20px below 640px, matching the hero and Sources insets. Verified the hero title, workforce-planning paragraph, datapoints heading and Sources heading all start at 48px in the tested desktop viewport. At 390px, the hero, introduction and Sources share a 36px left edge. Verified visually on [Defence Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_overview); git diff --check passed. No text, data, charts or other page styles changed.

## Slide 30 — Current Workforce readability and graphics

Reviewed on 11 November 2026 against the open Current Workforce panel on [Defence Industry-Sector Overview](http://127.0.0.1:3000/reports/public-safety-wir-2026/defence_industry_overview) at a 1537px desktop viewport.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 4 | Add graphics to the enlistment-statistic cards, following the approved document examples shown on the slide. | Pending | The four cards contain numbers and text only. The requested illustrative graphics are absent. | Complete |

Completion verification (12 November 2026): Added the star, aircraft, shield and laurel graphics extracted from approved report page 20 (PDF page 22) to the four Current Workforce enlistment cards. Verified all four images load on http://localhost:3001/reports/public-safety-wir-2026/defence_industry_overview at desktop (1920px) and mobile (390px) widths without card overflow. Figures and wording remain unchanged, including 6,228, 1,296, 4,932, 20.6% and 5.8%. Targeted ESLint and git diff whitespace validation passed. No other page changes made for this item.

## Slide 33 — Defence Industry Profile scrolling and chart readability

Reviewed on 11 November 2026 in the new psa-frontend project against [Defence Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_profile). The male/female chart shown on the slide was selected for the desktop browser check.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Enlarge chart fonts for easy reading on a large screen, including the category labels and percentage values highlighted on the slide. | Pending | The male/female chart still uses 12px category labels and percentage values in a fixed-width 708px SVG. Its title is 18px and legend is 14px. The highlighted labels remain small within the large presentation panel. | Complete |

Slide 33, item 2 completed on 12 November 2026. Enlarged only the male/female workforce chart text: category labels, percentages, axis ticks, legend, presentation label and source caption are now 16px; the title is 20px. Verified computed font sizes and visually checked the complete chart at 1920 × 1080 on [Defence Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_profile), selection 3. All labels fit without overlap or clipping. All ten approved percentages, chart geometry and other selections remain unchanged. Scoped CSS applies only to this chart; git diff --check passed.

## Slide 34 — Headcount chart legend and percentage changes

Reviewed on 11 November 2026 against selection 1 on [Defence Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_profile) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Ensure the chart text no longer overlaps, the stated purpose of adding the legend. | Pending | Air Force and Navy numeric labels still overlap. The 2024 values 15,261 and 14,745 have text boxes approximately 16px high but only 7px apart vertically. The 2025 labels and their percentage changes also have intersecting text boxes. | Complete |

Slide 34, item 2 completed on 12 November 2026. Separated the Air Force and Navy value labels above/below their close endpoints, with short colour-matched guide lines. Added horizontal space between the 2025 values and percentage changes. Verified visually at 1920 × 1080 on [Defence Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_profile), selection 1; rendered text-bound checks found no intersecting chart labels. All ten headcounts, five percentage changes, plotted trajectories and legend remain unchanged. Other charts and page sections were not changed. Targeted ESLint and git diff --check passed.

## Slide 36 — Workforce map ACT label and base-count note

Reviewed on 11 November 2026 against selection 5 on [Defence Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_profile) in the new psa-frontend project. Both WA and ACT were selected during verification.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Add a visible ACT label to the map at the location marked on the slide. | Pending | ACT is available in the jurisdiction controls and selecting it updates the statistics, but there is no visible ACT label on the map itself. | Complete |
| 2 | Complete the base-count label as “Major Defence bases*”. | Pending | The third statistic card still reads “Major Defence”, omitting “bases” and the asterisk. | Complete |
| 3 | Add the matching asterisk at the start of the explanatory base-count note. | Pending | The explanatory note is present and begins “Major Defence bases. Please note…”, but its opening asterisk is absent. | Complete |

Slide 36, item 1 completed on 12 November 2026. Added a visible ACT badge and short guide line to the ACT location in the Defence map SVG. The badge uses the existing selection colour handling. Verified visually on [Defence Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_profile), selection 5, with WA and ACT selected; ACT displays the unchanged approved figures 7,691 permanent ADF, 4,185 reserves and 9 bases. SVG XML validation and git diff --check passed. No other page changes made; items 2–3 remain Pending.

Slide 36, item 2 completed on 12 November 2026. Changed only the third workforce-map statistic label from “Major Defence” to “Major Defence bases*”. Verified its exact rendered wording and visual fit on [Defence Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_profile), selection 5. All values, map artwork and explanatory note remain unchanged; item 3 remains Pending. Targeted ESLint and git diff --check passed.

Slide 36, item 3 completed on 12 November 2026. Added only the opening asterisk to the explanatory base-count note, matching “Major Defence bases*” on the statistic card. Verified the exact note text and its visible marker on [Defence Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/defence_industry_profile), selection 5. The rest of the note, all values, map and other page content are unchanged. Targeted ESLint and git diff --check passed. All Slide 36 items are now Complete.

## Slide 39 — Emerging Technology, Theme 1 Insight 1

Reviewed on 11 November 2026 against [Emerging Technology Insight One](http://localhost:3001/reports/public-safety-wir-2026/defence_emerging_technology) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Move “The complete supporting report content follows below. Use ‘Back to Workforce Insights’ to return to the presentation anchor” from the insight box to the hero subtitle position marked on the slide. | Pending | The sentence has been removed from the insight box but is absent from the hero and the rest of the page. It has not been relocated to the requested position. | Complete |

Slide 39, item 2 completed on 12 November 2026. Restored the requested supporting-content sentence as a black subtitle immediately below the Emerging Technology hero title. Verified its exact wording, single occurrence and placement outside the insight callout on [Emerging Technology Insight One](http://localhost:3001/reports/public-safety-wir-2026/defence_emerging_technology). All existing insight/body/source content, figures and other page elements remain unchanged. Targeted ESLint and git diff --check passed.

## Slide 40 — Emerging Technology, Theme 1 Insight 2

Reviewed on 11 November 2026 against [Emerging Technology Insight Two](http://localhost:3001/reports/public-safety-wir-2026/defence_emerging_technology_2) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Move the supporting-content sentence out of the insight callout and into the hero subtitle position marked on the slide. | Pending | The sentence beginning “The complete supporting report content follows below” is absent from the page, including the hero. It was removed rather than relocated. | Complete |
| 6 | Replace the capability-investment graphics with new graphics in the LG WIR style, including the satellite and NATO-style compass examples marked on the slide. | Pending | The six capability cards still show dark standalone pictograms. The marked maritime card does not show the satellite example, and the networks card shows a shield instead of the indicated compass design. The requested consistent LG WIR graphic treatment is incomplete. | Complete |

Slide 40, item 2 completed on 12 November 2026. Added the requested supporting-content sentence below the Insight Two hero title using the existing hero subtitle style. Verified its exact wording, single occurrence and placement outside the insight callout on [Emerging Technology Insight Two](http://localhost:3001/reports/public-safety-wir-2026/defence_emerging_technology_2). Only this subtitle was added; all other page content, graphics and approved values are unchanged. Targeted ESLint and git diff --check passed. Item 6 remains Pending.

Slide 40, item 6 completed on 12 November 2026. Replaced the six capability-card pictograms with consistent 60px pale-gold circular graphics and Defence-gold linework (#D3992C): satellite, brain/circuit, NATO-style compass rose, drone, cyber shield and radio/sensor tower. Verified all six graphics visually and checked their computed colours and dimensions on [Emerging Technology Insight Two](http://localhost:3001/reports/public-safety-wir-2026/defence_emerging_technology_2). All six cards fit at 390px without horizontal overflow. Card labels, approved figures, layout, hero and lower drone-investment graphics are unchanged. Targeted ESLint and git diff --check passed. Both tracked Slide 40 items are now Complete.

## Slide 41 — Transitioning Veterans, Theme 2 Insight 1

Reviewed on 11 November 2026 against [Transitioning Veterans Insight One](http://localhost:3001/reports/public-safety-wir-2026/defence_transitioning_veterans) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Move the supporting-content sentence from inside the insight callout to the hero subtitle position marked on the slide. | Pending | The sentence beginning “The complete supporting report content follows below” is absent from the page, including the hero. It has not been relocated. | Complete |
| 5 | Make “Defence veterans are defined as:” bold. | Pending | This introduction remains a paragraph with a computed font weight of 400. The quotation below it is bold, but the marked introductory line is not. | Complete |
| 6 | Move the veteran-definition content into a box on the right to fill the white space. | Pending | The definition is already in a pale-gold box, but the box is in the left column. The Royal Commission and RPL explanatory content sits to its right. | Complete |

Slide 41, item 2 completed on 12 November 2026. Restored the supporting-content sentence beneath the Transitioning Veterans hero title using the existing subtitle style. Verified the exact sentence appears once, in the hero and outside the insight callout, on [Transitioning Veterans Insight One](http://localhost:3001/reports/public-safety-wir-2026/defence_transitioning_veterans). Only the subtitle was added; the definition box, insight, approved content and figures are unchanged. Targeted ESLint and git diff --check passed. Items 5–6 remain Pending.

Slide 41, item 5 completed on 12 November 2026. Made only “Defence veterans are defined as:” bold using semantic strong markup. Verified the rendered text has font weight 700 and visually checked it on [Transitioning Veterans Insight One](http://localhost:3001/reports/public-safety-wir-2026/defence_transitioning_veterans). Wording, quotation, footnote and layout remain unchanged. Targeted ESLint and git diff --check passed. Item 6 remains Pending.

Slide 41, item 6 completed on 12 November 2026. Moved the existing pale-gold veteran-definition box to the right and the Royal Commission/RPL content to the left, preserving each column's relative width. Verified the right-side placement visually on [Transitioning Veterans Insight One](http://localhost:3001/reports/public-safety-wir-2026/defence_transitioning_veterans); at 390px the sections stack in one column without horizontal overflow. Definition wording, bold introduction, footnote 29, explanatory content and all other page elements are unchanged. Targeted ESLint and git diff --check passed. All tracked Slide 41 items are now Complete.

## Slide 42 — Transitioning Veterans, Theme 2 Insight 2

Reviewed on 11 November 2026 against [Transitioning Veterans Insight Two](http://localhost:3001/reports/public-safety-wir-2026/defence_transitioning_veterans_2) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Move the supporting-content sentence out of the insight callout to the hero subtitle position marked on the slide. | Pending | The sentence beginning “The complete supporting report content follows below” is absent from the page, including the hero. | Complete |
| 4 | Present the state and territory support content as one section, removing the separate Appendix A heading/Open bar crossed out on the slide. | Pending | A large pale-green “Appendix A – Defence Veterans’ Programs and Initiatives” Open bar still separates the surrounding paragraphs. | Complete |
| 5 | Add the Appendix A link to the reference within the supporting paragraph, where marked on the slide. | Pending | The paragraph's Appendix A reference remains plain text. A separate Open bar links successfully to /defence_federal_initiatives, but the requested inline link is absent. | Complete |
| 6 | Add the additional insight beginning “The Vocational Education and Training (VET) system remains important for the ADF…” in the same style as the first insight, without a number. | Pending | Only the numbered Theme Two, Insight Two callout is present. The additional unnumbered insight shown at the bottom of the slide is absent. | Complete |

Slide 42, item 2 completed on 12 November 2026. Restored the supporting-content sentence beneath the Veterans Insight Two hero title using the existing subtitle style. Verified its exact wording, single occurrence and placement outside the insight callout on [Transitioning Veterans Insight Two](http://localhost:3001/reports/public-safety-wir-2026/defence_transitioning_veterans_2). No other page content or layout was changed. Targeted ESLint and git diff --check passed. Items 4–6 remain Pending.

Slide 42, item 4 completed on 12 November 2026. Removed the separate Appendix A heading/Open bar and joined the four existing support paragraphs in one continuous content block. Verified all four paragraphs remain and the Appendix bar is absent, with a visual check on [Transitioning Veterans Insight Two](http://localhost:3001/reports/public-safety-wir-2026/defence_transitioning_veterans_2). Paragraph wording, footnote 36 and all other page elements are unchanged. Targeted ESLint and git diff --check passed. The inline Appendix A link and additional insight remain Pending as items 5–6.

Slide 42, item 5 completed on 12 November 2026. Turned the existing “Appendix A – Defence Veterans’ Programs and Initiatives” text within the support paragraph into an underlined link to /defence_federal_initiatives. Verified the inline placement and followed the link on localhost:3001; the Defence Veterans’ Programs and Initiatives destination loaded successfully. Paragraph wording, layout, footnotes and other page content are unchanged. Targeted ESLint and git diff --check passed. Item 6 remains Pending.

Slide 42, item 6 completed on 12 November 2026. Added the requested VET statement below the support section and above Sources, using the existing pale-gold insight styling, gold accent and industry-insight icon, with no number. Verified the exact wording, placement and absence of a number visually and through the rendered page on [Transitioning Veterans Insight Two](http://localhost:3001/reports/public-safety-wir-2026/defence_transitioning_veterans_2). Existing insight, support paragraphs, inline Appendix link, source and other page elements remain unchanged. Targeted ESLint and git diff --check passed. All four tracked Slide 42 items are now Complete; Slide 42 is omitted from the open-slide summary.

## Slide 49 — Defence Veterans hero graphic replacement

Reviewed on 11 November 2026 against [Defence Veterans’ Programs and Initiatives](http://localhost:3001/reports/public-safety-wir-2026/defence_federal_initiatives) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Replace the hero graphic with the illustrated gold military-person-to-civilian transition icon shown on the slide. | Pending | The previous multi-icon graphic has been replaced with defence-veterans-icon.png: gold military and civilian figures inside a pale gold circle. However, the right-pointing arrow between the figures in the slide's replacement example is missing from the current asset and rendered hero. The replacement is substantially implemented but does not yet match the supplied example completely. | Complete |

Slide 49, item 1 completed on 12 November 2026. Added the missing gold right-pointing transition arrow between the military and civilian figures in this page’s 120px hero graphic, retaining the existing pale-gold circle and figures. Verified its rendered appearance and dimensions on [Defence Veterans’ Programs and Initiatives](http://localhost:3001/reports/public-safety-wir-2026/defence_federal_initiatives). The shared PNG remains unchanged, so other pages are unaffected. No content, figures, tabs or other page elements changed. Targeted ESLint and git diff --check passed. Slide 49 is now Complete and omitted from the open-slide summary.

## Slide 54 — FES Overview text alignment and fire-engine graphic

Reviewed on 11 November 2026 against [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Line up the text with the common left alignment marked on the slide, including the paragraph below the hero and the datapoints heading. | Pending | The hero paragraph and Sources heading begin at approximately 48px from the viewport edge, but the paragraph below the hero and the datapoints heading begin at approximately 24px. The requested common text alignment is still inconsistent by 24px at the tested desktop viewport. | Complete |

Slide 54, item 1 completed on 12 November 2026. Adjusted only the horizontal insets of the paragraph beneath the hero and the datapoints heading to match the hero and Sources text. Verified all four left edges are 48px at the tested desktop viewport and 36px at 390px on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). Visually checked the desktop layout. Wording, figures, graphics, service cards and all other page styles are unchanged. git diff --check passed. Slide 54 is now Complete and omitted from the open-slide summary.

## Slide 56 — FES career workforce content and chart arrangement

Reviewed on 11 November 2026 against the Career Firefighters and Emergency Services Employees selection on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 4 | Reorder the charts as illustrated: career Firefighters and career SES side by side, then the comparison insight, then the corresponding Fire and SES volunteer charts underneath their employee versions. | Pending | The live first row pairs Career Firefighters with Total Fire Volunteers; the second row pairs Career Operational SES Employees with Total SES Volunteers. The insight sits between these rows. This differs from the requested arrangement of both employee charts above the insight and both volunteer charts below it. | Complete |

Slide 56, item 4 completed on 12 November 2026. Reordered only the Career Employees selection charts: Career Firefighters and Career Operational SES Employees are side by side above the comparison paragraph; Total Fire Volunteers and Total SES Volunteers are side by side below it, aligned under their respective employee charts. Verified both chart rows visually and confirmed their rendered order on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). All chart datasets, axes, sources, paragraph wording and other selections are unchanged. Targeted ESLint and git diff --check passed. Slide 56 is Complete and omitted from the open-slide summary.

## Slide 57 — FES Volunteer Services incorrect and duplicated content

Reviewed on 11 November 2026 against the Volunteer Services selection on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Replace the incorrect introduction above the volunteer charts with the report page 54 Volunteer services paragraph shown on the slide. | Pending | The panel still begins with “Despite relative increases in career Firefighter and operational SES members…” rather than the requested paragraph explaining the nearly 12,000 decrease in volunteer firefighters from 2019–20 to 2024–25, the SES volunteer trend and wider volunteerism trends, with footnotes 48 and 49. The requested paragraph exists in the Career Employees selection, but is absent from this Volunteer Services selection. | Complete |
| 2 | Remove the duplicated comparison paragraph below the charts, crossed out on the slide. | Pending | The identical “Despite relative increases…” paragraph appears both above and below the volunteer charts. The lower duplicate remains. | Complete |

Slide 57, item 1 completed on 12 November 2026. Replaced only the Volunteer Services opening paragraph with the approved volunteer-trend paragraph already present in the Career Employees selection, including the nearly 12,000 decrease, SES trend and footnotes 48 and 49. Verified the exact rendered introduction and both markers above the charts on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview), Volunteer Services selection. Chart datasets, the lower comparison paragraph and all other selections are unchanged. Targeted ESLint and git diff --check passed. Item 2 remains Pending.

Slide 57, item 2 completed on 12 November 2026. Removed only the lower comparison paragraph from the Volunteer Services selection. Verified that the “Despite relative increases…” paragraph is absent from that selection while the approved introduction, footnotes 48–49 and both volunteer charts remain on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). The Career Employees comparison paragraph, chart data and other page content are unchanged. Targeted ESLint and git diff --check passed. Both Slide 57 items are Complete; the slide is omitted from the open-slide summary.

## Slide 59 — FES Overview original-source links

Reviewed on 11 November 2026 against the Sources section on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview) in the new psa-frontend project. The slide requests reviewing all footnotes against the report and adding links to the original sources. The rows below track that request for each listed reference.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Review footnote 43 and link its original Productivity Commission Tables 9A.6 and 9A.7 source. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |
| 2 | Review footnote 44 and link the AIDR Major Incidents Report 2024–25. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |
| 3 | Review footnote 45 and link the ABS Detailed Labour Force Survey, Table EQ08. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |
| 4 | Review footnote 46 and link Productivity Commission Table 9A.5. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |
| 5 | Review footnote 47 and link the JSA 2025 Occupation Shortage List. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |
| 6 | Review footnote 48 and link Productivity Commission Table 9A.4. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |
| 7 | Review footnote 49 and link Volunteering Australia's Key volunteering statistics in Australia. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |
| 8 | Review footnote 50 and link the SLSA 2024/25 Annual Report, page 118. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |
| 9 | Review footnote 51 and link the SLSA 2024/25 Annual Report, page 118. | Pending | The numbered source text is present, but contains no hyperlink. | Complete |

Slide 59, item 1 completed on 12 November 2026. Reviewed footnote 43 on approved report page 53 (PDF page 55) and added an underlined original-source link to the official Productivity Commission emergency-services page, which identifies Tables 9A.6 and 9A.7 and provides the data-table workbook: https://www.pc.gov.au/ongoing/report-on-government-services/emergency-management/emergency-services/. Verified the official destination via web retrieval and the rendered source 43 link on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview), including its black text and new-tab target. Citation text, inline marker, chart values and sources 44–51 are unchanged. Review note: the approved PDF prints citation year 2025, whereas the existing digital citation and available RoGS edition say 2026; no citation-year edit was made in this link-only task. Targeted ESLint and git diff --check passed. Items 2–9 remain Pending.

Slide 59, item 2 completed on 12 November 2026. Added an underlined source 44 link to the official AIDR Major Incidents Report 2024–25 PDF: https://www.aidr.org.au/media/11931/aidr_major-incidents-report_2024-25.pdf. Confirmed the PDF through the AIDR Knowledge Hub and verified its title, 2025 publication and 40-incident executive summary against the approved citation. Verified the rendered black source link and new-tab target on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). Citation wording, inline marker, data and all other page elements are unchanged. Targeted ESLint and git diff --check passed. Items 3–9 remain Pending.

Slide 59, item 3 completed on 12 November 2026. Added an underlined source 45 link to the official ABS Labour Force, Australia, Detailed November 2025 release: https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia-detailed/nov-2025. Verified the release lists EQ08, employed persons by occupation unit group (ANZSCO), sex, state and territory. Verified the rendered link, black text and new-tab target on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). Citation wording, inline marker, figures and all other page elements are unchanged. Targeted ESLint and git diff --check passed. Items 4–9 remain Pending.

Slide 59, item 4 completed on 12 November 2026. Added the original-source link for footnote 46 to the official Productivity Commission RoGS emergency-services page: https://www.pc.gov.au/ongoing/report-on-government-services/emergency-management/emergency-services/. Confirmed its Table 9A.5 reference covers state and territory emergency-services personnel and that data-table downloads are available. Verified the rendered source 46 link, black text and new-tab target on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). Citation wording, inline marker, statistics and all other sources/page elements are unchanged. Targeted ESLint and git diff --check passed. Items 5–9 remain Pending.

Slide 59, item 5 completed on 12 November 2026. Added an underlined source 47 link to the official JSA Occupation Shortage List: https://www.jobsandskills.gov.au/data/occupation-shortage/occupation-shortage-list. Confirmed the original 2025 release via JSA’s 15 October 2025 announcement and the official list destination. Verified the rendered link, black text and new-tab target on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). The live JSA page is maintained over time; its interactive data widget reported a loading problem in text-only web retrieval, so interactive filtering was not verified. Citation wording, 2025 reference, statistics and all other page elements are unchanged. Targeted ESLint and git diff --check passed. Items 6–9 remain Pending.

Slide 59, item 6 completed on 12 November 2026. Linked source 48 to the official Productivity Commission emergency-services page providing Table 9A.4: https://www.pc.gov.au/ongoing/report-on-government-services/emergency-management/emergency-services/. Confirmed the table reference covers fire-service personnel and volunteers. Verified the rendered source 48 link, black text and new-tab target on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). Citation text, inline markers, statistics and all other page elements are unchanged. Targeted ESLint and git diff --check passed. Items 7–9 remain Pending.

Slide 59, item 7 completed on 12 November 2026. Added an underlined source 49 link to Volunteering Australia’s official Key volunteering statistics page: https://www.volunteeringaustralia.org/research/key-volunteering-statistics/. Verified the official destination is available and the source link renders with black text and a new-tab target on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). The destination is maintained and has since been updated in 2026; the report’s existing 2025 citation and approved statistics were preserved. All other sources and page elements are unchanged. Targeted ESLint and git diff --check passed. Items 8–9 remain Pending.

Slide 59, item 8 completed on 12 November 2026. Added an underlined source 50 link to https://issuu.com/surflifesavingaustralia/docs/slsa_annual_report_2025, the Annual Report 2024/25 destination explicitly linked by SLSA’s official account at https://linktr.ee/slsaussies. The publisher’s indexed report identifies coverage from 1 July 2024 to 30 June 2025. Verified the local rendered source link, black text, new-tab target and preserved p 118 citation on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). Verification limit: browser site policy blocked viewing Issuu, so page 118 and external viewer operation were not independently checked. Citation text, figures and all other page elements are unchanged. Targeted ESLint and git diff --check passed. Item 9 remains Pending.

Slide 59, item 9 completed on 12 November 2026. Added the publisher-provided SLSA Annual Report 2024/25 link to source 51, matching source 50: https://issuu.com/surflifesavingaustralia/docs/slsa_annual_report_2025. Verified source number 51, preserved p 118 citation, destination, black text and new-tab target on [FES Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_overview). The external Issuu viewer and page 118 were not independently checked because the browser site-policy restriction recorded for item 8 still applies. All citation wording, figures and other page elements are unchanged. Targeted ESLint and git diff --check passed. All nine Slide 59 link implementations are Complete; the slide is omitted from the open-slide summary, with verification limitations retained in these notes.

## Slide 64 — FES jurisdiction map presentation

Reviewed on 11 November 2026 against the Workforce by Jurisdiction selection on [FES Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_profile) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 3 | Add the missing ACT label to the map. | Pending | ACT can be selected using the top control and its data table appears, but the map itself still has no ACT text label. Live SVG text inspection shows labels for the other seven jurisdictions only. | Complete |
| 4 | Increase all map and table text sizes so the content is readable on a big screen. | Pending | Checked at 1920×1080. Map abbreviations use 14px SVG text and full jurisdiction names use 11px text before SVG scaling; they remain visually small. Table text is 14px and the Career/Volunteer headers split across lines even at this large viewport. The requested broad readability improvement is incomplete. | Complete |

Slide 64, item 3 completed on 12 November 2026. Added a visible FES-orange ACT badge and guide line to the jurisdiction map, with mouse and keyboard selection. The shared map gains an opt-in showActLabel property defaulting to false; only the FES Profile page enables it, so Local Government and Police maps retain their existing behaviour. Verified the label visually and clicked it on [FES Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/fes_industry_profile), Workforce by Jurisdiction selection; the ACT table shows unchanged approved figures including Firefighters 438* / 991, Fire support 145* / dash and Operational SES 11 / 438. No typography, datasets or other page elements were changed. Targeted ESLint and git diff --check passed. Item 4 remains Pending.

Slide 64, item 4 completed on 12 November 2026. Enlarged the FES jurisdiction map abbreviations to 24px and full names to 18px in SVG units, expanded badge widths and line spacing, and adjusted the Victoria label to avoid collisions. Increased the workforce table and map-panel text to 16px, widened the table column to 400px and kept Career/Volunteer headers on one line. The shared map uses an opt-in largeLabels property enabled only for FES Profile; other reports retain their defaults. Verified the large-screen layout at 1920 × 1080, checked rendered map text for intersections (none after spacing adjustments), and confirmed narrow-screen table overflow remains contained within its scrollable panel at 390px. All approved figures, source wording, other selections and unrelated page elements remain unchanged. Targeted ESLint and git diff --check passed. Both Slide 64 items are Complete; the slide is omitted from the open-slide summary.

## Slide 68 — FES Workforce Insights graphics, colours and navigation

Reviewed on 11 November 2026 against [FES Workforce Insights](http://localhost:3001/reports/public-safety-wir-2026/fes_workforce_insights) in the new psa-frontend project, with the Executive Summary used for the requested colour comparison.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 3 | Use a swimming ring with a first-aid cross in its middle for the Surf Life Saving First Aid hero graphic. | Pending | The middle hero badge currently shows waves above a circular first-aid cross. It lacks the segmented swimming ring shown in the slide's replacement. | Complete |
| 4 | Use the illustrated radiation/hazardous-materials graphic shown on the slide for the right hero badge. | Pending | The current right badge shows a segmented ring with a hazardous-material container/drop motif. It does not match the radiation trefoil and hazard/drop illustration supplied on the slide. | Complete |

Slide 68, item 3 completed on 12 November 2026. Replaced only the middle Surf Life Saving First Aid hero artwork with the swimming ring and central first-aid cross supplied as vector shapes in Slide 68. Retained the FES colour treatment, existing badge size, connectors, Disaster Recovery and Hazardous Materials artwork, animations and all page content. Verified the replacement loads at 446 × 100 and visually displays the ring and cross on [FES Workforce Insights](http://localhost:3001/reports/public-safety-wir-2026/fes_workforce_insights). Targeted ESLint, SVG XML validation and git diff --check passed. Item 4 remains Pending.

Slide 68, item 4 completed on 12 November 2026. Replaced only the right-hand hero badge artwork with the radiation trefoil and flame illustration extracted from the supplied Slide 68 reference (image138.png). An SVG mask isolates that exact illustration from its white background and retains the FES orange colour. Verified visually on [FES Workforce Insights](http://localhost:3001/reports/public-safety-wir-2026/fes_workforce_insights); the 446 × 100 hero image loads successfully. The Disaster Recovery icon, first-aid swimming ring, badge sizes, connectors, animations and all page content are unchanged. SVG XML validation and git diff --check passed. Both tracked Slide 68 items are now Complete.

## Slide 69 — Disaster Recovery Insight One presentation and content

Reviewed on 11 November 2026 against [Disaster Recovery Insight One](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Remove “Insight One.” from the main Disaster Recovery title, as crossed out on the slide. | Pending | The live heading still reads “1. Disaster Recovery. Insight One.” | Complete |
| 2 | Follow the Defence workforce-insight design, including the indicated separate insight number and callout hierarchy. | Pending | The summary has a person/speech icon but no separate insight number 1. It is embedded in the full pale-peach hero beneath a generic “FES Workforce Insights” badge rather than the numbered callout treatment indicated on the slide. | Complete |
| 3 | Enlarge the insight summary font and wrap the text earlier. | Pending | The summary remains 14px and approximately 812px wide at the tested viewport, spanning most of the hero copy area. The requested larger, narrower treatment is not implemented. | Complete |

Slide 69, item 1 completed on 12 November 2026. Changed only the main heading from “1. Disaster Recovery. Insight One.” to “1. Disaster Recovery”. Verified the exact rendered heading and its layout visually on [Disaster Recovery Insight One](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery). Targeted ESLint and git diff --check passed. Summary text, typography, hero artwork, chart values, sources, navigation and all other page content are unchanged. Items 2–3 remain Pending.

Slide 69, item 2 completed on 12 November 2026. Separated the white Disaster Recovery topic hero from a pale FES insight callout with an orange accent, visible number 1, “Theme One, Insight One” label and existing speech/person icon. Matches the Defence-style topic/callout hierarchy indicated in Slide 69. Verified visually on [Disaster Recovery Insight One](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery), with no callout overflow and the existing 14px statement size preserved. The statement, body content, chart, sources and navigation are unchanged. New styles apply only to this page; shared stylesheet consumers retain their existing layout. Targeted ESLint and git diff --check passed. Item 3 remains Pending.

Slide 69, item 3 completed on 12 November 2026 following the next-item request received during item 2 verification. Increased only the insight statement to 18px with 28px line height and a 680px maximum width, with 16px/24px typography on narrow screens. Kept the label at 14px and the icon aligned to the right on desktop. Verified the live computed 18px text and 680px width and visually checked the earlier wrapping on [Disaster Recovery Insight One](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery). Statement wording, other page content, chart values, sources and navigation remain unchanged. All three tracked Slide 69 items are now Complete; Slide 69 is removed from the open-slide summary.

## Slide 71 — Disaster Recovery Insight Two presentation

Reviewed on 11 November 2026 against [Disaster Recovery Insight Two](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery_2) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Remove “Insight Two.” from the main Disaster Recovery title, as crossed out on the slide. | Pending | The heading still reads “1. Disaster Recovery. Insight Two.” | Complete |
| 2 | Follow the Defence insight design, including a separate insight number 2 and the preferred callout treatment illustrated on the slide. | Pending | The hero summary has a speech/person icon but no separate number 2. It remains embedded in the full peach hero beneath a generic FES Workforce Insights badge, rather than using the indicated numbered insight treatment. | Complete |
| 3 | Increase the font size of the hero insight summary. | Pending | Live inspection confirms the summary remains 14px, approximately 812px wide at the tested desktop viewport. | Complete |

Slide 71, item 1 completed on 12 November 2026. Changed only the main heading from “1. Disaster Recovery. Insight Two.” to “1. Disaster Recovery”. Verified the exact rendered heading and its appearance on [Disaster Recovery Insight Two](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery_2). Summary wording and typography, artwork, body content, sources 57–59 and navigation are unchanged. Targeted ESLint and git diff --check passed. Items 2–3 remain Pending.

Slide 71, item 2 completed on 12 November 2026. Separated the white Disaster Recovery topic hero from a pale FES callout with an orange accent, visible number 2, “Theme One, Insight Two” label and existing speech/person icon, following the completed Insight One / Defence hierarchy. Verified the rendered number, label and layout visually on [Disaster Recovery Insight Two](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery_2). Confirmed no callout overflow and retained the statement's existing 14px size; item 3 remains Pending. Wording, sources 57–59, body content and navigation remain unchanged. Added styling is opt-in to this callout; other pages are unchanged. Targeted ESLint and git diff --check passed.

Slide 71, item 3 completed on 12 November 2026. Increased the Insight Two statement from 14px to 18px with 28px line height, matching Insight One's typography; the shared responsive rule uses 16px/24px on narrow screens. Retained its existing available text width and the 14px insight label. Verified the live computed 18px statement, 28px line height, 14px label and absence of callout overflow, and visually checked readability on [Disaster Recovery Insight Two](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery_2). Wording, artwork, callout structure, sources 57–59, body content and navigation are unchanged. Targeted ESLint and git diff --check passed. All three tracked Slide 71 items are now Complete; Slide 71 is removed from the open-slide summary.

## Slide 72 — Disaster Recovery Insight Three presentation

Reviewed on 11 November 2026 against [Disaster Recovery Insight Three](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery_3) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Remove “Insight Three.” from the main Disaster Recovery title, as crossed out on the slide. | Pending | The heading still reads “1. Disaster Recovery. Insight Three.” | Complete |
| 2 | Follow the Defence insight design, including the indicated separate insight number 3 and callout hierarchy. | Pending | The summary has a speech/person icon but no separate number 3. It remains embedded within the full peach hero beneath a generic FES Workforce Insights badge rather than using the indicated numbered callout treatment. | Complete |
| 3 | Increase the hero insight summary font size. | Pending | The summary remains 14px, approximately 812px wide at the tested desktop viewport. | Complete |

Slide 72, item 1 completed on 12 November 2026. Changed only the main heading from “1. Disaster Recovery. Insight Three.” to “1. Disaster Recovery”. Verified the exact live heading and its layout visually on [Disaster Recovery Insight Three](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery_3). Summary wording and typography, artwork, body content, sources 60–62 and navigation remain unchanged. Targeted ESLint and git diff --check passed. Items 2–3 remain Pending.

Slide 72, item 2 completed on 12 November 2026. Separated the white Disaster Recovery topic hero from a pale FES insight callout with an orange accent, visible number 3, “Theme One, Insight Three” label and existing speech/person icon, following the completed Disaster Recovery / Defence hierarchy. Verified the rendered number, label and separate callout visually on [Disaster Recovery Insight Three](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery_3). Confirmed no callout overflow and preserved the statement's 14px size; item 3 remains Pending. Statement wording, body content, sources 60–62, navigation and other pages remain unchanged. Targeted ESLint and git diff --check passed.

Slide 72, item 3 completed on 12 November 2026. Increased the Insight Three summary from 14px to 18px with 28px line height, using the existing Disaster Recovery summary style (16px/24px on narrow screens). Retained the available text width and 14px insight label. Verified the live computed 18px summary, 28px line height, 14px label and absence of callout overflow, and visually checked readability on [Disaster Recovery Insight Three](http://localhost:3001/reports/public-safety-wir-2026/fes_disaster_recovery_3). Wording, callout structure, artwork, sources 60–62, body content and navigation are unchanged. Targeted ESLint and git diff --check passed. All three tracked Slide 72 items are now Complete; Slide 72 is removed from the open-slide summary.

## Slide 73 — Surf Life Saving First Aid presentation

Reviewed on 11 November 2026 against [Surf Life Saving First Aid](http://localhost:3001/reports/public-safety-wir-2026/fes_surf_life_saving_first_aid) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Remove the “Insight Four.” suffix crossed out in the main title. | Pending | “Four” is no longer present, but the live title still ends with the redundant “. Insight”: “2. Surf Life Saving First Aid. Insight”. The crossed-out suffix has not been removed completely. | Complete |
| 2 | Follow the Defence insight design for the hero and insight callout. | Pending | The summary remains embedded in the full peach hero under a generic FES Workforce Insights badge, using a speech/person icon without the separate numbered insight treatment requested across these pages. | Complete |
| 3 | Enlarge the hero insight summary font. | Pending | The summary remains 14px at the tested desktop viewport. | Complete |
| 4 | Use the swimming-ring illustration with a first-aid cross in its centre, shown on the slide. | Pending | The hero instead shows waves above a circular first-aid cross. The segmented swimming ring in the requested illustration is absent. | Complete |

Slide 73, item 1 completed on 12 November 2026. Removed only the residual “. Insight” suffix from the main heading, which now reads “2. Surf Life Saving First Aid”. Verified the exact live heading and its appearance on [Surf Life Saving First Aid](http://localhost:3001/reports/public-safety-wir-2026/fes_surf_life_saving_first_aid). Summary, typography, hero artwork, approved chart values, comparison table, Sources 63–64, Replay/Open Large controls and navigation remain unchanged. Targeted ESLint and git diff --check passed. Items 2–4 remain Pending.

Slide 73, item 2 completed on 12 November 2026. Separated the white Surf Life Saving First Aid topic hero from a pale FES insight callout with an orange accent, number 1, “Theme Two, Insight One” label and existing speech/person icon. The numbering follows Slide 73's explicit “Theme 2, Insight 1” annotation. Reused the completed Defence/Disaster Recovery hierarchy without changing shared styles. Verified the rendered number, label and separate layout visually on [Surf Life Saving First Aid](http://localhost:3001/reports/public-safety-wir-2026/fes_surf_life_saving_first_aid), confirming the statement remains 14px and the callout has no horizontal overflow. Statement wording, hero illustration, chart values, comparison table, sources 63–64, controls and navigation remain unchanged. Targeted ESLint and git diff --check passed. Items 3–4 remain Pending.

Slide 73, item 3 completed on 12 November 2026. Increased only the insight summary from 14px to 18px with 28px line height by using the existing summary typography (16px/24px on narrow screens). Retained the available width and the 14px insight label. Verified the live computed 18px summary, 28px line height, 14px label and absence of callout overflow, and visually checked readability on [Surf Life Saving First Aid](http://localhost:3001/reports/public-safety-wir-2026/fes_surf_life_saving_first_aid). Wording, artwork, chart values, comparison table, Sources 63–64, controls and navigation remain unchanged. Targeted ESLint and git diff --check passed. Item 4 remains Pending.

Slide 73, item 4 completed on 12 November 2026. Replaced only the waves/first-aid hero image with a swimming ring and central first-aid cross, using the supplied PPT vector shapes already used for the completed FES Workforce Insights ring. Retained the FES orange, white circular background, 180 × 180 image dimensions and existing loading/hover animation classes. Verified the SVG loads successfully at 180 × 180 and visually checked the ring and cross on [Surf Life Saving First Aid](http://localhost:3001/reports/public-safety-wir-2026/fes_surf_life_saving_first_aid). Text, chart values, table, Sources 63–64, controls and navigation are unchanged. SVG XML validation, targeted ESLint and git diff --check passed. All four tracked Slide 73 items are Complete; Slide 73 is removed from the open-slide summary.

## Slide 74 — Hazardous Materials content and presentation

Reviewed on 11 November 2026 against [Hazardous Materials](http://localhost:3001/reports/public-safety-wir-2026/fes_hazardous_materials) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Remove the “Insight Five.” title suffix crossed out on the slide. | Pending | “Five” has been removed, but the heading still ends “. Insight”: “3. Hazardous Materials. Insight”. The suffix removal is incomplete. | Complete |
| 2 | Make the top insight use the design treatment of the lower Industry Insight box, as indicated on the slide. | Pending | The top summary remains an unlabelled paragraph beside a speech/person icon within the full peach hero. It does not reproduce the lower box's distinct Industry Insight heading and accented callout treatment. | Complete |
| 3 | Use the radiation/hazard illustration supplied in the highlighted hero replacement. | Pending | The current graphic has a segmented ring with a container/drop motif, rather than the supplied radiation trefoil and hazard/drop illustration. | Complete |

Slide 74, item 1 completed on 12 November 2026. Removed only the remaining “. Insight” suffix from the main heading, which now reads “3. Hazardous Materials”. Verified the exact live heading and its appearance on [Hazardous Materials](http://localhost:3001/reports/public-safety-wir-2026/fes_hazardous_materials). Summary, typography, hero illustration, training cards, graph values, source text and navigation are unchanged. Targeted ESLint and git diff --check passed. Items 2–3 remain Pending.

Slide 74, item 2 completed on 12 November 2026. Applied the lower Industry Insight box's existing design to the top summary: speech/person icon and 20px “Industry Insight” heading above the statement, pale FES background, 12px orange left accent, matching padding and rounded corners. Reused the same CSS classes without changing shared styles. Verified both callouts have identical computed backgrounds, left borders and heading sizes with no horizontal overflow, and visually checked the top callout on [Hazardous Materials](http://localhost:3001/reports/public-safety-wir-2026/fes_hazardous_materials). Both statements, hero illustration, training cards, graph values, source text and navigation remain unchanged. Targeted ESLint and git diff --check passed. Item 3 remains Pending.

Slide 74, item 3 completed on 12 November 2026. Replaced only the hero image with the radiation trefoil and flame illustration supplied as image138.png in Slide 74, reusing the exact reference artwork isolated for the completed FES Workforce Insights badge. Retained the FES orange, white circular background, 180 × 180 dimensions and existing loading/hover classes. Restarted the stopped local frontend server and verified the SVG loads at 180 × 180 and visually matches the supplied illustration on [Hazardous Materials](http://localhost:3001/reports/public-safety-wir-2026/fes_hazardous_materials). Text, callouts, training cards, graph values, source text and navigation remain unchanged. SVG XML validation, targeted ESLint and git diff --check passed. All three tracked Slide 74 items are Complete; Slide 74 is removed from the open-slide summary.

## Slide 76 — FES 2025 Strategy Updates design and scrolling

Reviewed on 11 November 2026 against [FES 2025 Strategy Updates](http://localhost:3001/reports/public-safety-wir-2026/fes_update_2025_strategies) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Use the “FES Existing Strategies” eyebrow label marked above the current badge on the slide. | Pending | The hero badge still reads “FES · INDUSTRY-SECTOR ANALYSIS”. The requested wording is absent. | Complete |
| 3 | Delete the introductory paragraph crossed out below the main title. | Pending | The paragraph beginning “Public Skills Australia identified workforce strategies for the Fire and Emergency Services industry-sector…” remains beneath the title. | Complete |

Slide 76, item 1 completed on 12 November 2026. Changed only the hero eyebrow from “FES · Industry-Sector Analysis” to “FES Existing Strategies”, retaining the existing uppercase visual styling. Verified the label visually on [FES 2025 Strategy Updates](http://localhost:3001/reports/public-safety-wir-2026/fes_update_2025_strategies). Title, introductory paragraph, artwork, all five projects, controls and navigation are unchanged. Targeted ESLint and git diff --check passed. Item 3 remains Pending.

Slide 76, item 3 completed on 12 November 2026. Removed only the introductory paragraph beginning “Public Skills Australia identified workforce strategies for the Fire and Emergency Services industry-sector…” beneath the main title. Verified the paragraph is absent from the live page (zero exact-text matches) and visually checked the title area on [FES 2025 Strategy Updates](http://localhost:3001/reports/public-safety-wir-2026/fes_update_2025_strategies). Eyebrow, title, artwork, project content, controls, styles and navigation remain unchanged. Targeted ESLint and git diff --check passed. Both tracked Slide 76 items are Complete; Slide 76 is removed from the open-slide summary.

## Slide 78 — Remove unapproved FES Government Initiatives page

Reviewed on 11 November 2026 against the FES menu and [the obsolete FES Government Initiatives URL](http://localhost:3001/reports/public-safety-wir-2026/fes_federal_initiatives) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Delete the FES Federal Government Initiatives page because it is not part of the report's approved page list. | Pending | Direct navigation to /fes_federal_initiatives still renders “FES Federal Government Initiatives” with “Blank page structure ready for Figma implementation.” The page key also remains in the current Public Safety page inventory. The obsolete page is still reachable even though the main menu no longer lists it. | Complete |

Slide 78, item 1 completed on 12 November 2026. Removed the unapproved FES Federal Government Initiatives entry from the Public Safety inventory. Added a report-specific not-found route for the obsolete URL so the general reader fallback cannot recreate a placeholder there. Verified [the obsolete URL](http://localhost:3001/reports/public-safety-wir-2026/fes_federal_initiatives) displays “404: This page could not be found.” on localhost:3001. Confirmed the approved [FES chapter](http://localhost:3001/reports/public-safety-wir-2026/fes) still loads and its FES menu contains only the approved destinations, with no Government Initiatives item. Other report routes, content and shared registry behaviour are unchanged. Targeted ESLint and git diff --check passed. The tracked Slide 78 item is Complete; Slide 78 is removed from the open-slide summary.

## Slide 80 — Police introduction title and vehicle graphic

Reviewed on 11 November 2026 against [Police](http://localhost:3001/reports/public-safety-wir-2026/police) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Replace the dated police-car illustration with a more modern police vehicle, and use the replacement throughout the Police section. | Pending | The landing page still loads /images/police-chapter-vehicle.svg and displays the same angular, older-style side-view sedan shown in the feedback. It does not resemble the modern vehicle reference supplied on the slide. The section-wide replacement is therefore incomplete. | Complete |

Slide 80, item 2 completed on 12 November 2026. Replaced the dated vehicle asset with the exact modern three-quarter-view police vehicle supplied in Slide 80 (image11.jpeg), isolating the illustration in an SVG mask and applying Police blue #0D71A3. Kept the existing asset URL and 136 × 136 viewBox, so the replacement is used consistently without editing any page markup. Verified the modern vehicle visually on [Police](http://localhost:3001/reports/public-safety-wir-2026/police) and confirmed the image loads on Police Industry Overview, Industry Profile, Proposed Workforce Strategies, 2025 Strategy Updates and the Introduction Police card. Source search confirmed these six consumers are all in Public Safety; other reports do not use the asset. Text, statistics, layouts and controls are unchanged. SVG XML validation and git diff --check passed. Slide 80 is Complete and removed from the open-slide summary. The separately tracked Slide 81 row is retained for its own verification pass.

## Slide 81 — Police Overview wording and vehicle graphic

Reviewed on 11 November 2026 against [Police Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/police_industry_overview) in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Use a more modern police vehicle illustration here and throughout the Police section. | Pending | The Overview hero still uses /images/police-chapter-vehicle.svg, displaying the dated angular side-view sedan shown in the feedback rather than the supplied modern vehicle reference. | Complete |

Slide 81, item 2 completed on 12 November 2026. This request was implemented by Slide 80's shared vehicle replacement; no additional code or page changes were required. Independently verified the modern three-quarter-view police vehicle is visible in the [Police Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/police_industry_overview) hero on localhost:3001 and confirmed its image loads at the unchanged 136 × 136 dimensions. The shared asset uses the supplied feedback illustration in Police blue and is also used throughout the Police section, as verified in Slide 80. Text, statistics, charts, sources, controls, layout and navigation are unchanged. Slide 81 is Complete and removed from the open-slide summary.

## Slide 84 — Police jurisdiction chart lines, points, axes and COVID markers

Reviewed on 11 November 2026 against all eight selections on [Police Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/police_industry_overview), Slide 84 and approved report pages 93–97 in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Match the lines in all eight charts to the report. | Pending | Each selection now has a six-point trajectory rather than the old straight two-endpoint line. However, the live charts use dotted dark-blue lines with filled markers, while the report shows continuous pale-blue lines with hollow markers. Printed endpoints match for ACT (716–863), NSW (17,348–15,698), NT (1,222–1,404), QLD (12,022–12,562), SA (4,664–4,529), TAS (1,287–1,418), VIC (16,032–16,021) and WA (6,460–7,105). Full intermediate-value accuracy is not certified: the PDF does not print every annual value, so the underlying approved dataset is needed for exact reconciliation. | Complete |

Slide 84, item 1 completed on 12 November 2026. Matched the jurisdiction series styling to the approved report: continuous #A8D8EA lines and white-filled markers outlined in the same pale blue. Confirmed the colour against the approved report page 94 image. Only jurisdiction polyline/marker CSS changed; all datasets, value labels, axes, COVID guides, National Workforce chart and controls are unchanged. Verified all eight selections on [Police Industry-Sector Overview](http://localhost:3001/reports/public-safety-wir-2026/police_industry_overview): each has a continuous rgb(168,216,234) line, six hollow markers and the existing six annual values. Visually checked the completed chart and Replay animation. git diff --check passed. This completes the requested line/marker presentation fix; it does not certify unprinted intermediate counts, and the original underlying-dataset limitation remains as recorded above. Slide 84 is Complete and removed from the open-slide summary.

## Slide 87 — Police workforce map presentation

Reviewed on 11 November 2026 against the third selection on [Police Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/police_industry_profile) and Slide 87 in the new psa-frontend project. Readability was also checked at a 1920 × 1080 viewport; the temporary viewport override was reset afterwards.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Increase the map and workforce-table font sizes so they are readable on a big screen. | Pending | At 1920 × 1080, the table row text remains 12px. Map state abbreviations use 14px SVG text and full state names use 11px SVG text, scaled with the map. The labels and table details still appear small relative to the presentation area; the requested large-screen readability improvement is not complete. | Complete |
| 3 | Add the ACT label to the map. | Pending | The map itself labels NSW, VIC, QLD, SA, WA, TAS and NT, but no ACT text label is rendered. An ACT selection button exists above the map; that does not satisfy the request to label ACT on the map. | Complete |
| 4 | Delete the legend below the map, marked by the red “delete” callout. | Pending | The live presentation still displays “LEGEND:” followed by the four workforce categories beneath the map. The callout is interpreted as referring to this legend area immediately above the source caption. | Complete |

Slide 87, item 2 completed on 12 November 2026. Enabled the map's existing opt-in large full-name labels (18px instead of 11px) and increased workforce table headings, row labels and values from 12px to 16px, with 24px row-label line height. State abbreviation badges remain 14px, respecting the user's prior instruction. Verified computed label/table sizes and readability at 1920 × 1080 on [Police Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/police_industry_profile), third selection. Verified the table has no horizontal overflow at desktop or 390px width and reset the temporary viewport. All figures, map colours, controls, other charts and pages are unchanged. ACT labelling and legend removal remain Pending as items 3–4. Targeted ESLint and git diff --check passed.

Slide 87, item 3 completed on 12 November 2026. Enabled the existing ACT badge/leader on the Police map and applied Police blue #0D71A3 only when the shared map uses its Police variant; FES retains its existing orange badge. Badge text remains 14px. Verified the visible ACT map label on [Police Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/police_industry_profile), third selection. Clicking the map badge selects ACT and shows the unchanged workforce figures 813, 50, 205 and 153; confirmed the selected state, computed badge colour and text size. No other map labels, data, styles, content or controls were changed. Targeted ESLint and git diff --check passed. Item 4 remains Pending.

Slide 87, item 4 completed on 12 November 2026. Removed only the Legend heading and four workforce-category bullets beneath the map. Verified zero “Legend:” matches in the live third selection on [Police Industry Profile](http://localhost:3001/reports/public-safety-wir-2026/police_industry_profile), and visually confirmed the map is followed by the unchanged Productivity Commission source caption and Prev/Next/Replay controls. Replay still animates the map and table. Workforce figures, labels, chart selections and all other content are unchanged. Targeted ESLint and git diff --check passed. All three tracked Slide 87 items are Complete; Slide 87 is removed from the open-slide summary.

## Slide 88 — Police Workforce Insights cards, labels and hero artwork

Reviewed on 11 November 2026 against [Police Workforce Insights](http://localhost:3001/reports/public-safety-wir-2026/police_workforce_insights), the Police insight tiles on [Executive Summary](http://localhost:3001/reports/public-safety-wir-2026/executive_summary), and Slide 88 in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Make the hero icons match the referenced video. | Pending | The live hero displays a fingerprint/search monitor and a person pushing a shield, on pale-blue circular backgrounds. This differs from the old rectangular, patterned artwork shown on the slide. However, the annotation specifies a video and the slide itself does not supply the target video appearance; an exact match cannot be signed off from this evidence. Pending verification against the referenced video, rather than a confirmed missing artwork update. | Pending |
| 3 | Remove the redundant “Industry Insights” label below Digital Forensics, crossed out on the slide. | Pending | The live Digital Forensics theme still displays “INDUSTRY INSIGHTS” between its title and its two insight cards. | Complete |
| 4 | Remove the redundant “Industry Insights” label below Rural, Regional and Remote Police Leadership, crossed out on the slide. | Pending | The live leadership theme still displays “INDUSTRY INSIGHTS” between its title and its insight card. | Complete |

Slide 88, item 2 rechecked on 12 November 2026 — Pending: awaiting the referenced video. Verified [Police Workforce Insights](http://localhost:3001/reports/public-safety-wir-2026/police_workforce_insights) loads its existing fingerprint/monitor and leadership/shield hero icons successfully. Slide 88 says “Make these to match the video”, but its relationships contain only images and the report-page hyperlink; the PPTX contains no embedded video. No video file was found in the supplied PSA Latest Feedback folder or this project's public assets. Requested the video's file path or link from the user. No page/code changes made and no exact-match completion claimed. Summary and totals remain 74 Complete / 23 Pending; Slide 88 remains 0 / 3 complete.

Slide 88, item 3 completed on 12 November 2026. Continued to the next actionable item while item 2 awaits the referenced video. Removed only the redundant “Industry Insights” label from the Digital Forensics theme. Verified its absence, both retained Digital Forensics cards and the unchanged leadership label/card on [Police Workforce Insights](http://localhost:3001/reports/public-safety-wir-2026/police_workforce_insights), including a visual check. Hero icons, text, links, styling and other page content are unchanged. Targeted ESLint and git diff --check passed. Items 2 and 4 remain Pending.

Slide 88, item 4 completed on 12 November 2026. Removed only the remaining “Industry Insights” label beneath Rural, Regional and Remote Police Leadership. Verified the label is absent, the leadership insight card remains, and both Digital Forensics cards are unchanged on [Police Workforce Insights](http://localhost:3001/reports/public-safety-wir-2026/police_workforce_insights), including a visual check. Hero icons, wording, links, styles and navigation remain unchanged. Targeted ESLint and git diff --check passed. Item 2 remains Pending awaiting the referenced video; Slide 88 is 2 / 3 Complete.

## Slide 89 — Police Digital Forensics, Insight One layout

Reviewed on 11 November 2026 against [Police Digital Forensics — Insight One](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics) and Slide 89 in the new psa-frontend project. The desktop layout was checked at 1920 × 1080; the temporary viewport override was reset afterwards.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Follow the Defence workforce-insight design shown in the slide's reference inset. | Pending | The live page combines the insight label, large statement and hero icon in one pale-blue banner. It does not reproduce the inset's separate topic heading/hero followed by an insight callout. A distinct “Digital Forensics” topic heading above that callout is absent. | Complete |
| 3 | Add a graphic beside “Demand for digital forensics”. | Pending | The demand section contains its heading and two text paragraphs only. No graphic is rendered within that section. The hero illustration does not fulfil this separate callout. | Complete |
| 5 | Put each of the three digital-forensic skill domains in its own box. | Pending | Foundation skills, Core Digital Forensic Examiner Skills and Specialist Digital Forensics Roles remain three ordinary bullet-list items inside one shared panel. Each item has no border or separate background; the requested three individual boxes are absent. | Complete |
| 6 | Add a graphic beside “Skills shortages and entry pathways”. | Pending | This section contains its heading and two text paragraphs, with no graphic rendered within the section. | Complete |

Slide 89, item 1 completed on 12 November 2026. Added a separate Digital Forensics topic hero followed by the numbered Theme One, Insight One callout, following the Defence hierarchy in the slide reference. Preserved the exact insight statement, existing artwork, supporting content and references 69–79. Verified the rendered heading and separate callout visually on [Digital Forensics — Insight One](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics), with no horizontal overflow at desktop or 390px width. The temporary viewport override was reset. Targeted ESLint and git diff --check passed. No other page sections were changed.

Slide 89, item 3 completed on 12 November 2026. Added a Police-blue digital-evidence search graphic beside the Demand for digital forensics heading, using a decorative vector icon on a pale-blue circle. Verified it visually on [Digital Forensics — Insight One](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics), with no horizontal overflow. Confirmed both demand paragraphs and inline footnotes 69–73 remain present. Supporting content, hero, other panels, sources and navigation were not changed. Targeted ESLint and git diff --check passed. Slide 89 is now 2 / 4 Complete; items 5 and 6 remain Pending.

Slide 89, item 5 completed on 12 November 2026. Gave Foundation skills across policing, Core Digital Forensic Examiner Skills and Specialist Digital Forensics Roles separate pale-blue boxes with borders, rounded corners and spacing, within the existing domains panel. Preserved every domain statement and inline footnotes 74–76. Verified all three rendered boxes visually and checked their backgrounds, borders and footnotes on [Digital Forensics — Insight One](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics); no horizontal page overflow. All other panels, sources, graphics and navigation remain unchanged. Targeted ESLint and git diff --check passed. Slide 89 is now 3 / 4 Complete; item 6 remains Pending.

Slide 89, item 6 completed on 12 November 2026. Added a decorative Police-blue pathway graphic beside Skills shortages and entry pathways, matching the demand graphic’s size and pale-blue circular treatment. Verified it visually on [Digital Forensics — Insight One](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics) and confirmed the rendered colour #0D71A3, both retained paragraphs and inline footnotes 77–79. The 14.2 per cent and 6.6 per cent figures, text, sources, other graphics, panels and navigation remain unchanged. No horizontal page overflow. Targeted ESLint and git diff --check passed. All four tracked Slide 89 items are Complete; Slide 89 is removed from the open-slide summary.

## Slide 90 — Police Digital Forensics, Insight Two layout

Reviewed on 11 November 2026 against [Police Digital Forensics — Insight Two](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics_2) and Slide 90 in the new psa-frontend project. Large-screen readability was checked at 1920 × 1080; the temporary viewport override was reset afterwards.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Follow the Defence workforce-insight design shown in the reference inset. | Pending | The live hero combines the insight label, statement and monitor icon inside one pale-blue banner. It does not reproduce the inset's separate topic heading/hero followed by an insight callout. The slide's proposed “1. Digital Forensics” topic heading and “Theme One, Insight Two” treatment are not reproduced; the live label instead reads “Digital Forensics · Insight Two”. The insight number itself is correctly 2. | Complete |
| 2 | Add a graphic alongside “The POL Police Training Package” narrative. | Pending | The narrative contains three paragraphs with no graphic alongside them. The monitor in the hero and speech icon in the repeated callout do not satisfy this separate content-graphic request. | Complete |
| 4 | Delete the lower Industry Insight callout because it repeats the statement at the top. | Pending | The lower pale-blue “Industry Insight” box remains visible and repeats the same VET-system/Police Training Package statement already presented in the top banner. | Complete |

Slide 90, item 1 completed on 12 November 2026. Added a separate Digital Forensics topic hero with the existing monitor artwork, followed by the numbered Theme One, Insight Two callout, matching the Defence hierarchy and Insight One layout. The topic heading is 1. Digital Forensics and the insight number remains 2. Preserved the exact insight statement, training narrative, inline footnotes and sources 80–82, lower callout and navigation. Verified the separate hero and callout visually on [Digital Forensics — Insight Two](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics_2), with one H1 and no horizontal overflow. Reused existing opt-in styles without changing shared CSS or any other page. Targeted ESLint and git diff --check passed. Slide 90 is now 1 / 3 Complete; items 2 and 4 remain Pending.

Slide 90, item 2 completed on 12 November 2026. Added a decorative Police-blue training-book graphic alongside The POL Police Training Package narrative, on a pale-blue circle. The graphic sits beside the copy on desktop and stacks at narrow widths. Verified its placement visually on [Digital Forensics — Insight Two](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics_2), confirmed colour #0D71A3, all three retained paragraphs and inline footnotes 80–82, and no horizontal page overflow. Hero, callouts, approved text, references and navigation are unchanged. New CSS classes apply only to this narrative wrapper. Targeted ESLint and git diff --check passed. Slide 90 is now 2 / 3 Complete; item 4 remains Pending.

Slide 90, item 4 completed on 12 November 2026. Removed only the lower repeated Industry Insight callout. Verified on [Digital Forensics — Insight Two](http://localhost:3001/reports/public-safety-wir-2026/police_digital_forensics_2) that the statement appears once in the retained top callout and the lower Industry Insight heading is absent. Visually confirmed the unchanged training narrative and graphic now lead directly to Sources; inline footnotes 80–82 and all three references remain. Hero, wording, navigation, styles and other page content were not changed. Targeted ESLint and git diff --check passed. All three tracked Slide 90 items are Complete; Slide 90 is removed from the open-slide summary.

## Slide 91 — Police Rural, Regional and Remote Leadership layout

Reviewed on 11 November 2026 against [Police Rural, Regional and Remote Leadership](http://localhost:3001/reports/public-safety-wir-2026/police_regional_remote_leadership) and Slide 91 in the new psa-frontend project. Large-screen readability was checked at 1920 × 1080; the temporary viewport override was reset afterwards.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Follow the Defence workforce-insight design shown in the reference inset. | Pending | The live page combines the topic/insight label and statement in one pale-blue banner. It does not reproduce the reference's separate topic heading/hero followed by an insight callout. The distinct “2. Rural, Regional and Remote Police Leadership” heading shown in the slide markup is not presented above the callout. | Complete |
| 2 | Add a graphic beside the workforce-shortages section. | Pending | “Workforce shortages in regional, rural and remote communities” contains text only, without the requested section graphic. Live inspection found no image, SVG or canvas within this section. | Complete |
| 5 | Add a graphic beside the earlier-leadership section. | Pending | The earlier-leadership section contains two paragraphs but no graphic. The requested section illustration is absent. | Complete |

Slide 91, item 1 completed on 12 November 2026. Added the separate topic hero headed 2. Rural, Regional and Remote Police Leadership with the existing leadership illustration, followed by the numbered Theme Two, Insight Three callout. Preserved the exact insight statement, number 3, supporting paragraphs, inline footnotes 83–86, existing sources and navigation. Verified the separate hero/callout visually on [Police Rural, Regional and Remote Leadership](http://localhost:3001/reports/public-safety-wir-2026/police_regional_remote_leadership), with no horizontal overflow. Reused existing opt-in CSS without changing shared styles or other page sections. Targeted ESLint and git diff --check passed. Slide 91 is now 1 / 3 Complete; items 2 and 5 remain Pending.

Slide 91, item 2 completed on 12 November 2026. Added a decorative workforce icon beside the Workforce shortages in regional, rural and remote communities heading, using Police blue #0D71A3 on a pale-blue circle. Reused the existing heading/graphic styles without changing shared CSS. Verified the graphic visually on [Police Rural, Regional and Remote Leadership](http://localhost:3001/reports/public-safety-wir-2026/police_regional_remote_leadership), confirmed both paragraphs and footnotes 83–86 remain, and checked there is no horizontal page overflow. Earlier leadership, hero, insight, sources and navigation are unchanged. Targeted ESLint and git diff --check passed. Slide 91 is now 2 / 3 Complete; item 5 remains Pending.

Slide 91, item 5 completed on 12 November 2026. Added a decorative leadership-development graphic beside Earlier leadership responsibilities, using Police blue #0D71A3 on a pale-blue circle matching the workforce graphic. Reused existing styles without changing shared CSS. Verified the graphic visually on [Police Rural, Regional and Remote Leadership](http://localhost:3001/reports/public-safety-wir-2026/police_regional_remote_leadership), confirmed both original paragraphs remain, and checked there is no horizontal page overflow. Workforce-shortages content, hero, insight, sources and navigation remain unchanged. Targeted ESLint and git diff --check passed. All three tracked Slide 91 items are Complete; Slide 91 is removed from the open-slide summary.

## Slide 92 — Police Proposed Strategy 2026

Reviewed on 11 November 2026 against [Police Proposed Strategy 2026](http://localhost:3001/reports/public-safety-wir-2026/police_workforce_strategies) and Slide 92 in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Use the certificate/qualification illustration shown over the hero artwork in the slide's visual markup. | Pending | The slide shows a blue certificate illustration beside the digital-forensics monitor. The live hero instead contains only the police vehicle icon, using /images/police-chapter-vehicle.svg; the certificate illustration is absent. This item records the visual artwork markup, which has no accompanying written instruction. | Complete |

Slide 92, item 2 completed on 12 November 2026. Extracted the exact blue diploma/certificate SVG (image188.svg) used in Slide 92 and displayed it beside the existing digital-forensics monitor in the Proposed Strategy hero, replacing the vehicle illustration. Preserved the supplied certificate colour #215F9A. Added page-specific artwork sizing only; other reports and shared styles are unchanged. Verified both images load and appear side by side on [Police Proposed Strategy 2026](http://localhost:3001/reports/public-safety-wir-2026/police_workforce_strategies), with no horizontal page overflow. All strategy wording, stakeholders and navigation remain unchanged. Targeted ESLint and git diff --check passed. The single tracked Slide 92 item is Complete; Slide 92 is removed from the open-slide summary.

## Slide 93 — Police 2025 Strategy Updates scrolling, artwork, navigation and headings

Reviewed on 12 November 2026 against all three selections on [Police 2025 Strategy Updates](http://localhost:3001/reports/public-safety-wir-2026/police_update_2025_strategies) and Slide 93 in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Use the Local Government WIR hero illustration, recoloured for Police. | Pending | The live hero contains only the police vehicle asset, /images/police-chapter-vehicle.svg. It does not show the multi-icon illustration indicated by the slide's “Use From the LG WIR. Make POL colours” arrow. | Complete |

Slide 93, item 2 completed on 12 November 2026. Replaced the Police vehicle hero with the six-icon wave illustration shown in Slide 93’s Local Government reference: globe, target, document, strategy board, briefcase and document/gear. Used the matching existing vector from this frontend repository and created a Police-specific copy, changing its sole colour from #D3992C to #0D71A3 while preserving the geometry and pale circular backgrounds. Original assets and other reports are unchanged. Verified the artwork visually on [Police 2025 Strategy Updates](http://localhost:3001/reports/public-safety-wir-2026/police_update_2025_strategies), confirmed it loads across all three selections and checked no horizontal page overflow. Strategy text, controls, headings, navigation and project data are unchanged. Targeted ESLint and git diff --check passed. The single tracked Slide 93 item is Complete; Slide 93 is removed from the open-slide summary.

## Slide 94 — Police Strategy Updates connection-section heading

Reviewed on 12 November 2026 against all three selections on [Police 2025 Strategy Updates](http://localhost:3001/reports/public-safety-wir-2026/police_update_2025_strategies) and Slide 94 in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Replace the green section heading with “Connection to 2026 Strategies”, consistently across the strategies. | Pending | All three Police project selections still use “How this informs Public Skills Australia’s work”. No heading with the requested exact wording “Connection to 2026 Strategies” is present in any selection. The existing first-project subheading “2026 Police Strategies Connection” is a different, nested item and does not replace this section heading. | Complete |

Slide 94, item 1 completed on 12 November 2026. Renamed only the shared project section heading from How this informs Public Skills Australia’s work to Connection to 2026 Strategies. Verified the exact heading appears once in each of all three Police project selections on [Police 2025 Strategy Updates](http://localhost:3001/reports/public-safety-wir-2026/police_update_2025_strategies), including a visual check of the third selection. Existing black heading styling, nested connection labels, text, artwork, project data, controls and navigation are unchanged. Targeted ESLint and git diff --check passed. The single tracked Slide 94 item is Complete; Slide 94 is removed from the open-slide summary.

## Slide 96 — Cross-Sector Proposed Strategies Summary

Reviewed on 12 November 2026 against [Public Safety Strategies Summary](http://localhost:3001/reports/public-safety-wir-2026/police_proposed_strategies_summary) and Slide 96 in the new psa-frontend project. Paragraph wrapping was checked at 1920 × 1080; the temporary viewport override was reset afterwards.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 1 | Wrap the hero introduction earlier to balance its three lines. | Pending | The introduction is constrained to 680px, but at the tested desktop size it measures 96px high with a 24px line height: four lines. The last line is visibly shorter, ending “progressed in the preceding pages.” The requested balanced three-line treatment is not yet reproduced. | Complete |
| 3 | Match the hero icon group highlighted by the red rectangle (visual markup). | Pending | The live hero uses /images/reports/public-safety/cross-sector-group-92.svg: tank, ship, aircraft, police vehicle and fire appliance, all in green on pale-green circles. The boxed slide artwork shows sector-specific colours, including gold Defence and orange FES icons. The icon subjects are present, but the highlighted artwork treatment does not match. This records the visual markup; it has no separate written instruction. | Complete |

Slide 96, item 1 completed on 12 November 2026. Changed only the hero introduction’s maximum width from 680px to 800px and enabled balanced text wrapping. Verified visually on [Public Safety Strategies Summary](http://localhost:3001/reports/public-safety-wir-2026/police_proposed_strategies_summary) at 1920 × 1080: the paragraph measures 72px high at 24px line height, confirming three lines, with text-wrap: balance and no horizontal page overflow. Reset the temporary viewport override. Wording, title, artwork, cards and navigation remain unchanged. git diff --check passed. Targeted ESLint reports two existing react/jsx-key errors at lines 115 and 118; confirmed the same errors against the pre-change content and left them untouched. Slide 96 is now 1 / 2 Complete; item 3 remains Pending.

Slide 96, item 3 completed on 12 November 2026. Added a summary-specific SVG matching the Slide 96 artwork arrangement: gold tank, ship and aircraft across the top with a dotted gold connector; grey Police vehicle and orange FES appliance below. Reused the existing icon paths, applying gold #D3992C, orange #D3421C and grey #777777 with sector-tinted circles as shown in the slide reference. The shared green artwork is unchanged. Verified the new asset loads and its arrangement/colours visually on [Public Safety Strategies Summary](http://localhost:3001/reports/public-safety-wir-2026/police_proposed_strategies_summary), with no horizontal page overflow. Text, paragraph wrapping, strategy cards, data and navigation remain unchanged. git diff --check passed; ESLint still reports only the two previously recorded missing-key errors at lines 115 and 118, left untouched. Both tracked Slide 96 items are Complete; Slide 96 is removed from the open-slide summary.

## Slide 97 — Cross-Sector Strategy controls and chapter-button labels

Reviewed on 12 November 2026 against the lower cards and chapter links on [Public Safety Strategies Summary](http://localhost:3001/reports/public-safety-wir-2026/police_proposed_strategies_summary) and Slide 97 in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 4 | Capitalise “Chapter” in the Defence chapter link, as marked in red. | Pending | The visible label remains “Open in the Defence chapter”, with a lowercase “chapter”. The requested “Chapter” capitalisation has not been applied. Its link targets /reports/public-safety-wir-2026/defence_workforce_strategies. | Complete |
| 5 | Rename the FES chapter link to “Open in the Fire and Emergency Services Chapter”. | Pending | The visible label remains “Fire and Emergency Services”, without the requested opening words and “Chapter” suffix. Its link targets /reports/public-safety-wir-2026/fes_workforce_strategies. | Complete |

Slide 97, item 4 completed on 12 November 2026. Changed only the Defence link label to Open in the Defence Chapter. Verified its visible capitalisation on [Public Safety Strategies Summary](http://localhost:3001/reports/public-safety-wir-2026/police_proposed_strategies_summary) and confirmed the destination remains /reports/public-safety-wir-2026/defence_workforce_strategies. Other chapter labels, content, artwork and layout are unchanged. git diff --check passed; ESLint still reports only the two previously recorded missing-key errors, left untouched. Slide 97 is now 1 / 2 Complete; item 5 remains Pending.

Slide 97, item 5 completed on 12 November 2026. Changed only the FES link label to Open in the Fire and Emergency Services Chapter. Verified the full visible label on [Public Safety Strategies Summary](http://localhost:3001/reports/public-safety-wir-2026/police_proposed_strategies_summary) and confirmed the destination remains /reports/public-safety-wir-2026/fes_workforce_strategies. Defence and Police labels, all content, artwork and styles remain unchanged. git diff --check passed; ESLint still reports only the two previously recorded missing-key errors, left untouched. Both tracked Slide 97 items are Complete; Slide 97 is removed from the open-slide summary.

## Slide 99 — Looking Forward / 2027 and Beyond

Reviewed on 12 November 2026 against [Public Safety — 2027 and Beyond](http://localhost:3001/reports/public-safety-wir-2026/looking_forward), [Local Government — 2027 and Beyond](http://localhost:3001/reports/local-government-workforce-insights-report/looking_forward), and Slide 99 in the new psa-frontend project.

| Item | Requested change | Status | Verified finding | Completion status |
|---|---|---|---|---|
| 2 | Line up the page text along the left edge indicated by the red guide. | Pending | The hero text starts approximately 49px from the viewport's left edge, while the broader-priorities and “Additionally…” paragraphs start at approximately 24px. Their left edges remain misaligned by about 25px at the tested desktop viewport. | Complete |
| 4 | Apply the LG WIR format to the broader-priorities content indicated by the arrows. | Pending | LG presents “Line of Inquiry 1”, “Line of Inquiry 2” and “Continuing” as three illustrated cards. Public Safety still presents the two broader priorities as a bullet list, followed by an “Additionally…” paragraph and five separate sector/focus cards. The requested LG presentation of the broader priorities has not been applied. | Complete |
| 5 | Add the closing buttons used in the LG WIR. | Pending | LG has a closing action row containing “Download 2026 PDF”, “Revisit the Executive Summary” and “Contact Public Skills Australia”. Public Safety finishes with the five Explore cards and then the footer; that closing row is absent. The header download control, top Back button and footer Contact Us link are not the requested closing action row. | Complete |

Slide 99, item 2 completed on 12 November 2026. Added horizontal padding and transparent side borders to the broader-priorities text section, matching the hero’s text inset exactly. Verified visually on [2027 and Beyond](http://localhost:3001/reports/public-safety-wir-2026/looking_forward) and measured identical left coordinates (48.571px) for the hero text, broader-priorities introduction and Additionally paragraph at the current desktop viewport; no horizontal overflow. All wording, bullet content, hero artwork, cards, links and animations remain unchanged. Targeted ESLint and git diff --check passed. Slide 99 is now 1 / 3 Complete; items 4 and 5 remain Pending.

Slide 99, item 4 completed on 12 November 2026. Presented the two broader priorities and existing Additionally statement as three illustrated cards labelled Line of Inquiry 1, Line of Inquiry 2 and Continuing, using the Local Government format and its existing inquiry SVG icons. Preserved the exact Public Safety wording and broader-priorities introduction; did not import Local Government-specific copy. Retained all five focus-area cards and links unchanged. Verified the three cards visually on [2027 and Beyond](http://localhost:3001/reports/public-safety-wir-2026/looking_forward), confirmed all three icons load, all five existing focus cards remain, and no horizontal page overflow. Hero, navigation and other page sections are unchanged. Targeted ESLint and git diff --check passed. Slide 99 is now 2 / 3 Complete; item 5 remains Pending.

Slide 99, item 5 completed on 12 November 2026. Added the LG-style closing action row: Download 2026 PDF, Revisit the Executive Summary and Contact Public Skills Australia. Verified the row visually on [2027 and Beyond](http://localhost:3001/reports/public-safety-wir-2026/looking_forward). Clicked Download and confirmed the report Downloads page loads, with a from parameter pointing back to Looking Forward; clicked Revisit and confirmed Executive Summary loads. Confirmed Contact uses the configured PSA contact URL (https://publicskillsaustralia.org.au/contact), opening in a separate tab. Hero, inquiry cards, five focus cards, text and existing navigation remain unchanged. Targeted ESLint and git diff --check passed. All three tracked Slide 99 items are Complete; Slide 99 is removed from the open-slide summary. The sole remaining Pending item is Slide 88, item 2, awaiting the referenced video.

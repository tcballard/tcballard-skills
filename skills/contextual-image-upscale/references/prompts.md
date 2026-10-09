# Edit prompts

Build each prompt from one style-specific core, the exact target framing requirement, and only material constraints relevant to the inspected crop. Save the exact submitted text for each attempt.

## Photographic core

```text
1=original: identity/anatomy/color/light authority. 2=target: return exact crop/framing/geometry. Reconstruct plausible photographic detail; preserve expression, pose, contours, clothing, genuine imperfections, focus falloff. Optical clarity; natural edge transitions; spatially varied texture. Repair inherited artifacts. Avoid invented structures/marks, beautification, relighting, halos, ringing, embossed/crosshatched/repeated texture, synthetic grain, blanket sharpening.
```

## Illustration core

```text
1=original: composition, geometry, painted style, color and light authority. 2=target: return exact crop/framing/geometry. Reconstruct plausible higher-resolution painted detail while preserving original brushwork, contours, atmospheric falloff, selective crisp edges, quiet intervals, palette and lighting. Repair inherited artifacts with natural painted transitions and spatially varied detail. Avoid invented structures/marks, relighting, halos, ringing, embossed/crosshatched/repeated texture, synthetic grain, blanket sharpening, photographic conversion or style drift.
```

## Relevant material constraints

- Skin: irregular pores/fine creases, quiet intervals; retain age, marks, expression and anatomy.
- Hair: cohesive groups, selective fibers, natural sparse fringe; preserve hairline and silhouette.
- Iris: source color, irregular branching fibers, coherent pupil, restrained reflections; preserve gaze and consistency between eyes.
- Textiles: original weave direction, spacing, motifs, folds and seams; no invented repeating motifs.
- Rigid objects: preserve silhouette, proportions and existing hardware. Do not invent fins, rings, panel seams, rivets, lattice members or marks. Keep repeated structures aligned.
- Painted coatings: uneven patches and quiet intervals; no scale, diamond, hexagonal, faceted or embossed tessellation unless present and intentionally retained in the source.
- Smoke/clouds: exact irregular contours and lobes, soft translucent fringes, original palette and volume; no new lobes, uniform cauliflower texture or uniformly sharp surfaces.
- Flame/glare: preserve outline, spill light, luminous softness and plume boundaries. Clipped highlights stay smooth; no invented sparks, shock diamonds or crisp structures inside glare.
- Landscape/water: exact terrain, channel and road outlines, perspective and reflections; no invented tracks, vegetation rows or repeated brush marks.
- Text/logos: preserve exact content and geometry. Retain prior pixels where the editor cannot reproduce them reliably; do not reconstruct illegible text as guessed lettering.

## Required target instruction

```text
Return only image 2, the target crop, matching its entire framing and aspect ratio ({width}:{height}), without borders, reframing or returning the full scene. Image 1 is the complete original supplied as context. Use maximum practical supported native resolution. Enhance the existing image only.
```

Use only resolution parameters actually supported by the selected tool. If no parameter exists, a prompt request is best-effort; record returned pixel dimensions. Preserve existing transparency through supported editing and assembly; if unsupported, report the limitation before changing the agreed output.

For a retry, append a narrow correction identifying the observed defect and authoritative source feature. Keep S as the first reference, preserve the original crop box, and retain the original prompt and failed/rejected attempt.

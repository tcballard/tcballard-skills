---
name: contextual-image-upscale
description: Enhance an existing photo or illustration through two or three passes of contextual AI crop editing, source-registered blending, visual review, and verified lossless export. Use for 8K wallpapers, high-resolution artwork, faithful photographic enhancement, flowers-upscale requests, or repeating a prior multi-pass upscale. Preserve source style and geometry; do not use for simple resizing, new compositions, exact logo reproduction, or unrequested style transfer.
---

# Contextual Image Upscale

Preserve the original, keep every native edit, and describe new detail as reconstructed.

## Establish the job

1. Locate and open the actual source **S**. If an attachment path expired, recover the matching attachment through the available file service and verify its identity. If unavailable, request the image; do not substitute a similar picture.
2. Reuse choices already made in the conversation. Otherwise ask: **“2 passes (recommended) or 3? 8K default; another resolution?”** Await the choice. “Same treatment” inherits the established pass count and resolution. Set **N = 2 or 3**, **L = specified longest edge or 8192**. Preserve aspect ratio, rounding only the shorter output edge to the nearest pixel; do not force 16:9.
3. Inspect style, composition, focus, lighting, anatomy, rigid geometry, text, repeating patterns, and transparency. Preserve photographic or painted character. Treat a requested style transfer as a separate authorized edit, then use that approved result as S for every enhancement call.
4. Discover available AI image-editing and raster-processing capabilities. Require an editor accepting both full context and target, plus crop, decode, similarity registration, masking, blending, and PNG export capabilities. Follow supported reference mechanisms and output limits. If a required capability is missing, report it; never pass off interpolation or unregistered pasting as this workflow.
5. Use environment-native tools and paths. Prefer maintained raster libraries/CLIs and honor language preferences. Create small job-local helpers where needed. The bundled Node helper plans coordinates only; it does not generate, register, or blend pixels.

Create a separate job directory and checkpoint manifest before editing. Hash and preserve S byte for byte; record orientation, dimensions, color profile, alpha, N, L, chosen style, and actual tool capabilities. For EXIF orientation or color conversion, keep S intact and create a recorded working-context copy representing the entire original. Never silently flatten transparency or reduce bit depth.

Read [prompts.md](references/prompts.md) for edit construction and [processing.md](references/processing.md) for assembly, persistence, and review. Use [crop-plan.md](references/crop-plan.md) when preparing coordinates with the bundled helper.

## Execute the passes

For **every E(C)**: inspect C, send inputs **[S = complete original context, C = target]**, and request the exact target framing at maximum practical supported native resolution. Retain actual dimensions; requested size is not proof of output size. Use the core prompt plus only relevant material constraints. Run independent calls concurrently only where supported, serialize manifest updates, and persist each result immediately.

- **Pass 1:** split S into a 3 × 3 grid of cores; pad each side by 20% of its core dimension and clip to S. Edit all nine targets, register and blend into M1 at a justified native assembly scale, then resize M1 proportionally to L.
- **Pass 2:** inspect M1 and select 4–8 salient padded ROIs: faces, hair, hands, objects, textiles, rigid structures, smoke boundaries, or meaningful painted details as present. Exclude low-information sky, empty backgrounds, and clipped glare as dedicated targets. Crop from M1, but still supply S as context. Register and blend into M2.
- **Pass 3, only when N = 3:** inspect M2 and choose 4–8 tighter focal ROIs such as eyes, lips, nose, fingers, surface transitions, or small material details. Keep homologous features consistent. Crop from M2 and supply S; register and blend into M3.

Select distinct useful targets, not arbitrary regions to reach a count. If the source cannot support four meaningful focal targets, explain and resolve the reduced scope before claiming the full protocol. Never run an unrequested third pass.

Before each next pass and final export, inspect the full image and actual 100% focal/overlap crops. Resolve doubling, seams, drift, repeated texture, inconsistent features, and material mismatch. Allow at most **two targeted retries per defect**, including input-compatibility retries. Preserve rejected attempts. If unreliable, retain prior pixels and disclose the fallback; do not loop indefinitely.

## Deliver and integrate

Export MN to a separate lossless PNG at L with preserved aspect and agreed color/alpha behavior. Verify PNG structure, full decode, exact dimensions, source hash, and final output hash. Inspect the final full image and representative 100% crops. Persist the image, preview, exact prompts/settings, manifest, native crops, masks/transforms, and review evidence using the environment's durable file workflow. An archive may consolidate processing evidence; validate it before delivery.

Provide the downloadable PNG and preview, prompts/settings, pass counts, rejections/fallbacks, and unresolved limitations. Distinguish **export dimensions** from **native generated dimensions** and identify detail as AI-reconstructed. Do not claim recovery of hidden original information or native 8K generation from an assembled export.

Repository updates are separate from enhancement. When authorized, inspect repository instructions, use a focused branch, replace/add only the intended asset, update dimensions and credits, verify the committed file matches the export, run repository checks, and follow the established PR/merge workflow. Otherwise deliver the files without publishing them. Do not hard-code a user's theme, repository, image, coordinates, credentials, or upload service into this skill.

# Processing and evidence contract

## Coordinates and checkpoints

Use half-open rectangles `[x0, y0, x1, y1]` in the oriented working-source frame. Record core and padded source-coordinate boxes, pass master dimensions, and the exact integer crop box on that master. Map x and y using their respective dimension ratios to account for integer rounding. Do not infer placement from generated content.

Persist an append-only attempt record for each call: patch ID, pass, region, context hash, target hash, boxes, exact prompt, tool/model/settings actually exposed, requested size, status, native path/dimensions/hash, failure/rejection reason, retry count and timestamp. Record generated, accepted and rejected as separate states; successful generation is not acceptance. Keep every attempt's native bytes, including unused outputs.

Maintain a job manifest containing source/working-copy provenance, requested contract, ordered passes and masters, selected attempts, registration parameters, color correction, confidence/masks, fallback boxes, QA findings and final export metadata. Use a single writer or a lock with atomic replace; never let concurrent results overwrite each other. Complete and flush file writes, fully decode saved inputs before calling the editor, and checkpoint completed outputs before dependent work.

On resume, verify source and completed-output hashes and reuse completed accepted work. Finish pending calls or inspect their known outcome before retrying. Never silently restart the whole job, overwrite attempts, change the source, or mark a partially completed run as finished.

## Registration and blending

1. Map each recorded box onto the current prior master. Fit a bounded global similarity transform first (translation, uniform scale, rotation), using stable low-frequency structures rather than invented fine texture. Record transforms, bounds, correspondence scores and residuals. Start conservatively; example limits of ±2% scale and ±0.4° rotation are heuristics, not proof of alignment. Hitting bounds requires inspection.
2. Permit bounded smooth local correction only with reliable correspondence and documented displacement limits. Disable it around rigid geometry, uncertain facial landmarks, lettering and repeating patterns. Using only similarity registration is valid; do not deform a rocket, tower, iris, weave or logo to make an edit fit.
3. Reject unreliable whole-patch correspondence. Use local confidence masks to retain prior pixels where correspondence is weak. Evaluate rigid edges and repeated motifs more strictly. Do not treat one global correlation score as proof of local correctness.
4. Match broad exposure/color with a smooth low-frequency field. Never transfer the prior's fine texture onto the enhancement or match away source lighting gradients. Record color-space/profile conversions; avoid RGB halos around transparency through appropriate premultiplied-alpha processing.
5. Feather 15–25% of interior patch borders to zero alpha. Do not fade away the outer image edge simply because it is a crop edge. Use normalized overlap or multiband blending, with prior pixels filling unsupported/uncertain weight. Do not independently add overlapping opacity layers and darken seams.
6. Preserve native enhanced crops separately from resized, registered or color-corrected derivatives. For pass 1, record chosen assembly dimensions and rationale before proportional resize to L. Subsequent passes use the preceding master and the same final dimensions.

## Visual acceptance and repairs

Review the full image, focal objects and overlap boundaries at actual 100% export pixels before the next pass. Include rigid edges, homologous features, fine materials, quiet regions and bright/dark transitions. Save reviewed crop boxes and findings; a downscaled contact sheet alone is insufficient.

Look for doubling, silhouette drift, horizon steps, invented hardware/text, checkerboard or diamond texture, repeated brush stamps, over-sharp smoke, altered gaze, seams, halos and inconsistent palette. A sharper crop can still be worse than its source.

Keep a per-defect retry budget of two. After a rejected attempt, use a targeted retry, a feathered local prior-pixel fallback, or reject the entire patch. Inspect fallback boundaries too: a rectangular fallback can create its own seam if the generated horizon or object shifted. If that happens, reject the larger patch instead of stacking compensating distortions. Document the softer retained area.

For a truncated/unsupported input, verify the actual file rather than assuming the editor failed. Rebuild the exact crop from the recorded prior master; fully decode it. Where appropriate, create a maximum-quality compatible copy within the tool's input limits, retaining the lossless target and recording dimensions/encoding. Do not use JPEG for required transparency. Count the retry and continue supplying S.

## Final evidence

Require source-hash preservation, full final PNG decode, exact proportional dimensions, agreed mode/alpha/profile, actual file size and SHA-256, and full-image plus 100% review. Recheck exported pixels after any conversion. Persist the verified final image and preview separately from processing masters. Include exact prompts, attempt dimensions, source boxes, transformations, masks, retries/rejections and accepted-patch counts in settings/processing evidence.

If all edits in a pass are rejected, report that no enhancement from that pass was accepted. If an entire run retains only prior pixels, label the result as a resized source, not a successful AI enhancement. If blocked, deliver preserved progress and state the missing capability rather than fabricate completion.

<h1 align="center">@tcballard Skills</h1>

<p align="center"><strong>Repeatable Codex workflows. Starting with contextual image upscaling.</strong></p>

This is where I publish Codex skills I want other people to use. First up: **Contextual Image Upscale**, a workflow for enhancing photos and artwork into 8K exports through overlapping AI edits, registered blending, and visual review. Every edit keeps the complete original in view. New detail is AI-reconstructed.

Add the marketplace, then follow the [install steps](#install):

```bash
codex plugin marketplace add tcballard/tcballard-skills
```

Your Codex environment needs a multi-image editor and raster-processing tools. See [requirements](#requirements).

**Preview:** an approved before/after comparison image is pending.

## Contextual Image Upscale

[Contextual Image Upscale](skills/contextual-image-upscale/SKILL.md) guides Codex through two or three passes of image enhancement while preserving the source composition, geometry, lighting, and photographic or painted character.

1. **Cover the image.** Edit nine overlapping grid crops, align them to the source, and blend them into a master.
2. **Work on the details.** Select 4–8 meaningful regions from that master and enhance them with the original still supplied as context.
3. **Go tighter, if requested.** A third pass works on 4–8 smaller focal details.

Between passes, inspect the full image and actual 100% focal and overlap crops. Check for seams, doubling, geometry drift, and repeated texture. Retry a defect at most twice; if an edit remains unreliable, keep the prior pixels and report the fallback.

A completed run delivers a lossless PNG, a preview, exact prompts and settings, and saved processing evidence. The default longest edge is **8192 pixels**, with the source aspect ratio preserved. Native edits, crop coordinates, transforms, and rejected attempts stay available for inspection and resuming the job.

8K describes the final export. The editor's native outputs can be smaller, and their actual dimensions are recorded separately. Reconstructed detail remains an interpretation of the source.

## Install

After adding the marketplace above:

1. Open `/plugins` in Codex.
2. Select **@tcballard Skills** and install it.
3. Start a new session.

See the official [Codex plugins guide](https://developers.openai.com/codex/plugins) for supported clients and setup.

For a skill-only installation, clone this repository and copy the complete `skills/contextual-image-upscale/` directory into a skill location supported by your client. Keep `agents/`, `references/`, and `scripts/` together. The [Codex skills guide](https://developers.openai.com/codex/skills) documents discovery paths.

Use one installed copy of `$contextual-image-upscale`. [CodexToolkit](https://github.com/tcballard/CodexToolkit) retains a synchronized copy for existing users; installing both bundles can expose the same skill name twice.

## Use the skill

Attach the source image and ask:

```text
$contextual-image-upscale Enhance this image in two passes at 8K.
```

Two passes are the recommended starting point. Ask for three passes or another longest-edge resolution when needed. “Same treatment” reuses the choices already made in the conversation.

<a id="requirements-and-limits"></a>

## Requirements

Your environment must provide an AI editor that accepts the complete original and target crop together, plus raster tools for decoding, cropping, similarity registration, masking, blending, and lossless PNG export. The skill checks these capabilities before editing and reports missing requirements. Availability, processing time, and service usage depend on the host and backend.

The bundled **Node.js 18+** helper plans crop coordinates without dependencies. Pixel processing uses the host's raster tools and job-local helpers as needed. The package supplies the workflow and planner; the host supplies the image capabilities.

## Maintain

The coordinate planner has five automated tests. Package checks also validate metadata, paths, and local references. Run them with Node.js 18+; no dependency installation is needed:

```bash
npm run check
```

To verify a distributed copy against this source:

```bash
node scripts/check-package.mjs --compare /absolute/path/to/copied/contextual-image-upscale
```

These checks cover the package and coordinate logic. AI output and raster assembly need the visual reviews described in the skill.

This is the canonical public source. Make changes here first, then synchronize retained copies. My personal workflows live in [CodexToolkit](https://github.com/tcballard/CodexToolkit). See [CONTRIBUTING.md](CONTRIBUTING.md) for the validation and publication workflow, and the official [plugin packaging guide](https://developers.openai.com/plugins/build/plugins) for the package format.

## License

Apache License 2.0. See [LICENSE](LICENSE). The initial skill was migrated from [CodexToolkit](https://github.com/tcballard/CodexToolkit/tree/978123e4e00d56d52ead27df20beaefcbcab623f/skills/contextual-image-upscale) without changing its seven files.

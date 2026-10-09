# @tcballard Skills

Maintained skills for public use with Codex. This repository is the canonical source for skills I choose to distribute; my personal workflows remain in [CodexToolkit](https://github.com/tcballard/CodexToolkit).

## Install

Add the marketplace:

```bash
codex plugin marketplace add tcballard/tcballard-skills
```

Open `/plugins` in Codex, select **@tcballard Skills**, and install it. Start a new session, attach your source image, and invoke the skill:

```text
$contextual-image-upscale Enhance this image in two passes at 8K.
```

See the official [Codex plugins guide](https://developers.openai.com/codex/plugins) and [plugin packaging guide](https://developers.openai.com/plugins/build/plugins) for supported clients and marketplace setup. Installing the package does not provide an image editor or raster backend.

For a skill-only installation, clone this repository and copy the complete `skills/contextual-image-upscale/` directory into a skill location supported by your client. Include its `agents/`, `references/`, and `scripts/` directories. See [Codex skills](https://developers.openai.com/codex/skills) for discovery paths.

Use one installed copy of `$contextual-image-upscale`. CodexToolkit retains a synchronized copy for existing users; installing both bundles can expose the same skill name twice.

## Contextual Image Upscale

[Contextual Image Upscale](skills/contextual-image-upscale/SKILL.md) enhances an existing photo or illustration using two or three passes of contextual AI crop editing, registration, blending, and visual inspection. It preserves the source composition, geometry, lighting, and photographic or painted character.

- Pass 1 edits nine overlapping grid crops.
- Pass 2 edits 4–8 meaningful focal regions selected from the assembled image.
- An optional third pass edits 4–8 tighter details.
- Every edit receives the complete original image as context and the current crop as its target.
- The default export is a lossless PNG with an 8192-pixel longest edge, preserving the source aspect ratio.
- Prompts, crop coordinates, native outputs, transforms, rejected attempts, and export checks are retained so a run can be inspected and resumed.

An 8K export contains **AI-reconstructed detail**. Export dimensions differ from the editor's native generated dimensions; this workflow does not recover hidden original information or guarantee native 8K generation.

### Requirements and limits

The host needs a multi-image editing capability that accepts the original and target together, plus raster tools for decoding, cropping, similarity registration, masking, blending, and lossless PNG export. The skill discovers available capabilities and reports missing requirements before claiming the workflow is complete. Some clients do not expose these capabilities.

The bundled dependency-free Node.js 18+ utility plans crop coordinates. It does not generate, register, blend, or upscale pixels. Raster processing uses tools available in the host environment and job-local helpers as needed. An API subscription or plugin installation alone does not guarantee the required editor is available. Processing time and service usage depend on the chosen backend and pass count.

The existing coordinate planner has automated tests. Repository checks validate package paths, metadata, local references, and those tests. They do not establish the quality of future AI edits or replace the full-image and 100% crop reviews required by the skill. No new end-to-end image generation was performed for this repository migration.

## Maintain

Run the package checks with Node.js 18+; no dependency installation is needed:

```bash
npm run check
```

To verify a distributed copy against this source:

```bash
node scripts/check-package.mjs --compare /absolute/path/to/copied/contextual-image-upscale
```

Make changes here first, then synchronize any retained copies. See [CONTRIBUTING.md](CONTRIBUTING.md) for the validation and publication workflow.

## License

Apache License 2.0. See [LICENSE](LICENSE). The initial skill was migrated from [CodexToolkit](https://github.com/tcballard/CodexToolkit/tree/978123e4e00d56d52ead27df20beaefcbcab623f/skills/contextual-image-upscale) without changing its seven files.

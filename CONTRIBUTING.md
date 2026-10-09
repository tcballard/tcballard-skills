# Contributing

This repository contains skills intended for public distribution. Develop personal or experimental workflows in CodexToolkit or a separate workspace first.

For a proposed change, describe the concrete behavior, prerequisites, and failure handling. Keep reusable instructions in `skills/<name>/SKILL.md`, detailed guidance in `references/`, and deterministic helpers in `scripts/`. Include the complete skill directory in a distribution; avoid user-specific paths, credentials, repositories, and image coordinates.

Use a focused branch and pull request. Run `npm run check` and `git diff --check` before publishing. Changes to coordinate or validation logic need tests for meaningful failure cases. Image-processing changes also need a real reviewed run: preserve evidence, inspect full images and 100% focal/overlap crops, and distinguish exported dimensions from native generated dimensions. Report exactly what was verified.

Update the root `plugin.json` and `package.json` versions together for published package changes. The root manifest is the portable plugin entry point; `.agents/plugins/marketplace.json` points at this repository root.

Make canonical skill changes here. After merge, copy the complete changed skill directory to any retained CodexToolkit copy and run this repository's checker against that copy:

```bash
node scripts/check-package.mjs --compare /absolute/path/to/CodexToolkit/skills/contextual-image-upscale
```

Update CodexToolkit's `skill-sources.json` provenance to the exact source tree and commit, plus its package version and documentation as needed. Synchronization is an explicit maintained step; this repository does not silently rewrite other repositories or account installations.

Keep the installation instructions grounded in official client documentation. A structural package check does not prove that a particular client exposes the editor and raster tools required by a skill.

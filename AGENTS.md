# Repository instructions

This is the canonical public distribution for maintained tcballard skills. Personal or experimental workflows belong elsewhere.

- Make focused changes on a branch and use a pull request before merging into main.
- Preserve the original image workflow and its truthful capability limits unless the task explicitly changes them.
- Use `npm run check` and `git diff --check` for package changes. Do not claim image quality or a live client installation from structural checks.
- Keep plugin and package versions aligned. Use root `plugin.json` as the portable manifest.
- Keep each skill self-contained under `skills/<name>/`; retain referenced files when copying or installing it.
- Develop canonical changes here and verify any retained copies with `scripts/check-package.mjs --compare`.
- Do not add personal paths, credentials, generated image assets, or unrelated skills to a focused change.

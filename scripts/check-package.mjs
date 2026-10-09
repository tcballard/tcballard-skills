#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative, dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(root, path), 'utf8');
const json = path => JSON.parse(read(path));
const manifest = json('plugin.json');
const pkg = json('package.json');
const market = json('.agents/plugins/marketplace.json');
assert.match(manifest.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
assert.equal(pkg.name, manifest.name);
assert.equal(pkg.version, manifest.version);
assert.equal(pkg.license, manifest.license);
assert.equal(manifest.license, 'Apache-2.0');
assert.ok(read('LICENSE').includes('Apache License'));
assert.equal(manifest.$schema, 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json');
assert.ok(manifest.description && manifest.author?.name && manifest.repository);
const ui = manifest.extensions?.['com.openai']?.interface;
assert.ok(ui?.displayName && ui.shortDescription && ui.defaultPrompt?.length);
assert.equal(market.name, manifest.name);
assert.equal(market.interface.displayName, ui.displayName);
assert.equal(market.plugins.length, 1);
assert.equal(market.plugins[0].name, manifest.name);
assert.deepEqual(market.plugins[0].source, { source: 'local', path: './' });
assert.equal(market.plugins[0].policy.installation, 'AVAILABLE');
assert.equal(market.plugins[0].policy.authentication, 'ON_INSTALL');
assert.equal(market.plugins[0].category, ui.category);

function files(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    assert.ok(!entry.isSymbolicLink(), `Symlink in package: ${entry.name}`);
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  }).sort();
}

const skillsRoot = join(root, 'skills');
const skillNames = readdirSync(skillsRoot, { withFileTypes: true }).map(entry => {
  assert.ok(entry.isDirectory(), `Unexpected file under skills/: ${entry.name}`);
  const directory = join(skillsRoot, entry.name);
  const skill = readFileSync(join(directory, 'SKILL.md'), 'utf8');
  const frontmatter = skill.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  assert.ok(frontmatter, `${entry.name}: missing frontmatter`);
  assert.equal(frontmatter.match(/^name:\s*(.+)$/m)?.[1], entry.name);
  assert.ok(frontmatter.match(/^description:\s*\S.+$/m), `${entry.name}: missing description`);
  const agent = readFileSync(join(directory, 'agents', 'openai.yaml'), 'utf8');
  assert.ok(agent.includes(`$${entry.name}`), `${entry.name}: default prompt must invoke the skill`);
  for (const path of files(directory).filter(path => path.endsWith('.md'))) {
    const markdown = readFileSync(path, 'utf8');
    for (const [, target] of markdown.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(target)) continue;
      const destination = resolve(dirname(path), target.split('#')[0]);
      const rel = relative(directory, destination);
      assert.ok(rel !== '..' && !rel.startsWith(`..${sep}`), `Reference escapes skill: ${target}`);
      assert.ok(statSync(destination).isFile(), `Missing skill reference: ${target}`);
    }
  }
  return entry.name;
});
assert.ok(skillNames.length, 'No packaged skills');
for (const prompt of ui.defaultPrompt) {
  for (const [, name] of prompt.matchAll(/\$([a-z0-9-]+)/g)) {
    assert.ok(skillNames.includes(name), `Prompt names an absent skill: ${name}`);
  }
}

const args = process.argv.slice(2);
assert.ok(args.length === 0 || (args.length === 2 && args[0] === '--compare'),
  'Usage: node scripts/check-package.mjs [--compare /absolute/path/to/copied/contextual-image-upscale]');
if (args.length) {
  const original = join(skillsRoot, 'contextual-image-upscale');
  const copy = resolve(args[1]);
  const sourceFiles = files(original).map(path => relative(original, path));
  const copyFiles = files(copy).map(path => relative(copy, path));
  assert.deepEqual(copyFiles, sourceFiles, 'Distributed file inventory differs');
  for (const path of sourceFiles) {
    assert.ok(readFileSync(join(original, path)).equals(readFileSync(join(copy, path))),
      `Distributed file differs: ${path}`);
  }
  console.log(`Distributed copy matches all ${sourceFiles.length} source files.`);
}
console.log(`Package paths and metadata verified; ${skillNames.length} skill(s): ${skillNames.join(', ')}.`);

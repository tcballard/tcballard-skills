#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';

function size(value, label) {
  if (!Array.isArray(value) || value.length !== 2 ||
      value.some(n => !Number.isSafeInteger(n) || n < 1 || n > 1000000)) {
    throw new Error(`${label} must contain two positive integer dimensions <= 1000000`);
  }
  return value;
}
export function outputSize(sourceSize, longestEdge = 8192) {
  const [w, h] = size(sourceSize, 'sourceSize');
  if (!Number.isSafeInteger(longestEdge) || longestEdge < 1 || longestEdge > 1000000) {
    throw new Error('longestEdge must be a positive integer <= 1000000');
  }
  return w >= h ? [longestEdge, Math.max(1, Math.round(h * longestEdge / w))]
    : [Math.max(1, Math.round(w * longestEdge / h)), longestEdge];
}
function box(value, sourceSize) {
  const [w, h] = size(sourceSize, 'sourceSize');
  if (!Array.isArray(value) || value.length !== 4 || value.some(n => !Number.isFinite(n)) ||
      value[0] < 0 || value[1] < 0 || value[2] > w || value[3] > h ||
      value[0] >= value[2] || value[1] >= value[3]) {
    throw new Error('ROI must be a nonempty [x0,y0,x1,y1] box within sourceSize');
  }
  return value;
}
export function paddedBox(core, sourceSize) {
  const [x0, y0, x1, y1] = box(core, sourceSize);
  const dx = .2 * (x1 - x0), dy = .2 * (y1 - y0);
  return [Math.max(0, x0 - dx), Math.max(0, y0 - dy),
    Math.min(sourceSize[0], x1 + dx), Math.min(sourceSize[1], y1 + dy)];
}
export function mapBox(sourceBox, sourceSize, masterSize) {
  box(sourceBox, sourceSize); size(masterSize, 'masterSize');
  const mapped = sourceBox.map((v, i) => Math.round(v * masterSize[i % 2] / sourceSize[i % 2]));
  box(mapped, masterSize); // Fail if a very small ROI collapses at the requested scale.
  return mapped;
}
function patch(id, region, core, sourceSize, masterSize) {
  const padded = paddedBox(core, sourceSize);
  const crop = mapBox(padded, sourceSize, masterSize);
  // Record the exact source-equivalent box of the rounded master crop too.
  const actual = crop.map((v, i) => v * sourceSize[i % 2] / masterSize[i % 2]);
  return {id, region, coreSourceBox: core, paddedSourceBox: padded,
    actualSourceBox: actual, masterSize, cropBox: crop,
    inputSize: [crop[2] - crop[0], crop[3] - crop[1]], status: 'planned'};
}
export function plan(job) {
  const sourceSize = size(job.sourceSize, 'sourceSize');
  if (Math.min(...sourceSize) < 3) throw new Error('Source is too small for a 3x3 grid');
  if (![2, 3].includes(job.passes)) throw new Error('passes must be an explicit 2 or 3');
  const targetSize = outputSize(sourceSize, job.longestEdge ?? 8192);
  const grid = [];
  for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
    const core = [Math.round(col * sourceSize[0] / 3), Math.round(row * sourceSize[1] / 3),
      Math.round((col + 1) * sourceSize[0] / 3), Math.round((row + 1) * sourceSize[1] / 3)];
    grid.push(patch(`p1-${String(grid.length + 1).padStart(2, '0')}`, 'grid', core, sourceSize, sourceSize));
  }
  const passes = [{pass: 1, cropFrom: 'original', patches: grid}];
  const rois = job.roisByPass ?? {};
  if (typeof rois !== 'object' || rois === null || Array.isArray(rois)) throw new Error('roisByPass must be an object');
  if (Object.keys(rois).some(k => !['2', ...(job.passes === 3 ? ['3'] : [])].includes(k))) {
    throw new Error('ROIs may only target requested focal passes');
  }
  for (let n = 2; n <= job.passes; n++) {
    if (rois[n] === undefined) {
      passes.push({pass: n, cropFrom: `M${n - 1}`, status: 'awaiting visual ROI selection'});
      continue;
    }
    if (!Array.isArray(rois[n]) || rois[n].length < 4 || rois[n].length > 8) {
      throw new Error('Each planned focal pass requires 4–8 visually selected ROIs');
    }
    const seen = new Set();
    const patches = rois[n].map((roi, i) => {
      if (!roi || typeof roi.region !== 'string' || !roi.region.trim()) throw new Error('ROI requires a region label');
      box(roi.coreSourceBox, sourceSize);
      const key = JSON.stringify(roi.coreSourceBox);
      if (seen.has(key)) throw new Error('Duplicate focal ROI');
      seen.add(key);
      return patch(`p${n}-${String(i + 1).padStart(2, '0')}`, roi.region, roi.coreSourceBox, sourceSize, targetSize);
    });
    passes.push({pass: n, cropFrom: `M${n - 1}`, patches});
  }
  return {schemaVersion: 1, sourceSize, outputSize: targetSize, requestedPasses: job.passes,
    contextForEveryEdit: 'complete original S', paddingFraction: .2, passes};
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node crop-plan.mjs job.json');
    process.stdout.write(JSON.stringify(plan(JSON.parse(readFileSync(process.argv[2], 'utf8'))), null, 2) + '\n');
  } catch (error) {
    process.stderr.write(`crop-plan: ${error.message}\n`); process.exitCode = 1;
  }
}

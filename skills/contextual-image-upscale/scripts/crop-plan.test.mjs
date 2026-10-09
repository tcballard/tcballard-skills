import test from 'node:test';
import assert from 'node:assert/strict';
import {plan, outputSize, paddedBox, mapBox} from './crop-plan.mjs';

test('landscape, portrait and native rounding preserve the source aspect', () => {
  assert.deepEqual(outputSize([1536,1024]), [8192,5461]);
  assert.deepEqual(outputSize([1024,1536]), [5461,8192]);
  assert.deepEqual(outputSize([1672,941]), [8192,4610]);
  for (const s of [[4096,2304],[997,991],[101,900],[900,101]]) {
    const out = outputSize(s, 4096);
    assert.equal(Math.max(...out),4096);
    assert.ok(Math.abs(Math.min(...out)-Math.min(...s)*4096/Math.max(...s)) <= .5);
  }
});
test('odd-sized grid covers every source pixel exactly once in its cores', () => {
  const p = plan({sourceSize:[101,77],passes:2});
  const counts = new Uint8Array(101*77);
  for (const {coreSourceBox:[x0,y0,x1,y1],cropBox:b} of p.passes[0].patches) {
    assert.ok(b[0]<=x0 && b[1]<=y0 && b[2]>=x1 && b[3]>=y1);
    for(let y=y0;y<y1;y++) for(let x=x0;x<x1;x++) counts[y*101+x]++;
  }
  assert.ok(counts.every(n=>n===1));
  assert.equal(p.passes[1].status,'awaiting visual ROI selection');
});
test('padding clips edges and coordinate mapping uses both axes', () => {
  assert.deepEqual(paddedBox([0,0,100,50],[300,200]),[0,0,120,60]);
  assert.deepEqual(mapBox([10,20,50,60],[100,100],[800,600]),[80,120,400,360]);
});
const rois = Array.from({length:4},(_,i)=>({region:`detail ${i}`,coreSourceBox:[10+i*20,10,25+i*20,30]}));
test('focal plan records rounded crop provenance without claiming generation', () => {
  const p=plan({sourceSize:[101,77],passes:3,roisByPass:{2:rois}});
  for (const r of p.passes[1].patches) {
    assert.equal(r.status,'planned');
    assert.deepEqual(mapBox(r.actualSourceBox,p.sourceSize,r.masterSize),r.cropBox);
  }
  assert.equal(p.passes[2].cropFrom,'M2');
  assert.equal(p.passes[2].status,'awaiting visual ROI selection');
});
test('reject invalid choices, out-of-bounds or duplicate ROIs and an extra pass', () => {
  for (const job of [{sourceSize:[0,10],passes:2},{sourceSize:[2,10],passes:2},
    {sourceSize:[100,100],passes:4},{sourceSize:[100,100],passes:2,longestEdge:0},
    {sourceSize:[100,100],passes:2,roisByPass:{3:rois}},
    {sourceSize:[100,100],passes:2,roisByPass:{2:rois.slice(0,3)}},
    {sourceSize:[100,100],passes:2,roisByPass:{2:[...rois.slice(0,3),rois[0]]}},
    {sourceSize:[100,100],passes:2,roisByPass:{2:[...rois.slice(0,3),{region:'bad',coreSourceBox:[-1,0,5,5]}]}}]) {
    assert.throws(()=>plan(job));
  }
});

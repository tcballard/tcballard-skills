# Coordinate planner

Use Node.js 18+ with no package installation. Obtain oriented working-source dimensions from an actual image decode, and create a job JSON after the user has chosen the pass count:

```json
{"sourceSize":[1536,1024],"passes":2,"longestEdge":8192}
```

Run from the skill directory, saving to a new job-local path:

```bash
node scripts/crop-plan.mjs /absolute/job/job.json > /absolute/job/crop-plan.json
```

The planner returns nine padded first-pass crops and proportional output dimensions. Pending focal passes remain explicitly unplanned. It cannot select salient regions, inspect images, invoke an editor, register pixels, blend, verify a decoded export, or establish visual quality.

After inspecting the preceding master, add `roisByPass` to a new version of the job JSON. Each requested focal pass must contain 4–8 distinct regions, with core boxes expressed in the original source frame:

```json
{
  "sourceSize":[1536,1024], "passes":2, "longestEdge":8192,
  "roisByPass":{"2":[
    {"region":"visually selected detail A","coreSourceBox":[100,100,250,250]},
    {"region":"visually selected detail B","coreSourceBox":[400,200,600,350]},
    {"region":"visually selected detail C","coreSourceBox":[700,500,950,700]},
    {"region":"visually selected detail D","coreSourceBox":[1100,650,1350,900]}
  ]}
}
```

These boxes illustrate syntax only; never reuse them without image inspection. For a selection made on M1/M2, convert each coordinate back to the original frame using that axis's dimension ratio. The helper records intended padded source boxes, integer master crop boxes, and their exact source-equivalent boxes. Always cut the recorded `cropBox` from `cropFrom`. Source context remains S in every pass.

Use `mapBox` to place recorded source boxes on a chosen pass-1 native assembly canvas. Preserve the returned geometry separately from the editor's actual native output dimensions. Do not overwrite an evidence manifest with planner output.

Run the coordinate tests with `node --test scripts/crop-plan.test.mjs`. They check aspect rounding, grid coverage, clipping, coordinate provenance and invalid inputs; they do not validate AI output or raster assembly.

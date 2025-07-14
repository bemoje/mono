---
mode: agent
---

run `yarn indextsAll && yarn buildAll && node s\parseTsDocsPrint.mjs` to get a list of TSDoc summaries for each export of each lib. You have 2 tasks:

**Task 1**
The files listed under the 'filesSummariesMissing' currently have no TSDoc.

Can you add TSDoc summaries to these files as per the repo guidelines?

**Task 2**
The filepaths listed under the 'libExportNotInDedicatedFile' header should have been in its own file, as per the repo guidelines where at most one named export can be in each file. default exports are used for internal, non-public-api things as they will not get exported by the auto-generated barrel-export index.ts files that just export everything.

Can you refactor so the guidelines are being followed?

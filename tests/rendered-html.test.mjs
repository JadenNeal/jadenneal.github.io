import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function renderedHomepage() {
  return readFile(new URL("dist/index.html", projectRoot), "utf8");
}

test("builds the complete academic homepage from Markdown content", async () => {
  const html = await renderedHomepage();

  assert.match(html, /<title>Weicai Long \| Academic Homepage<\/title>/i);
  assert.match(html, /Weicai Long/);
  assert.match(html, /龙为材/);
  assert.match(html, /Ph\.D\. Candidate in Data Science and Analytics/);
  assert.match(html, /GenomeQA/);
  assert.match(html, /MutBERT/);
  assert.match(html, /BioMaster/);
  assert.match(html, /GenomeHarness/);
  assert.match(html, /ContextTAD/);
  assert.match(html, /NyxBind/);
  assert.match(html, /PopGenAgent/);
  assert.match(html, /<h2>Selected Publications<\/h2>/);
  assert.match(html, /\[Full List\]/);
  assert.match(html, /10\.1016\/j\.patter\.2026\.101611/);
  assert.match(html, /10\.1093\/bib\/bbag182/);
  assert.match(
    html,
    /<a href="https:\/\/doi\.org\/10\.1016\/j\.patter\.2026\.101611"[^>]*>BioMaster<\/a>/,
  );
  assert.match(
    html,
    /<a href="https:\/\/doi\.org\/10\.18653\/v1\/2026\.acl-long\.1655"[^>]*>GenomeQA<\/a>/,
  );
  assert.match(
    html,
    /<a href="https:\/\/doi\.org\/10\.18653\/v1\/2026\.findings-acl\.1432"[^>]*>PhageBench<\/a>/,
  );
  assert.doesNotMatch(html, /Lightweight DNA-Text Multimodal Instruction Tuning/);
  assert.match(html, /longwc819@gmail\.com/);
  assert.doesNotMatch(html, /mailto:longwc819@gmail\.com/i);
  assert.match(html, /https:\/\/github\.com\/JadenNeal/);
  assert.match(html, /https:\/\/zhyanlin\.github\.io/);
  assert.match(html, /https:\/\/sites\.google\.com\/ucsc\.edu\/jiahengwei/);
  assert.match(html, /4Gk6gSIAAAAJ/);
  assert.match(html, /Started an internship at HONOR/);
  assert.match(html, /Jun 2022 - Nov 2022/);
  assert.match(html, /<h2>Talks<\/h2>/);
  assert.match(html, /XJ98pNdHTzs/);
  assert.match(html, /Jul 2025/);
  assert.match(html, /oral presentation at ISMB\/ECCB 2025/);
  assert.doesNotMatch(html, /I have end-to-end research experience/);
  assert.match(html, /Large language models/);
  assert.match(html, /Genome sequence modeling/);
  assert.match(html, /AI-assisted family-doctor and primary-care applications/);
  assert.match(html, /To Prospective Collaborators/);
  assert.match(html, /always open to collaboration with researchers and students/);
  assert.match(html, /IF: 10\.8 · SCI-Q1/);
  assert.match(html, /IF: 7\.3 · SCI-Q1/);
  assert.match(html, /IF: 15\.0/);
  assert.match(html, /IF: 5\.5 · SCI-Q1 · ISMB: Top Conference/);
  assert.match(html, /IF: 5\.7 · SCI-Q2/);
  assert.match(html, /CCF-A/);
  assert.doesNotMatch(html, /<h2>Education<\/h2>|href="#education"/i);
  assert.doesNotMatch(html, /codex-preview|Building your site|react-loading-skeleton/i);
});

test("numbers publications newest-first while keeping the earliest paper at 1", async () => {
  const html = await renderedHomepage();
  const publicationSection = html.match(
    /<section class="content-section" id="publications">([\s\S]*?)<\/section>/,
  )?.[1];

  assert.ok(publicationSection, "publication section should be rendered");
  assert.match(publicationSection, /<ol class="publication-list" reversed start="12">/);
  assert.match(publicationSection, /<li class="publication-item" value="12">/);
  assert.match(publicationSection, /<li class="publication-item" value="1">/);
  assert.ok(
    publicationSection.indexOf("BioMaster") < publicationSection.indexOf("BPNet"),
    "newer publications should appear before older publications",
  );
});

test("keeps every editable homepage section in one Markdown file", async () => {
  const contentDir = new URL("src/content/", projectRoot);
  const files = (await readdir(contentDir)).sort();

  assert.deepEqual(files, [
    "about.md",
    "collaboration.md",
    "experience.md",
    "more.md",
    "news.md",
    "profile.md",
    "publications.md",
    "research.md",
    "talks.md",
  ]);

  const pageSource = await readFile(new URL("src/pages/index.astro", projectRoot), "utf8");
  const publicationsSource = await readFile(
    new URL("src/content/publications.md", projectRoot),
    "utf8",
  );

  assert.doesNotMatch(pageSource, /BioMaster|GenomeHarness|BPNet/);
  assert.match(publicationsSource, /BioMaster/);
  assert.match(publicationsSource, /GenomeHarness/);
  assert.match(publicationsSource, /BPNet/);
  assert.doesNotMatch(pageSource, /18800199600|wlong381@connect\.hkust-gz\.edu\.cn/);
  assert.doesNotMatch(pageSource, /github\.com\/Jadenneal/i);
  assert.doesNotMatch(publicationsSource, /龙为材-香港科技大学广州-博士\.pdf/);
});

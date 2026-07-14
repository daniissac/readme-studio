import test from 'node:test';
import assert from 'node:assert/strict';

import { generateTOC } from '../src/toc.js';

test('generates GitHub-style anchors and nested entries', () => {
  const toc = generateTOC('# Project Name\n\n## Quick Start\n\n### API & Usage');

  assert.equal(
    toc,
    '## Table of Contents\n\n' +
      '- [Project Name](#project-name)\n' +
      '  - [Quick Start](#quick-start)\n' +
      '    - [API & Usage](#api-usage)\n',
  );
});

test('returns an empty string when there are no headings', () => {
  assert.equal(generateTOC('Plain paragraph'), '');
});

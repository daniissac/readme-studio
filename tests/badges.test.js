import test from 'node:test';
import assert from 'node:assert/strict';

import { badgePresets, generateBadge } from '../src/badges.js';

test('generates a GitHub Actions badge from supplied values', () => {
  const badge = badgePresets[0].badges[0];
  const markdown = generateBadge(badge, {
    owner: 'daniissac',
    repo: 'readme-studio',
    workflow: 'ci.yml',
  });

  assert.match(markdown, /daniissac\/readme-studio\/ci\.yml/);
  assert.doesNotMatch(markdown, /\{owner\}|\{repo\}|\{workflow\}/);
});

test('normalizes spaces in custom badge values', () => {
  const badge = badgePresets.at(-1).badges[0];
  const markdown = generateBadge(badge, {
    label: 'build status',
    message: 'all good',
    color: 'bright green',
    url: 'https://example.com',
  });

  assert.match(markdown, /build_status-all_good-bright_green/);
});

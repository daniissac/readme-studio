export const badgePresets = [
  {
    category: 'Build',
    badges: [
      {
        name: 'GitHub Actions',
        template: '[![Build Status](https://img.shields.io/github/actions/workflow/status/{owner}/{repo}/{workflow}?branch=main)](https://github.com/{owner}/{repo}/actions)',
        fields: ['owner', 'repo', 'workflow'],
      },
    ],
  },
  {
    category: 'Package',
    badges: [
      {
        name: 'npm version',
        template: '[![npm](https://img.shields.io/npm/v/{package})](https://www.npmjs.com/package/{package})',
        fields: ['package'],
      },
      {
        name: 'npm downloads',
        template: '[![npm downloads](https://img.shields.io/npm/dm/{package})](https://www.npmjs.com/package/{package})',
        fields: ['package'],
      },
    ],
  },
  {
    category: 'License',
    badges: [
      {
        name: 'MIT',
        template: '[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)',
        fields: [],
      },
      {
        name: 'Apache 2.0',
        template: '[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)',
        fields: [],
      },
      {
        name: 'GPLv3',
        template: '[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)',
        fields: [],
      },
    ],
  },
  {
    category: 'Quality',
    badges: [
      {
        name: 'Code Coverage',
        template: '[![codecov](https://codecov.io/gh/{owner}/{repo}/branch/main/graph/badge.svg)](https://codecov.io/gh/{owner}/{repo})',
        fields: ['owner', 'repo'],
      },
    ],
  },
  {
    category: 'Custom',
    badges: [
      {
        name: 'Custom Badge',
        template: '[![{label}](https://img.shields.io/badge/{label}-{message}-{color})]({url})',
        fields: ['label', 'message', 'color', 'url'],
      },
    ],
  },
];

export function generateBadge(badge, values) {
  let result = badge.template;
  for (const field of badge.fields) {
    const val = (values[field] || field).replace(/\s/g, '_');
    result = result.replace(new RegExp(`\\{${field}\\}`, 'g'), val);
  }
  return result;
}

export const templates = [
  {
    name: 'Project README',
    description: 'Full project documentation with badges, install, usage, and contributing',
    content: `# Project Name

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/actions/workflow/status/user/repo/ci.yml?branch=main)](https://github.com/user/repo/actions)

Short description of what this project does and why it exists.

## Features

- Feature one
- Feature two
- Feature three

## Installation

\`\`\`bash
npm install your-package
\`\`\`

## Usage

\`\`\`js
import { something } from 'your-package';

something();
\`\`\`

## API

### \`functionName(param)\`

| Parameter | Type     | Description          |
|-----------|----------|----------------------|
| \`param\`   | \`string\` | Description of param |

Returns: \`Promise<Result>\`

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
`,
  },
  {
    name: 'Profile README',
    description: 'Personal GitHub profile introduction',
    content: `# Hi, I'm Your Name 👋

## About Me

- 🔭 I'm currently working on **Project Name**
- 🌱 I'm currently learning **Technology**
- 💬 Ask me about **Topic**
- 📫 How to reach me: **email@example.com**

## Tech Stack

![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)

## GitHub Stats

![Your GitHub stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=default)

## Recent Projects

| Project | Description | Stars |
|---------|-------------|-------|
| [Project 1](https://github.com/user/project1) | Short description | ⭐ |
| [Project 2](https://github.com/user/project2) | Short description | ⭐ |

## Connect

[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![Twitter](https://img.shields.io/badge/-Twitter-1DA1F2?style=flat-square&logo=twitter&logoColor=white)](https://twitter.com/yourhandle)
`,
  },
  {
    name: 'Contributing Guide',
    description: 'Instructions for open source contributors',
    content: `# Contributing to Project Name

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct. By participating, you are expected to uphold this code.

## How to Contribute

### Reporting Bugs

Before creating a bug report, please check existing issues. When creating a report, include:

- A clear, descriptive title
- Steps to reproduce the behavior
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, version)

### Suggesting Features

Feature requests are welcome. Please provide:

- A clear description of the feature
- The motivation and use case
- Any alternatives you've considered

### Pull Requests

1. Fork the repo and create your branch from \`main\`
2. Install dependencies: \`npm install\`
3. Make your changes
4. Add tests if applicable
5. Ensure tests pass: \`npm test\`
6. Update documentation as needed
7. Submit your pull request

## Development Setup

\`\`\`bash
git clone https://github.com/user/repo.git
cd repo
npm install
npm run dev
\`\`\`

## Style Guide

- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Follow the existing code style
- Add JSDoc comments for public APIs

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.
`,
  },
  {
    name: 'Changelog',
    description: 'Keep-a-changelog format for release notes',
    content: `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- New feature description

### Changed

- Updated feature description

### Fixed

- Bug fix description

## [1.0.0] - YYYY-MM-DD

### Added

- Initial release
- Feature one
- Feature two

### Security

- Security fix description

[Unreleased]: https://github.com/user/repo/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/user/repo/releases/tag/v1.0.0
`,
  },
  {
    name: 'Minimal',
    description: 'Simple README with just the essentials',
    content: `# Project Name

Brief description of what this project does.

## Getting Started

\`\`\`bash
npm install your-package
\`\`\`

## Usage

\`\`\`js
import pkg from 'your-package';
\`\`\`

## License

[MIT](LICENSE)
`,
  },
];

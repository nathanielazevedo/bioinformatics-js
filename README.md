# bioinformatics-js

This package is currently just a dream.
Reach out to me if you're interesting in open source bioinformatics.

[www.linkedin.com/in/nateazevedo](https://www.linkedin.com/in/nateazevedo)




## Installation

```bash
npm install bioinformatics-js
```

## Usage

```jsx
import { DNASequenceViewer } from 'bioinformatics-js';

function App() {
  return (
    <DNASequenceViewer
      sequence="ATCGATCGATCG"
      annotations={[]}
    />
  );
}
```

## Features

- DNA sequence visualization
- Annotation management
- Interactive genomics tools
- Built with React and D3.js

## Local Testing

To test this package locally:

### Method 1: Using npm pack (Recommended)
1. Build and package:
```bash
npm run build
npm run test:local
```

2. In your test project:
```bash
npm install ../DNA\ Sequence\ Viewer/bioinformatics-js-*.tgz
```

### Method 2: Using file protocol
1. Build the package:
```bash
npm run build
```

2. In your test project:
```bash
npm install file:../DNA\ Sequence\ Viewer
```

3. Rebuild and reinstall after changes:
```bash
# In package directory
npm run build
# In test project
npm install file:../DNA\ Sequence\ Viewer --force
```

## Automated Publishing

This package automatically publishes to NPM on commits to master.

### Setup:
1. Get your NPM token: `npm token create`
2. Add it to GitHub Secrets as `NPM_TOKEN`
3. Commits to master will trigger automatic builds and publishing

### Manual version bump:
```bash
npm version patch  # or minor, major
git push origin master --tags
```

## License

MIT
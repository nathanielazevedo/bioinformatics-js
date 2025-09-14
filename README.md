# bioinformatics-js

A comprehensive React library for bioinformatics visualization tools including DNA sequence viewers, annotation management, and more.

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

1. Build the package:
```bash
npm run build
```

2. Link the package globally:
```bash
npm link
```

3. In your test project:
```bash
npm link bioinformatics-js
```

4. Use the package in your test project as normal

## License

MIT
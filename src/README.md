# BioInfoViz

A comprehensive React library for bioinformatics visualization tools. This package provides interactive components for visualizing DNA sequences, managing annotations, and performing sequence analysis.

## Features

- **DNA Sequence Viewer**: Interactive visualization of DNA sequences with color-coded bases
- **Annotation Management**: Add, edit, and visualize genetic annotations (genes, promoters, exons, etc.)
- **Search Functionality**: Find and highlight specific sequences
- **Sequence Statistics**: Real-time GC content and base composition analysis
- **Responsive Design**: Works on desktop and mobile devices
- **Customizable**: Full control over styling and behavior

## Installation

```bash
npm install bioinfoviz
```

## Dependencies

This package requires React and D3 as peer dependencies:

```bash
npm install react react-dom d3
```

## Basic Usage

```tsx
import React from 'react';
import { DNASequenceViewer } from 'bioinfoviz';
import 'bioinfoviz/dist/styles.css'; // Import default styles

function App() {
  return (
    <div>
      <DNASequenceViewer 
        initialSequence="ATGCGATCGTAGCTAGCATGC"
      />
    </div>
  );
}

export default App;
```

## Advanced Usage

### With Custom Annotations

```tsx
import React, { useState } from 'react';
import { DNASequenceViewer, Annotation } from 'bioinfoviz';

function App() {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      start: 0,
      end: 10,
      label: 'Gene A',
      type: 'gene',
      color: '#4CAF50',
      description: 'Important gene',
      strand: '+'
    }
  ]);

  return (
    <DNASequenceViewer 
      initialSequence="ATGCGATCGTAGCTAGCATGC"
      annotations={annotations}
      onAnnotationsChange={setAnnotations}
    />
  );
}
```

### Custom Styling

```tsx
import React from 'react';
import { DNASequenceViewer } from 'bioinfoviz';

function App() {
  return (
    <DNASequenceViewer 
      initialSequence="ATGCGATCGTAGCTAGCATGC"
      width={1000}
      height={600}
      className="my-custom-viewer"
    />
  );
}
```

## Components

### DNASequenceViewer

The main component for visualizing DNA sequences.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialSequence` | `string` | Sample sequence | The DNA sequence to display |
| `annotations` | `Annotation[]` | `[]` | Array of sequence annotations |
| `onAnnotationsChange` | `(annotations: Annotation[]) => void` | - | Callback when annotations change |
| `width` | `number` | `800` | Width of the visualization |
| `height` | `number` | Auto | Height of the visualization |
| `className` | `string` | `''` | Additional CSS classes |

### AnnotationManager

Component for managing sequence annotations.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `annotations` | `Annotation[]` | Current annotations |
| `onAddAnnotation` | `(annotation: Omit<Annotation, 'id'>) => void` | Add annotation callback |
| `onEditAnnotation` | `(id: string, annotation: Omit<Annotation, 'id'>) => void` | Edit annotation callback |
| `onDeleteAnnotation` | `(id: string) => void` | Delete annotation callback |
| `sequenceLength` | `number` | Length of the sequence |

## Types

### Annotation

```tsx
interface Annotation {
  id: string;
  start: number;
  end: number;
  label: string;
  type: string;
  color: string;
  description?: string;
  strand?: '+' | '-';
}
```

## Annotation Types

The library supports several predefined annotation types:

- **gene**: Protein-coding genes
- **promoter**: Regulatory sequences
- **enhancer**: Enhancer elements
- **exon**: Coding sequences
- **intron**: Non-coding sequences
- **utr**: Untranslated regions
- **restriction**: Restriction enzyme sites
- **custom**: User-defined annotations

## Styling

The package includes default Tailwind CSS styles. You can either:

1. Use the provided styles by importing the CSS file
2. Customize the styling by overriding the CSS classes
3. Use the individual UI components with your own styling

### CSS Classes

Key classes you can override:

- `.dna-viewer-container`: Main container
- `.base-A`, `.base-T`, `.base-G`, `.base-C`: DNA base styling
- `.annotation-gene`, `.annotation-promoter`, etc.: Annotation styling

## Examples

### Basic Sequence Analysis

```tsx
import React from 'react';
import { DNASequenceViewer } from 'bioinfoviz';

// Analyze a gene sequence
const geneSequence = "ATGAAACGCATTAGCACCACCATTACCACCACCATCACCATTACCACAGGTAACGGTGCGGGCTGACGCGTACAGGAAACACAGAAAAAAGCCCGCACCTGACAGTGCGGGCTTTTTTTTTCGACCAAAGGTAACGAGGTAACAACCATGCGAGTGTTGAAGTTCGGCGGTACATCAGTGGCAAATGCAGAACGTTTTCTGCGTGTTGCCGATATTCTGGAAAGCAATGCCAGGCAGGGGCAGGTGGCCACCGTCCTCTCTGCCCCCGCCAAAATCACCAACCACCTGGTGGCGATGATTGAAAAAACCATTAGCGGCCAGGATGCTTTACCCAATATCAGCGATGCCGAACGTATTTTTGCCGAACTTTTGACGGGACTCGCCGCCGCCCAGCCGGGGTTCCCGCTGGCGCAATTGAAAACTTTCGTCGATCAGGAATTTGCCCAAATAAAACATGTCCTGCATGGCATTAGTTTGTTGGGGCAGTGCCCGGATAGCATCAACGCTGCGCTGATTTGCCGTGGCGAGAAAATGTCGATCGCCATTATGGCCGGCGTATTAGAAGCGCGCGGTCACAACGTTACTGTTATCGATCCGGTCGAAAAACTGCTGGCAGTGGGGCATTACCTCGAATCTACCGTCGATATTGCTGAGTCCACCCGCCGTATTGCGGCAAGCCGCATTCCGGCTGATCACATGGTGCTGATGGCAGGTTTCACCGCCGGTAATGAAAAAGGCGAACTGGTGGTGCTTGGACGCAACGGTTCCGACTACTCTGCTGCGGTGCTGGCTGCCTGTTTACGCGCCGATTGTTGCGAGATTTGGACGGACGTTGACGGGGTCTATACCTGCGACCCGCGTCAGGTGCCCGATGCGAGGTTGTTGAAGTCGATGTCCTACCAGGAAGCGATGGAGCTTTCCTACTTCGGCGCTAAAGTTCTTCACCCCCGCACCATTACCCCCATCGCCCAGTTCCAGATCCCTTGCCTGATTAAAAATACCGGAAATCCTCAAGCACCAGGTACGCTCATTGGTGCCAGCCGTGATGAAGACGAATTACCGGTCAAGGGCATTTCCAATCTGAATAACATGGCAATGTTCAGCGTTTCTGGTCCGGGGATGAAAGGGATGGTCGGCATGGCGGCGCGCGTCTTTGCAGCGATGTCACGCGCCCGTATTTCCGTGGTGCTGATTACGCAATCATCTTCCGAATACAGCATCAGTTTCTGCGTTCCACAAAGCGACTGTGTGCGAGCTGAACGGGCAATGCAGGAAGAGTTCTACCTGGAACTGAAAGAAGGCTTACTGGAGCCGCTGGCAGTGACGGAACGGCTGGCCATTATCTCGGTGGTAGGTGATGGTATGCGCACCTTGCGTGGGATCTCGGCACCGAACAGTTACGTATAGAAGCTGACGCGGAAGAAAAAGTCTCTCAAATTCTTCATGGCCGGCGCTGCCGAAGCTGCAACCGATGTCAGCATGTTCTTCGATAAAGAAACTACAGCATGA";

function GeneAnalyzer() {
  return (
    <div>
      <h1>Gene Sequence Analysis</h1>
      <DNASequenceViewer 
        initialSequence={geneSequence}
      />
    </div>
  );
}
```

### Interactive Annotation Tool

```tsx
import React, { useState } from 'react';
import { DNASequenceViewer, Annotation } from 'bioinfoviz';

function AnnotationTool() {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const sequence = "ATGAAACGCATTAGCACCACCATTACCACCACCATCACCATTACCACAGGTAACGGTGCGGGCTGACGC";

  const handleExportAnnotations = () => {
    const data = JSON.stringify(annotations, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'annotations.json';
    a.click();
  };

  return (
    <div>
      <h1>DNA Annotation Tool</h1>
      <DNASequenceViewer 
        initialSequence={sequence}
        annotations={annotations}
        onAnnotationsChange={setAnnotations}
      />
      <button onClick={handleExportAnnotations}>
        Export Annotations
      </button>
    </div>
  );
}
```

## Development

To contribute to this project:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Build: `npm run build`

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## Support

For questions and support, please open an issue on our GitHub repository.
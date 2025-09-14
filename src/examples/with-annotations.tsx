import React, { useState } from 'react';
import { DNASequenceViewer, Annotation } from '../src';

// Example with predefined annotations
export const AnnotatedExample = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      start: 0,
      end: 20,
      label: 'Gene A',
      type: 'gene',
      color: '#4CAF50',
      description: 'Important gene coding for protein A',
      strand: '+'
    },
    {
      id: '2',
      start: 25,
      end: 35,
      label: 'Promoter',
      type: 'promoter',
      color: '#FF9800',
      description: 'Regulatory sequence',
      strand: '+'
    },
    {
      id: '3',
      start: 40,
      end: 60,
      label: 'Exon 1',
      type: 'exon',
      color: '#2196F3',
      description: 'First exon of gene B',
      strand: '-'
    }
  ]);

  const sequence = "ATGCGATCGTAGCTAGCATGCTAGCTAGCATGCTAGCTAGCATGCTAGCATGCTAGCTAGCATGCTAGCTAGCATGC";

  return (
    <div style={{ padding: '20px' }}>
      <h1>DNA Sequence Viewer with Annotations</h1>
      <DNASequenceViewer 
        initialSequence={sequence}
        annotations={annotations}
        onAnnotationsChange={setAnnotations}
      />
      
      <div style={{ marginTop: '20px' }}>
        <h3>Annotations Data:</h3>
        <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify(annotations, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AnnotatedExample;
import React from 'react';
import { DNASequenceViewer } from '../src';

// Basic usage example
export const BasicExample = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Basic DNA Sequence Viewer</h1>
      <DNASequenceViewer 
        initialSequence="ATGCGATCGTAGCTAGCATGCTAGCTAGCATGCTAGCTAGCATGCTAGCATGCTAGCTAGCATGCTAGCTAGCATGC"
      />
    </div>
  );
};

export default BasicExample;
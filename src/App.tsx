import { DNASequenceViewer } from './src/components/DNASequenceViewer';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <h1 className="mb-8 text-center">BioInfoViz Demo</h1>
        <DNASequenceViewer />
      </div>
    </div>
  );
}
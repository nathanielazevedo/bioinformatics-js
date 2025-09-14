import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Badge } from './ui/Badge';
import { Slider } from './ui/Slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { AnnotationManager, Annotation } from './AnnotationManager';

interface DNASequenceViewerProps {
  initialSequence?: string;
  annotations?: Annotation[];
  onAnnotationsChange?: (annotations: Annotation[]) => void;
  width?: number;
  height?: number;
  className?: string;
}

export const DNASequenceViewer: React.FC<DNASequenceViewerProps> = ({ 
  initialSequence = "ATGCGATCGTAGCTAGCATGCTAGCTAGCATGCTAGCTAGCATGCTAGCATGCTAGCTAGCATGCTAGCTAGCATGC",
  annotations: externalAnnotations,
  onAnnotationsChange,
  width = 800,
  height,
  className = ''
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [sequence, setSequence] = useState(initialSequence);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [basesPerRow, setBasesPerRow] = useState(20);
  const [scale, setScale] = useState(1);
  const [internalAnnotations, setInternalAnnotations] = useState<Annotation[]>([]);
  
  // Use external annotations if provided, otherwise use internal state
  const annotations = externalAnnotations || internalAnnotations;
  const setAnnotations = onAnnotationsChange || setInternalAnnotations;
  
  // Color mapping for DNA bases
  const baseColors = {
    'A': '#FF6B6B', // Red
    'T': '#4ECDC4', // Teal
    'G': '#45B7D1', // Blue
    'C': '#FFA726', // Orange
  };

  // Calculate sequence statistics
  const getSequenceStats = () => {
    const bases = sequence.toUpperCase().split('');
    const counts = bases.reduce((acc, base) => {
      if (base in baseColors) {
        acc[base] = (acc[base] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return { counts, total, gcContent: ((counts.G || 0) + (counts.C || 0)) / total * 100 };
  };

  const stats = getSequenceStats();

  // Find matches for search term
  const findMatches = () => {
    if (!searchTerm) return [];
    const matches = [];
    const upperSequence = sequence.toUpperCase();
    const upperSearchTerm = searchTerm.toUpperCase();
    
    for (let i = 0; i <= upperSequence.length - upperSearchTerm.length; i++) {
      if (upperSequence.substring(i, i + upperSearchTerm.length) === upperSearchTerm) {
        matches.push(i);
      }
    }
    return matches;
  };

  const matches = findMatches();

  // Sample annotations for demonstration
  const loadSampleAnnotations = () => {
    const sampleAnnotations: Omit<Annotation, 'id'>[] = [
      {
        start: 0,
        end: 20,
        label: "Gene A",
        type: "gene",
        color: "#4CAF50",
        description: "Important gene coding for protein A",
        strand: "+"
      },
      {
        start: 25,
        end: 35,
        label: "Promoter",
        type: "promoter",
        color: "#FF9800",
        description: "Regulatory sequence",
        strand: "+"
      },
      {
        start: 40,
        end: 60,
        label: "Exon 1",
        type: "exon",
        color: "#2196F3",
        description: "First exon of gene B",
        strand: "-"
      }
    ];
    
    setAnnotations(sampleAnnotations.map((ann, index) => ({
      ...ann,
      id: `sample-${index}`
    })));
  };

  // Annotation management functions
  const handleAddAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation = {
      ...annotation,
      id: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setAnnotations([...annotations, newAnnotation]);
  };

  const handleEditAnnotation = (id: string, updatedAnnotation: Omit<Annotation, 'id'>) => {
    setAnnotations(annotations.map(ann => 
      ann.id === id ? { ...updatedAnnotation, id } : ann
    ));
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  // Get annotations visible in current view
  const getVisibleAnnotations = (startPos: number, endPos: number) => {
    return annotations.filter(ann => 
      (ann.start >= startPos && ann.start < endPos) ||
      (ann.end > startPos && ann.end <= endPos) ||
      (ann.start < startPos && ann.end > endPos)
    );
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const svgWidth = width;
    const baseSize = 24 * scale;
    const rowHeight = 30 * scale;
    const annotationHeight = 20 * scale;
    const startPosition = Math.max(0, currentPosition);
    const endPosition = Math.min(sequence.length, startPosition + basesPerRow * 15); // Show 15 rows
    const visibleSequence = sequence.slice(startPosition, endPosition);
    const visibleAnnotations = getVisibleAnnotations(startPosition, endPosition);
    
    const svgHeight = height || Math.ceil(visibleSequence.length / basesPerRow) * (rowHeight + annotationHeight) + 60;
    svg.attr('width', svgWidth).attr('height', svgHeight);

    const g = svg.append('g').attr('transform', 'translate(20, 30)');

    // Create groups for each row
    const rows = [];
    for (let i = 0; i < visibleSequence.length; i += basesPerRow) {
      rows.push({
        bases: visibleSequence.slice(i, i + basesPerRow).split(''),
        startIndex: startPosition + i
      });
    }

    // Draw position numbers
    g.selectAll('.position-label')
      .data(rows)
      .enter()
      .append('text')
      .attr('class', 'position-label')
      .attr('x', -10)
      .attr('y', (d, i) => i * (rowHeight + annotationHeight) + 15)
      .attr('text-anchor', 'end')
      .style('font-size', `${10 * scale}px`)
      .style('fill', '#666')
      .text(d => d.startIndex);

    // Draw annotations first (behind the bases)
    rows.forEach((row, rowIndex) => {
      const rowAnnotations = visibleAnnotations.filter(ann => {
        const rowStart = row.startIndex;
        const rowEnd = row.startIndex + row.bases.length - 1;
        return (ann.start >= rowStart && ann.start <= rowEnd) ||
               (ann.end >= rowStart && ann.end <= rowEnd) ||
               (ann.start < rowStart && ann.end > rowEnd);
      });

      if (rowAnnotations.length > 0) {
        const annotationGroup = g.append('g')
          .attr('transform', `translate(0, ${rowIndex * (rowHeight + annotationHeight) - annotationHeight + 5})`);

        rowAnnotations.forEach((annotation, annIndex) => {
          const annStart = Math.max(annotation.start, row.startIndex);
          const annEnd = Math.min(annotation.end, row.startIndex + row.bases.length - 1);
          const relativeStart = annStart - row.startIndex;
          const relativeEnd = annEnd - row.startIndex;
          const annotationWidth = (relativeEnd - relativeStart + 1) * baseSize;

          const annGroup = annotationGroup.append('g')
            .attr('transform', `translate(${relativeStart * baseSize}, ${annIndex * 12})`);

          // Annotation background
          annGroup.append('rect')
            .attr('width', annotationWidth)
            .attr('height', 10)
            .attr('rx', 2)
            .style('fill', annotation.color)
            .style('opacity', 0.8)
            .style('stroke', annotation.color)
            .style('stroke-width', 1);

          // Annotation label (only if it fits)
          if (annotationWidth > 40) {
            annGroup.append('text')
              .attr('x', annotationWidth / 2)
              .attr('y', 7)
              .attr('text-anchor', 'middle')
              .style('font-size', `${8 * scale}px`)
              .style('fill', 'white')
              .style('font-weight', 'bold')
              .text(annotation.label);
          }

          // Strand indicator
          if (annotation.strand === '-') {
            annGroup.append('polygon')
              .attr('points', `0,0 5,5 0,10`)
              .style('fill', 'white')
              .style('opacity', 0.8);
          } else {
            annGroup.append('polygon')
              .attr('points', `${annotationWidth},0 ${annotationWidth-5},5 ${annotationWidth},10`)
              .style('fill', 'white')
              .style('opacity', 0.8);
          }

          // Tooltip
          annGroup.append('title')
            .text(`${annotation.label} (${annotation.start}-${annotation.end}) ${annotation.strand}\n${annotation.description || ''}`);
        });
      }
    });

    // Draw DNA bases
    rows.forEach((row, rowIndex) => {
      const rowGroup = g.append('g')
        .attr('transform', `translate(0, ${rowIndex * (rowHeight + annotationHeight)})`);

      rowGroup.selectAll('.base')
        .data(row.bases)
        .enter()
        .append('g')
        .attr('class', 'base')
        .attr('transform', (d, i) => `translate(${i * baseSize}, 0)`)
        .each(function(d, i) {
          const baseGroup = d3.select(this);
          const globalIndex = row.startIndex + i;
          const isMatch = matches.some(matchIndex => 
            globalIndex >= matchIndex && globalIndex < matchIndex + searchTerm.length
          );

          // Background rectangle
          baseGroup.append('rect')
            .attr('width', baseSize - 2)
            .attr('height', baseSize - 2)
            .attr('rx', 3)
            .style('fill', isMatch ? '#FFEB3B' : baseColors[d.toUpperCase() as keyof typeof baseColors] || '#gray')
            .style('opacity', isMatch ? 0.8 : 0.7)
            .style('stroke', isMatch ? '#F57F17' : 'none')
            .style('stroke-width', 2);

          // Base letter
          baseGroup.append('text')
            .attr('x', baseSize / 2)
            .attr('y', baseSize / 2 + 4)
            .attr('text-anchor', 'middle')
            .style('font-size', `${12 * scale}px`)
            .style('font-weight', 'bold')
            .style('fill', isMatch ? '#333' : 'white')
            .text(d.toUpperCase());

          // Tooltip on hover
          const tooltipText = [`Position: ${globalIndex}, Base: ${d.toUpperCase()}`];
          const baseAnnotations = annotations.filter(ann => 
            globalIndex >= ann.start && globalIndex <= ann.end
          );
          if (baseAnnotations.length > 0) {
            tooltipText.push('Annotations:');
            baseAnnotations.forEach(ann => {
              tooltipText.push(`- ${ann.label} (${ann.type})`);
            });
          }
          
          baseGroup.append('title')
            .text(tooltipText.join('\n'));
        });
    });

  }, [sequence, currentPosition, basesPerRow, scale, searchTerm, matches, annotations, width, height]);

  const sampleSequences = {
    'Sample 1': "ATGCGATCGTAGCTAGCATGCTAGCTAGCATGCTAGCTAGCATGCTAGCATGCTAGCTAGCATGCTAGCTAGCATGC",
    'Sample 2': "GGCCTTAAGGATCCGGAATTCCTGCAGCCCGGGGGATCCACTAGTTCTAGAGCGGCCGCCACCGCGGTGGAGCTC",
    'Sample 3': "AAAAAAAAAAAAAAAAAAAATTTTTTTTTTTTTTTTTTGGGGGGGGGGGGGGGGGGCCCCCCCCCCCCCCCCCC"
  };

  return (
    <div className={`w-full p-4 space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>DNA Sequence Viewer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="sequence" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sequence">Sequence View</TabsTrigger>
              <TabsTrigger value="annotations">Annotations</TabsTrigger>
            </TabsList>
            <TabsContent value="sequence" className="space-y-4">
              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block mb-2">Sample Sequences</label>
                  <Select onValueChange={(value) => setSequence(sampleSequences[value as keyof typeof sampleSequences])}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sample" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(sampleSequences).map(key => (
                        <SelectItem key={key} value={key}>{key}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block mb-2">Bases per row</label>
                  <Select value={basesPerRow.toString()} onValueChange={(value) => setBasesPerRow(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block mb-2">Scale: {scale.toFixed(1)}x</label>
                  <Slider
                    value={[scale]}
                    onValueChange={(value) => setScale(value[0])}
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-2">Search</label>
                  <Input
                    placeholder="Search sequence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => setCurrentPosition(Math.max(0, currentPosition - basesPerRow * 5))}
                  disabled={currentPosition === 0}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Position: {currentPosition + 1} - {Math.min(currentPosition + basesPerRow * 15, sequence.length)} of {sequence.length}
                </span>
                <Button 
                  onClick={() => setCurrentPosition(Math.min(sequence.length - 1, currentPosition + basesPerRow * 5))}
                  disabled={currentPosition + basesPerRow * 15 >= sequence.length}
                >
                  Next
                </Button>
              </div>

              {/* Search results */}
              {searchTerm && (
                <div className="text-sm">
                  Found {matches.length} matches for "{searchTerm}"
                  {matches.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {matches.slice(0, 10).map((position, index) => (
                        <Button
                          key={position}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPosition(Math.max(0, position - basesPerRow))}
                        >
                          {position + 1}
                        </Button>
                      ))}
                      {matches.length > 10 && <span>... and {matches.length - 10} more</span>}
                    </div>
                  )}
                </div>
              )}

              {/* Statistics */}
              <div className="flex gap-4 flex-wrap">
                <Badge variant="outline">Length: {stats.total}</Badge>
                <Badge variant="outline" style={{ backgroundColor: baseColors.A, color: 'white' }}>
                  A: {stats.counts.A || 0} ({((stats.counts.A || 0) / stats.total * 100).toFixed(1)}%)
                </Badge>
                <Badge variant="outline" style={{ backgroundColor: baseColors.T, color: 'white' }}>
                  T: {stats.counts.T || 0} ({((stats.counts.T || 0) / stats.total * 100).toFixed(1)}%)
                </Badge>
                <Badge variant="outline" style={{ backgroundColor: baseColors.G, color: 'white' }}>
                  G: {stats.counts.G || 0} ({((stats.counts.G || 0) / stats.total * 100).toFixed(1)}%)
                </Badge>
                <Badge variant="outline" style={{ backgroundColor: baseColors.C, color: 'white' }}>
                  C: {stats.counts.C || 0} ({((stats.counts.C || 0) / stats.total * 100).toFixed(1)}%)
                </Badge>
                <Badge variant="outline">GC Content: {stats.gcContent.toFixed(1)}%</Badge>
              </div>

              {/* Custom sequence input */}
              <div>
                <label className="block mb-2">Custom Sequence</label>
                <Input
                  placeholder="Enter DNA sequence (A, T, G, C)..."
                  value={sequence}
                  onChange={(e) => {
                    const cleanSequence = e.target.value.toUpperCase().replace(/[^ATGC]/g, '');
                    setSequence(cleanSequence);
                    setCurrentPosition(0);
                    setAnnotations([]); // Clear annotations when sequence changes
                  }}
                />
              </div>

              {/* Sample data buttons */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={loadSampleAnnotations}
                >
                  Load Sample Annotations
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setAnnotations([])}
                >
                  Clear All Annotations
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="annotations" className="space-y-4">
              <AnnotationManager
                annotations={annotations}
                onAddAnnotation={handleAddAnnotation}
                onEditAnnotation={handleEditAnnotation}
                onDeleteAnnotation={handleDeleteAnnotation}
                sequenceLength={sequence.length}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Visualization */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-auto border border-border rounded">
            <svg ref={svgRef}></svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
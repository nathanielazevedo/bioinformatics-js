import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/Dialog';
import { Badge } from './ui/Badge';
import { Trash2, Edit, Plus } from './ui/icons';

export interface Annotation {
  id: string;
  start: number;
  end: number;
  label: string;
  type: string;
  color: string;
  description?: string;
  strand?: '+' | '-';
}

interface AnnotationManagerProps {
  annotations: Annotation[];
  onAddAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  onEditAnnotation: (id: string, annotation: Omit<Annotation, 'id'>) => void;
  onDeleteAnnotation: (id: string) => void;
  sequenceLength: number;
}

const annotationTypes = {
  'gene': { color: '#4CAF50', label: 'Gene' },
  'promoter': { color: '#FF9800', label: 'Promoter' },
  'enhancer': { color: '#9C27B0', label: 'Enhancer' },
  'exon': { color: '#2196F3', label: 'Exon' },
  'intron': { color: '#607D8B', label: 'Intron' },
  'utr': { color: '#795548', label: 'UTR' },
  'restriction': { color: '#F44336', label: 'Restriction Site' },
  'custom': { color: '#00BCD4', label: 'Custom' }
};

export const AnnotationManager: React.FC<AnnotationManagerProps> = ({
  annotations,
  onAddAnnotation,
  onEditAnnotation,
  onDeleteAnnotation,
  sequenceLength
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState<Annotation | null>(null);
  const [formData, setFormData] = useState({
    start: '',
    end: '',
    label: '',
    type: 'gene',
    description: '',
    strand: '+' as '+' | '-'
  });

  const resetForm = () => {
    setFormData({
      start: '',
      end: '',
      label: '',
      type: 'gene',
      description: '',
      strand: '+'
    });
    setEditingAnnotation(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (annotation: Annotation) => {
    setFormData({
      start: annotation.start.toString(),
      end: annotation.end.toString(),
      label: annotation.label,
      type: annotation.type,
      description: annotation.description || '',
      strand: annotation.strand || '+'
    });
    setEditingAnnotation(annotation);
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const start = parseInt(formData.start);
    const end = parseInt(formData.end);

    if (isNaN(start) || isNaN(end) || start < 0 || end >= sequenceLength || start > end) {
      alert('Please enter valid start and end positions');
      return;
    }

    const annotation = {
      start,
      end,
      label: formData.label || `${annotationTypes[formData.type as keyof typeof annotationTypes].label} ${start}-${end}`,
      type: formData.type,
      color: annotationTypes[formData.type as keyof typeof annotationTypes].color,
      description: formData.description,
      strand: formData.strand
    };

    if (editingAnnotation) {
      onEditAnnotation(editingAnnotation.id, annotation);
    } else {
      onAddAnnotation(annotation);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3>Annotations ({annotations.length})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Annotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingAnnotation ? 'Edit Annotation' : 'Add Annotation'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="start">Start Position</Label>
                  <Input
                    id="start"
                    type="number"
                    value={formData.start}
                    onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                    placeholder="0"
                    min="0"
                    max={sequenceLength - 1}
                  />
                </div>
                <div>
                  <Label htmlFor="end">End Position</Label>
                  <Input
                    id="end"
                    type="number"
                    value={formData.end}
                    onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                    placeholder={sequenceLength.toString()}
                    min="0"
                    max={sequenceLength - 1}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(annotationTypes).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div>
                <Label htmlFor="strand">Strand</Label>
                <Select value={formData.strand} onValueChange={(value: '+' | '-') => setFormData({ ...formData, strand: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+">+ (Forward)</SelectItem>
                    <SelectItem value="-">- (Reverse)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSubmit} className="flex-1">
                  {editingAnnotation ? 'Update' : 'Add'} Annotation
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Annotation List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {annotations.map((annotation) => (
          <div key={annotation.id} className="flex items-center justify-between p-2 border border-border rounded">
            <div className="flex items-center gap-2 flex-1">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: annotation.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate">{annotation.label}</span>
                  <Badge variant="outline" className="text-xs">
                    {annotation.start}-{annotation.end}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {annotation.strand}
                  </Badge>
                </div>
                {annotation.description && (
                  <p className="text-xs text-muted-foreground truncate">
                    {annotation.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditDialog(annotation)}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteAnnotation(annotation.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {annotations.length === 0 && (
          <p className="text-muted-foreground text-center py-4">
            No annotations yet. Click "Add Annotation" to get started.
          </p>
        )}
      </div>

      {/* Legend */}
      {annotations.length > 0 && (
        <div>
          <h4 className="mb-2">Legend</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(annotationTypes)
              .filter(([type]) => annotations.some(a => a.type === type))
              .map(([type, { color, label }]) => (
                <div key={type} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
                  <span className="text-xs">{label}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
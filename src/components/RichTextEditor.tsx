
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, className }: RichTextEditorProps) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newValue = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after the formatting
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text/plain');
    
    // Preserve line breaks and basic formatting from pasted content
    const formattedText = pastedText
      .replace(/\n/g, '\n')
      .replace(/\t/g, '    '); // Convert tabs to spaces
    
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Set cursor position after the pasted content
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + formattedText.length, start + formattedText.length);
    }, 0);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2 border-b pb-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertFormatting('**', '**')}
          className="h-8 px-2"
        >
          <Bold className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertFormatting('*', '*')}
          className="h-8 px-2"
        >
          <Italic className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertFormatting('\n• ')}
          className="h-8 px-2"
        >
          <List className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => insertFormatting('\n1. ')}
          className="h-8 px-2"
        >
          <ListOrdered className="h-3 w-3" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        placeholder={placeholder}
        className={className}
        rows={6}
      />
      <div className="text-xs text-muted-foreground">
        Supports **bold**, *italic*, • bullet points, and preserves formatting from paste
      </div>
    </div>
  );
};

export default RichTextEditor;

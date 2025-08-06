import React, { useRef } from 'react';
import { TextArea } from '@progress/kendo-react-inputs';

interface SqlEditorProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (markers: any[]) => void;
  height?: string;
  readOnly?: boolean;
  theme?: 'light' | 'dark';
}

export const SqlEditor: React.FC<SqlEditorProps> = ({
  value,
  onChange,
  onValidate, // TODO: Re-implement when Monaco is fixed
  height = '400px',
  readOnly = false,
  theme // TODO: Re-implement when Monaco is fixed
}) => {
  const textAreaRef = useRef<any>(null);

  const handleChange = (e: any) => {
    onChange(e.value || '');
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="mb-2 text-sm text-gray-600">
        SQL Editor (Monaco Editor temporarily replaced with TextArea)
      </div>
      <TextArea
        ref={textAreaRef}
        value={value}
        onChange={handleChange}
        disabled={readOnly}
        rows={20}
        style={{ 
          fontFamily: 'Consolas, Monaco, monospace',
          fontSize: '14px',
          minHeight: height
        }}
        className="k-textbox"
        placeholder="Inserisci la query SQL qui..."
      />
      <div className="mt-2 text-xs text-gray-500">
        Suggerimento: Usa :parametro per definire parametri dinamici
      </div>
    </div>
  );
};
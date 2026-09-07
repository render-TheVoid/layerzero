import React, { useCallback, useState } from 'react';
import { Upload, File } from 'lucide-react';
import { cn } from '../lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept = ".pdf,.docx", className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div
      className={cn(
        "relative border border-dashed rounded-[4px] p-8 md:p-12 text-center transition-all cursor-pointer bg-surface",
        isDragging ? "border-foreground bg-secondary" : "border-border hover:border-foreground hover:bg-muted",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleFileInput}
      />
      
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className={cn("p-3 rounded-[4px] transition-colors border border-border", selectedFile ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground")}>
          {selectedFile ? <File className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
        </div>
        <div>
          {selectedFile ? (
            <>
              <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">Click to upload or drag and drop document</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX up to 10MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

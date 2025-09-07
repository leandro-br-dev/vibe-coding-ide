import React, { useRef, useState, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { updateFileContent } from '../../store/slices/editorSlice';
import { 
  configureMonacoLanguages, 
  registerCustomLanguages, 
  configureEditorThemes, 
  addCustomCompletionProviders 
} from '../../utils/monacoConfig';
import './CodeEditor.css';

interface CodeEditorProps {
  filePath?: string;
  language?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  filePath,
  language,
  value,
  onChange,
  readOnly = false
}) => {
  const dispatch = useDispatch();
  const { theme, fontSize, tabSize, wordWrap } = useSelector((state: RootState) => state.editor);
  
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);

    // Configure Monaco languages and features
    configureMonacoLanguages(monaco);
    registerCustomLanguages(monaco);
    configureEditorThemes(monaco);
    addCustomCompletionProviders(monaco);

    // Configure editor options
    editor.updateOptions({
      fontSize,
      tabSize,
      wordWrap: wordWrap ? 'on' : 'off',
      automaticLayout: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      renderLineHighlight: 'line',
      lineNumbers: 'on',
      glyphMargin: true,
      folding: true,
      // Enable IntelliSense and suggestions
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnCommitCharacter: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      quickSuggestions: {
        other: true,
        comments: true,
        strings: true
      },
      suggest: {
        snippetsPreventQuickSuggestions: false,
        showKeywords: true,
        showSnippets: true,
        showClasses: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
        showInterfaces: true,
        showModules: true,
        showProperties: true,
        showEvents: true,
        showOperators: true,
        showUnits: true,
        showValues: true,
        showConstants: true,
        showEnums: true,
        showEnumMembers: true,
        showColors: true,
        showFiles: true,
        showReferences: true,
        showFolders: true,
        showTypeParameters: true,
        showIssues: true,
        showUsers: true,
        showWords: true
      },
      // Enable bracket matching and auto-closing
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
      autoSurround: 'always',
      matchBrackets: 'always',
      // Enable parameter hints
      parameterHints: {
        enabled: true,
        cycle: true
      },
      // Enable hover
      hover: {
        enabled: true,
        delay: 300,
        sticky: true
      }
    });

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Save file shortcut
      if (filePath && value) {
        handleSaveFile();
      }
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
      // Find shortcut
      editor.getAction('actions.find').run();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
      // Replace shortcut
      editor.getAction('editor.action.startFindReplaceAction').run();
    });

    // Format document shortcut
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI, () => {
      editor.getAction('editor.action.formatDocument').run();
    });

    // Comment/uncomment lines
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.getAction('editor.action.commentLine').run();
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (onChange) {
      onChange(value);
    }
    
    if (filePath && value !== undefined) {
      dispatch(updateFileContent({ filePath, content: value, isDirty: true }));
    }
  };

  const handleSaveFile = async () => {
    if (!filePath || !value) return;

    try {
      await window.electronAPI?.writeFile({
        filePath,
        content: value,
        encoding: 'utf8'
      });
      
      dispatch(updateFileContent({ filePath, content: value, isDirty: false }));
      console.log('File saved:', filePath);
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  };

  // Detect language from file extension
  const getLanguageFromPath = (path: string): string => {
    const extension = path.split('.').pop()?.toLowerCase();
    
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'rs': 'rust',
      'php': 'php',
      'rb': 'ruby',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'json': 'json',
      'xml': 'xml',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'sql': 'sql',
      'sh': 'shell',
      'bat': 'bat',
      'dockerfile': 'dockerfile',
    };

    return languageMap[extension || ''] || 'plaintext';
  };

  const editorLanguage = language || (filePath ? getLanguageFromPath(filePath) : 'plaintext');
  const editorTheme = theme === 'dark' ? 'vibe-dark' : 'vibe-light';

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        {filePath && (
          <div className="file-info">
            <span className="file-path" title={filePath}>
              {filePath.split(/[/\\]/).pop()}
            </span>
            <span className="language-badge">{editorLanguage}</span>
          </div>
        )}
        <div className="editor-actions">
          {filePath && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={handleSaveFile}
              disabled={!isEditorReady}
              title="Save (Ctrl+S)"
            >
              💾 Save
            </button>
          )}
        </div>
      </div>
      
      <div className="monaco-editor-wrapper">
        <Editor
          height="100%"
          language={editorLanguage}
          value={value || ''}
          theme={editorTheme}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            readOnly,
            fontSize,
            tabSize,
            wordWrap: wordWrap ? 'on' : 'off',
            automaticLayout: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            lineNumbers: 'on',
            glyphMargin: true,
            folding: true,
          }}
          loading={
            <div className="editor-loading">
              <div className="loading-spinner"></div>
              <p>Loading editor...</p>
            </div>
          }
        />
      </div>
    </div>
  );
};
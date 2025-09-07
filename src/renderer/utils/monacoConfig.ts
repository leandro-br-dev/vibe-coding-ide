import { Monaco } from '@monaco-editor/react';

export const configureMonacoLanguages = (monaco: Monaco) => {
  // Configure TypeScript/JavaScript options
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React',
    allowJs: true,
    typeRoots: ['node_modules/@types']
  });

  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    allowJs: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: 'React'
  });

  // Disable TypeScript diagnostics for better performance in editor
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
    noSuggestionDiagnostics: false
  });

  // Configure JSON schema validation
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    allowComments: true,
    schemas: [
      {
        uri: 'http://json-schema.org/draft-07/schema#',
        fileMatch: ['package.json'],
        schema: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            version: { type: 'string' },
            description: { type: 'string' },
            scripts: {
              type: 'object',
              additionalProperties: { type: 'string' }
            },
            dependencies: {
              type: 'object',
              additionalProperties: { type: 'string' }
            },
            devDependencies: {
              type: 'object',
              additionalProperties: { type: 'string' }
            }
          }
        }
      },
      {
        uri: 'http://json-schema.org/tsconfig',
        fileMatch: ['tsconfig.json', 'tsconfig.*.json'],
        schema: {
          type: 'object',
          properties: {
            compilerOptions: {
              type: 'object',
              properties: {
                target: { type: 'string' },
                module: { type: 'string' },
                lib: { type: 'array', items: { type: 'string' } },
                outDir: { type: 'string' },
                rootDir: { type: 'string' },
                strict: { type: 'boolean' },
                esModuleInterop: { type: 'boolean' }
              }
            },
            include: { type: 'array', items: { type: 'string' } },
            exclude: { type: 'array', items: { type: 'string' } }
          }
        }
      }
    ]
  });

  // Configure CSS language features
  monaco.languages.css.cssDefaults.setOptions({
    validate: true,
    lint: {
      compatibleVendorPrefixes: 'ignore',
      vendorPrefix: 'warning',
      duplicateProperties: 'warning',
      emptyRules: 'warning',
      importStatement: 'ignore',
      boxModel: 'ignore',
      universalSelector: 'ignore',
      zeroUnits: 'ignore',
      fontFaceProperties: 'warning',
      hexColorLength: 'error',
      argumentsInColorFunction: 'error',
      unknownProperties: 'warning',
      ieHack: 'ignore',
      unknownVendorSpecificProperties: 'ignore',
      propertyIgnoredDueToDisplay: 'warning',
      important: 'ignore',
      float: 'ignore',
      idSelector: 'ignore'
    }
  });

  // Configure SCSS language features
  monaco.languages.scss.scssDefaults.setOptions({
    validate: true,
    lint: {
      compatibleVendorPrefixes: 'ignore',
      vendorPrefix: 'warning',
      duplicateProperties: 'warning',
      emptyRules: 'warning',
      importStatement: 'ignore',
      boxModel: 'ignore',
      universalSelector: 'ignore',
      zeroUnits: 'ignore',
      fontFaceProperties: 'warning',
      hexColorLength: 'error',
      argumentsInColorFunction: 'error',
      unknownProperties: 'warning',
      ieHack: 'ignore',
      unknownVendorSpecificProperties: 'ignore',
      propertyIgnoredDueToDisplay: 'warning',
      important: 'ignore',
      float: 'ignore',
      idSelector: 'ignore'
    }
  });

  // Configure HTML language features
  monaco.languages.html.htmlDefaults.setOptions({
    format: {
      tabSize: 2,
      insertSpaces: true,
      wrapLineLength: 120,
      unformatted: 'default"',
      contentUnformatted: 'pre,code,textarea',
      indentInnerHtml: false,
      preserveNewLines: true,
      maxPreserveNewLines: undefined,
      indentHandlebars: false,
      endWithNewline: false,
      extraLiners: 'head, body, /html',
      wrapAttributes: 'auto'
    },
    suggest: { html5: true },
    validate: true
  });
};

export const registerCustomLanguages = (monaco: Monaco) => {
  // Register Log file language
  monaco.languages.register({ id: 'log' });
  monaco.languages.setMonarchTokensProvider('log', {
    tokenizer: {
      root: [
        [/^\d{4}-\d{2}-\d{2}/, 'date'],
        [/\d{2}:\d{2}:\d{2}/, 'time'],
        [/ERROR.*/, 'error'],
        [/WARN.*/, 'warning'],
        [/INFO.*/, 'info'],
        [/DEBUG.*/, 'debug'],
        [/\[.*?\]/, 'bracket'],
        [/".*?"/, 'string']
      ]
    }
  });

  monaco.editor.defineTheme('log-theme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'date', foreground: '0066cc', fontStyle: 'bold' },
      { token: 'time', foreground: '666666' },
      { token: 'error', foreground: 'cc0000', fontStyle: 'bold' },
      { token: 'warning', foreground: 'ff8800' },
      { token: 'info', foreground: '0066cc' },
      { token: 'debug', foreground: '666666' },
      { token: 'bracket', foreground: '888888' },
      { token: 'string', foreground: '22aa22' }
    ],
    colors: {}
  });

  // Register Dockerfile language improvements
  monaco.languages.setLanguageConfiguration('dockerfile', {
    comments: {
      lineComment: '#'
    },
    brackets: [
      ['{', '}'],
      ['[', ']'],
      ['(', ')']
    ],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" }
    ]
  });
};

export const configureEditorThemes = (monaco: Monaco) => {
  // Define custom light theme
  monaco.editor.defineTheme('vibe-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'string', foreground: 'A31515' },
      { token: 'number', foreground: '098658' },
      { token: 'regexp', foreground: '811F3F' },
      { token: 'type', foreground: '267F99' },
      { token: 'class', foreground: '267F99' },
      { token: 'interface', foreground: '267F99' },
      { token: 'enum', foreground: '267F99' },
      { token: 'function', foreground: '795E26' },
      { token: 'variable', foreground: '001080' },
      { token: 'constant', foreground: '0070C1' }
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#000000',
      'editor.selectionBackground': '#ADD6FF4D',
      'editor.lineHighlightBackground': '#0000000A',
      'editorCursor.foreground': '#000000',
      'editorWhitespace.foreground': '#BFBFBF'
    }
  });

  // Define custom dark theme
  monaco.editor.defineTheme('vibe-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'regexp', foreground: 'D16969' },
      { token: 'type', foreground: '4EC9B0' },
      { token: 'class', foreground: '4EC9B0' },
      { token: 'interface', foreground: '4EC9B0' },
      { token: 'enum', foreground: '4EC9B0' },
      { token: 'function', foreground: 'DCDCAA' },
      { token: 'variable', foreground: '9CDCFE' },
      { token: 'constant', foreground: '4FC1FF' }
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4',
      'editor.selectionBackground': '#264F78',
      'editor.lineHighlightBackground': '#2F2F2F',
      'editorCursor.foreground': '#AEAFAD',
      'editorWhitespace.foreground': '#404040'
    }
  });
};

export const addCustomCompletionProviders = (monaco: Monaco) => {
  // React/JSX snippets
  monaco.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        {
          label: 'React Function Component',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Create a React functional component',
          insertText: [
            'import React from \'react\';',
            '',
            'interface ${1:ComponentName}Props {',
            '  ${2:prop}: ${3:string};',
            '}',
            '',
            'export const ${1:ComponentName}: React.FC<${1:ComponentName}Props> = ({ ${2:prop} }) => {',
            '  return (',
            '    <div>',
            '      ${4:/* Component content */}',
            '    </div>',
            '  );',
            '};'
          ].join('\n'),
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          },
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'useState Hook',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'React useState hook',
          insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState(${2:initialValue});',
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          },
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'useEffect Hook',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'React useEffect hook',
          insertText: [
            'useEffect(() => {',
            '  ${1:// Effect logic}',
            '  ',
            '  return () => {',
            '    ${2:// Cleanup logic}',
            '  };',
            '}, [${3:dependencies}]);'
          ].join('\n'),
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          },
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }
      ];

      return { suggestions };
    }
  });

  // Common JavaScript snippets
  monaco.languages.registerCompletionItemProvider(['javascript', 'typescript'], {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        {
          label: 'console.log',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Console log statement',
          insertText: 'console.log(${1:value});',
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          },
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'try-catch',
          kind: monaco.languages.CompletionItemKind.Snippet,
          documentation: 'Try-catch block',
          insertText: [
            'try {',
            '  ${1:// Try block}',
            '} catch (error) {',
            '  ${2:// Error handling}',
            '  console.error(error);',
            '}'
          ].join('\n'),
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column,
            endColumn: position.column
          },
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }
      ];

      return { suggestions };
    }
  });
};
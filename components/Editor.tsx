import SplitPane from 'react-split-pane';
import MonacoEditor from '@monaco-editor/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { debounce } from '../helpers/debounce';

const defaultValue = `config:
  target: "https://example.com/api"
  phases:
    - duration: 60
      arrivalRate: 5
      name: Warm up
    - duration: 120
      arrivalRate: 5
      rampTo: 50
      name: Ramp up load
    - duration: 60
      arrivalRate: 50
      name: Sustained load
  # Artillery viewer not support payload yet.
  payload:
    path: "keywords.csv"
    fields:
      - "keyword"

scenarios:
  - name: "Search and buy"
    flow:
      - post:
          url: "/search"
          json:
            kw: "{{ keyword }}"
          capture:
            - json: "$.results[0].id"
              as: "productId"
      - get:
          url: "/product/{{ productId }}/details"
      - think: 5
      - post:
          url: "/cart"
          json:
            productId: "{{ productId }}"
`;

const Editor: React.FC = () => {
  // todo -> global state
  const [editorTxt, setEditorTxt] = useState(defaultValue);

  return (
    <div className="flex flex-1 overflow-hidden">
      <MonacoEditor
        height="100vh"
        defaultLanguage="yaml"
        defaultValue={defaultValue}
        value={editorTxt}
        onChange={debounce((value) => {
          console.log(value);
          if (value) {
            setEditorTxt(value);
          }
        }, 100)}
        theme="vs-dark"
        options={{
          wordWrap: 'on',
          smoothScrolling: true,
        }}
      />
    </div>
  );
};

export default Editor;

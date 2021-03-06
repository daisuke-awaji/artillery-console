import type { NextPage } from 'next';
import Layout from '../../components/Layout';

import { useEffect, useState } from 'react';
import * as yaml from 'js-yaml';

import { Validator } from 'jsonschema';
import SplitPane, { Pane } from 'react-split-pane';
import ArtilleryScenarioChart from '../../components/ArtilleryScenarioChart';
import ScenariosDiagram from '../../components/ScenariosDiagram';
import { debounce } from '../../helpers/debounce';
import Editor from '../../components/Editor';

const v = new Validator();
const schema = {
  id: 'scenario schema',
  type: 'object',
  properties: {
    config: {
      id: 'config',
      type: 'object',
      properties: {
        phases: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              duration: { type: 'number' },
              arrivalRate: { type: 'number' },
              name: { type: 'string' },
              rampTo: { type: 'number' },
              pause: { type: 'number' },
            },
          },
        },
      },
    },
  },
  required: ['config'],
};

const PLACE_HOLDER_INPUT = `config:
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

const ArtilleryViewer: NextPage = () => {
  const [input, setInput] = useState(PLACE_HOLDER_INPUT);

  const [phases, setPhases] = useState([]);
  useEffect(() => {
    let json: any;
    try {
      json = yaml.load(input);
    } catch (e) {
      console.log(e);
      return;
    }

    v.addSchema(schema);
    const validationResult = v.validate(json, schema);
    if (!validationResult.errors.length) {
      setPhases(json?.config?.phases ?? []);
      console.log(json);
    }
  }, [input]);

  const [size, setSize] = useState(100);
  useEffect(() => {
    const s = parseInt(localStorage.getItem('splitPos') ?? '680');
    setSize(s);
  }, []);

  const [editorTxt, setEditorTxt] = useState(PLACE_HOLDER_INPUT);

  return (
    <Layout>
      <div className="flex flex-1 flex-row relative h-screen border-neutral-700 bg-neutral-800">
        <SplitPane
          minSize={100}
          // pane1Style={navigationEnabled || editorEnabled ? undefined : { width: '0px' }}
          // pane2Style={viewEnabled ? { overflow: 'auto' } : { width: '0px' }}
          primary={'first'}
          defaultSize={size}
          onChange={debounce((size: string) => {
            localStorage.setItem('splitPos', String(size));
          }, 100)}
        >
          <Pane className="text-white h-screen border-neutral-700 bg-neutral-800">
            <Editor />
          </Pane>
          <SplitPane className="w-auto bg-zinc-50 h-screen" split="horizontal" defaultSize={300}>
            <ArtilleryScenarioChart phases={phases} />

            <ScenariosDiagram />
          </SplitPane>

          {/* <div className="h-screen">hey</div> */}
          {/* {navigationAndEditor} */}
          {/* {viewType === 'template' && <Template />} */}
          {/* {viewType === 'visualiser' && <VisualiserTemplate />} */}
        </SplitPane>
      </div>
    </Layout>
  );
};

export default ArtilleryViewer;

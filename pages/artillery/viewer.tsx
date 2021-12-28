import type { NextPage } from 'next';
import Image from 'next/image';
import Layout from '../../components/Layout';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';

import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism.css';

import { useEffect, useState } from 'react';
import ArtilleryScenarioChart from '../../components/ArtilleryScenarioChart';
import * as yaml from 'js-yaml';

import { Validator } from 'jsonschema';
import Link from 'next/link';
import ScenariosDiagram from '../../components/ScenariosDiagram';
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
    }
  }, [input]);

  return (
    <Layout>
      <div className="grid gap-4 lg:grid-cols-2 md:grid-cols-1 min-h-full">
        <div className="m-2 h-screen">
          <h2 className="text-lg">Input your scenario.yml</h2>
          <Editor
            value={input}
            onValueChange={(code) => setInput(code)}
            highlight={(code) => highlight(code, languages.yaml, 'yaml')}
            placeholder={PLACE_HOLDER_INPUT}
            padding={10}
            ignoreTabKey={false}
            onBlur={() => {
              // setSqlInput(formatter === 'none' ? sqlInput : format(sqlInput, { language: formatter as any }));
            }}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
              outline: 'solid 1px',
              outlineColor: 'rgb(64, 44, 27, .6)',
              width: '100%',
              minHeight: '90vh',
              backgroundColor: 'rgba(250, 247, 237, 0.7)',
              borderRadius: '0.25rem',
            }}
            className="border-pink-400"
          />
        </div>

        <div className="m-2 w-auto">
          <h2 className="text-lg">visualizer</h2>
          <div className="border border-pink-400 rounded-lg">
            <ArtilleryScenarioChart phases={phases} />
          </div>
          <div className="border border-pink-400 rounded-lg my-4">
            <ScenariosDiagram />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtilleryViewer;

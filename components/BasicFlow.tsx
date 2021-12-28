import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  Elements,
  FlowElement,
  Handle,
  MiniMap,
  Position,
} from 'react-flow-renderer';

type ArtilleryCustomNodeComponentProps = {
  url?: string;
  method?: HTTPMethod;
  json?: object;
  body?: object;
  header?: object;
  cookie?: object;
  capture?: object;
};

const elements: Elements<ArtilleryCustomNodeComponentProps> = [
  {
    id: '1',
    data: {
      url: '/search',
      json: {
        kw: '{{ keyword }}',
        id: '{{ id }}',
        user: {
          name: '{{ userName }}',
          email: '{{ userEmail }}',
        },
      },
      method: 'POST',
      capture: [
        {
          json: '$.results[0].id',
          as: 'productId',
        },
      ],
    },
    position: { x: 100, y: 5 },
    type: 'special', // input node
  },
  {
    id: '2',
    data: { url: '/product/{{ productId }}/details', method: 'GET' },
    position: { x: 100, y: 220 },
    type: 'special',
  },
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'special' },
  {
    id: '3',
    data: { url: '/cart', json: { productId: '{{ productId }}' }, method: 'DELETE' },
    position: { x: 100, y: 300 },
    type: 'special',
  },
  { id: 'e2-3', source: '2', target: '3', animated: true, type: 'special' },
  {
    id: '4',
    data: { url: '/cart', json: { productId: '{{ productId }}' }, method: 'PUT' },
    position: { x: 100, y: 450 },
    type: 'special',
  },
  { id: 'e3-4', source: '3', target: '4', animated: true, type: 'special' },
];

const flowStyles = { height: 1000 };

type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';

const HTTPMethodLabel: React.FC<{ method: HTTPMethod; className: string }> = ({
  method,
  className,
}) => {
  const classes: { [key in HTTPMethod]?: string } = {
    GET: 'bg-green-500',
    POST: 'bg-blue-500',
    PUT: 'bg-purple-500',
    DELETE: 'bg-red-500',
  };

  return (
    <div
      className={
        className + ' ' + 'w-fit rounded-sm h-fit text-white text-xs' + ' ' + classes[method]
      }
    >
      {method}
    </div>
  );
};

const CustomNodeComponent: React.FC<FlowElement<ArtilleryCustomNodeComponentProps>> = ({
  data,
}) => {
  return (
    <div className="border p-1 rounded min-w-full min-h-32 border-black">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center mb-1 justify-left">
        <HTTPMethodLabel method={data?.method ?? 'GET'} className="p-1" />
        <span className="p-1">{data?.url}</span>
      </div>

      <div className="flex items-stretch">
        {data?.json ? (
          <div className="text-xs border">
            <div className=" bg-slate-500 w-fit text-white p-1">json</div>
            <pre className="p-1">{JSON.stringify(data?.json, null, 2)}</pre>
          </div>
        ) : null}

        {data?.capture ? (
          <div className="text-xs border">
            <div className=" bg-slate-500 w-fit text-white p-1">capture</div>
            <pre className="p-1">{JSON.stringify(data?.capture, null, 2)}</pre>
          </div>
        ) : null}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
const nodeTypes = {
  special: CustomNodeComponent,
};

const BasicFlow = () => (
  <ReactFlow elements={elements} style={flowStyles} nodeTypes={nodeTypes}>
    <MiniMap />
    <Controls />
    <Background />
  </ReactFlow>
);

export default BasicFlow;

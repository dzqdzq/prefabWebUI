import React, { useContext } from 'react';
import { ColorPicker, InputNumber, Row, Col } from 'antd';
import { MyContext } from '../MyContext';

interface NodePanelProps {}

const NodeDatas = [
  {
    title: 'Position',
    con: [
      {
        title: 'X',
        type: 'InputNumber',
        value: (nodeData) => nodeData._position[0],
      },
      {
        title: 'Y',
        type: 'InputNumber',
        value: (nodeData) => nodeData._position[1],
      },
    ],
  },
  {
    title: 'Rotation',
    con: {
      type: 'InputNumber',
      value: (nodeData) => -nodeData._eulerAngles[2],
    },
  },
  {
    title: 'Scale',
    con: [
      {
        title: 'X',
        type: 'InputNumber',
        value: (nodeData) => nodeData._scale[0],
      },
      {
        title: 'Y',
        type: 'InputNumber',
        value: (nodeData) => nodeData._scale[1],
      },
    ],
  },
  {
    title: 'Anchor',
    con: [
      {
        title: 'X',
        type: 'InputNumber',
        value: (nodeData) => nodeData._anchorPoint[0],
      },
      {
        title: 'Y',
        type: 'InputNumber',
        value: (nodeData) => nodeData._anchorPoint[1],
      },
    ],
  },
  {
    title: 'Size',
    con: [
      {
        title: 'W',
        type: 'InputNumber',
        value: (nodeData) => nodeData._contentSize[0],
      },
      {
        title: 'H',
        type: 'InputNumber',
        value: (nodeData) => nodeData._contentSize[1],
      },
    ],
  },
  {
    title: 'Color',
    con: {
      type: 'ColorPicker',
      value: (nodeData) => {
        const [r, g, b, a] = nodeData._color;
        return { r, g, b, a };
      },
    },
  },
  {
    title: 'Opacity',
    con: { type: 'InputNumber', value: (nodeData) => nodeData._opacity },
  },
  {
    title: 'Skew',
    con: [
      {
        title: 'X',
        type: 'InputNumber',
        value: (nodeData) => nodeData._skewX,
      },
      {
        title: 'Y',
        type: 'InputNumber',
        value: (nodeData) => nodeData._skewY,
      },
    ],
  },
  {
    title: 'Group',
    con: { type: 'InputNumber', value: (nodeData) => nodeData._groupIndex },
  },
];

// 根据类型创建组件
function createComponentByType(conItem, nodeData) {
  switch (conItem.type) {
    case 'InputNumber':
      return (
        <InputNumber
          size={'small'}
          style={{ width: '100%', margin: '2px 2px 8px 0px' }}
          value={
            typeof conItem.value === 'function' && nodeData
              ? conItem.value(nodeData)
              : conItem.value
          }
        />
      );
    case 'ColorPicker':
      return (
        <ColorPicker
          size='small'
          value={nodeData ? conItem.value(nodeData) : '#00000'}
        />
      );
    default:
      return '';
  }
}

function createConOne(conItem, span = 16, nodeData, key) {
  if (Array.isArray(conItem)) {
    const span2 = span / conItem.length;
    return conItem.map((item, i) =>
      createConOne(item, span2, nodeData, key + i)
    );
  }
  return (
    <Col key={key} span={span} style={{ display: 'flex' }}>
      {conItem.title && (
        <label style={{ marginTop: '3px' }}>{conItem.title}</label>
      )}
      {createComponentByType(conItem, nodeData)}
    </Col>
  );
}

function getNodePanalFromData(nodeData) {
  return NodeDatas.map((item, i) => {
    return (
      <Row key={i}>
        <Col span={6} style={{ display: 'flex' }}>
          <label style={{ marginTop: '3px' }}>{item.title}</label>
        </Col>
        {createConOne(item.con, 16, nodeData, item.title)}
      </Row>
    );
  });
}

const NodePanel: React.FC = () => {
  // @ts-ignore
  const { node: nodeData } = useContext(MyContext);
  if (!nodeData || Object.keys(nodeData).length === 0 || nodeData.length === 0)
    return <div></div>;
  return <div>{getNodePanalFromData(nodeData)}</div>;
};

export default NodePanel;

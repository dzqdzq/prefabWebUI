import React, { useContext } from 'react';
import { Input, Row, Col } from 'antd';
import { getAnyName } from '@/utils/utils.js';

interface CustomComponentProps {
  compData: object;
}

const filterKeys = {
  _name: true,
  __type__: true,
  _objFlags: true,
  _enabled: true,
  _id: true,
  node: true,
};

function createConOne(conItem, span = 16, key) {
  if (Array.isArray(conItem)) {
    const span2 = span / conItem.length;
    return conItem.map((item, i) => createConOne(item, span2, `${key}@${i}`));
  }
  let title = '';
  if (conItem) {
    if (conItem.hasOwnProperty('__id__')) {
      const realCompData = conItem ? PrefabData[conItem.__id__] : null;
      title = realCompData ? getAnyName(realCompData, PrefabData) : '';
    } else {
      title = conItem.toString();
    }
  } else {
    title = 'null';
  }

  return (
    <Col key={Math.random()} span={span} style={{ display: 'flex' }}>
      {key && <label style={{ marginTop: '3px' }}>{key}</label>}
      <Input
        size={'small'}
        style={{ width: '100%', margin: '2px 2px 8px 0px' }}
        value={title}
      />
    </Col>
  );
}

function createConArr(conItem, span = 16, key) {
  const title = '';
  // if (conItem) {
  //   if (conItem.hasOwnProperty('__id__')) {
  //     const realCompData = conItem ? PrefabData[conItem.__id__] : null;
  //     title = realCompData ? getAnyName(realCompData, PrefabData) : '';
  //   } else {
  //     title = conItem.toString();
  //   }
  // } else {
  //   title = 'null';
  // }

  return (
    <Col key={Math.random()} span={span} style={{ display: 'flex' }}>
      {key && <label style={{ marginTop: '3px' }}>{key}</label>}
      <Input
        size={'small'}
        style={{ width: '100%', margin: '2px 2px 8px 0px' }}
        value={conItem.length}
      />
    </Col>
  );
}

const CustomComponent: React.FC<CustomComponentProps> = (
  props: CustomComponentProps
) => {
  const { compData } = props;
  const comps = [];
  for (const key in compData) {
    if (!filterKeys[key]) {
      if (Array.isArray(compData[key])) {
        comps.push(createConArr(compData[key], 16, key));
      } else {
        comps.push(createConOne(compData[key], 16, key));
      }
    }
  }
  return <div>{comps}</div>;
};

export default CustomComponent;

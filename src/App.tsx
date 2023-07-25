import React from 'react';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import Left from './left';
import NodePanel from './component/NodePanel';
import { Card, Checkbox, Collapse, CollapseProps, TreeProps } from 'antd';
import { MyContext } from './MyContext';
import CustomComponent from './component/CustomComponent';
import { isCustomComp } from './utils/utils';

const App: React.FC = () => {
  const [node, setNode] = React.useState<{ title?: string; _active?: boolean }>(
    {}
  );

  const text = (
    <p style={{ paddingLeft: 24 }}>
      A dog is a type of domesticated animal. Known for its loyalty and
      faithfulness, it can be found as a welcome guest in many households across
      the world.
    </p>
  );

  // 创建组件
  const createComponents = (node) => {
    const _components = node._components;
    if (!_components) return [];
    return _components.map((item, i) => {
      const data = PrefabData[item.__id__];
      console.log('node', data._enabled, data);
      let children = <div></div>;
      if (isCustomComp(data)) {
        children = <CustomComponent compData={data} />;
      } else {
      }
      return {
        key: i + 1,
        label: <Checkbox checked={data._enabled}>{node.__type__}</Checkbox>,
        children,
      };
    });
  };

  const items: CollapseProps['items'] = [
    {
      key: 0,
      label: (
        <Checkbox checked={node._active}>
          {(node.title || 'null') + '<Node>'}
        </Checkbox>
      ),
      children: <NodePanel />,
    },
    ...createComponents(node),
  ];

  const onSelectNode: TreeProps['onSelect'] = (keys, info: { node }) => {
    console.log('Trigger Select', keys, info);
    setNode(info.node);
  };

  return (
    <MyContext.Provider value={{ node, setNode }}>
      <div style={{ height: '100vh' }}>
        <Allotment defaultSizes={[200, 600]}>
          <Allotment.Pane minSize={200} maxSize={200}>
            <Left onSelect={onSelectNode} />
          </Allotment.Pane>
          <Allotment.Pane minSize={200} maxSize={600}>
            <Collapse
              activeKey={Array.from({ length: items.length }, (_, i) => i)}
              items={items}
              bordered={false}
            />
          </Allotment.Pane>
        </Allotment>
      </div>
    </MyContext.Provider>
  );
};
export default App;

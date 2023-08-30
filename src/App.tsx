import React from "react";
import Left from "./left";
import NodePanel from "./component/NodePanel";
import { Descriptions, DescriptionsProps,Checkbox, Collapse, CollapseProps, TreeProps } from "antd";
import { MyContext } from "./MyContext";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { isCustomComp } from "./utils/utils";

function getReactJson(name, data) {
  const items = [];
  Object.entries(data).forEach(([key, value]) => {
    if(key === '_id'){
      return;
    }
    items.push({
      key,
      label: key,
      children: typeof value=='object' ? JSON.stringify(value) : String(value),
    });
  });
  return <Descriptions bordered column={1} items={items} />;
}

const App: React.FC = () => {
  const [width, setWidth] = React.useState(200);
  const [height, setHeight] = React.useState(200);
  const [width1, setWidth1] = React.useState(200);
  const [height1, setHeight1] = React.useState(200);
  const [node, setNode] = React.useState<{
    title?: string;
    _active?: boolean;
    [key: string]: boolean | string | number | string[] | number[];
  }>({});

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
      console.log("node", data._enabled, data);
      let children = <div></div>;
      if (isCustomComp(data)) {
        const clone = { ...data };
        delete clone.__type__;
        delete clone._name;
        delete clone._objFlags;
        delete clone.node;
        children = getReactJson(data.__type__, clone);
      } else {
        const clone = { ...data };
        delete clone.__type__;
        delete clone._name;
        delete clone._objFlags;
        delete clone.node;
        children = getReactJson(data.__type__, clone);
      }
      return {
        key: i + 1,
        label: <Checkbox checked={data._enabled}>{data.__type__}</Checkbox>,
        children,
      };
    });
  };

  let items: CollapseProps["items"];
  if (node._position) {
    items = [
      {
        key: 0,
        label: (
          <Checkbox checked={node._active}>{(node.title || "null")+"<cc.Node>"}</Checkbox>
        ),
        children: getReactJson("cc.Node", {
          x: node._position[0],
          y: node._position[1],
          width: node._contentSize[0],
          height: node._contentSize[1],
          anchorX: node._anchorPoint[0],
          anchorY: node._anchorPoint[1],
          scaleX: node._scale[0],
          scaleY: node._scale[1],
          rotation: node._eulerAngles[2],
          opacity: node._opacity,
          color: node._color,
        }),
      },
      ...createComponents(node),
    ];
  } else {
    items = [];
  }

  const onSelectNode: TreeProps["onSelect"] = (keys, info: { node }) => {
    console.log("Trigger Select", keys, info);
    setNode(info.node);
  };

  return (
    <MyContext.Provider value={{ node, setNode }}>
      <Allotment proportionalLayout>
        <Allotment.Pane minSize={200} maxSize={400} preferredSize={300}>
          <Left onSelect={onSelectNode} />
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          <Collapse
            style={{ overflow: 'auto', height: '100vh' }}
            activeKey={Array.from({ length: items.length }, (_, i) => i)}
            items={items}
            bordered={false}
          />
        </Allotment.Pane>
      </Allotment>
    </MyContext.Provider>
  );
};
export default App;

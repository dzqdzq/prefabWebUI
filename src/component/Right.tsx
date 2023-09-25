import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Checkbox, Descriptions, Collapse } from "antd";

const Right = ({ node }) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);

  useEffect(() => {
    if(node) {
      setActiveKey(Array.from({ length: node._components.length+1 }).map((_, i) => String(i)));
    }
  }, [node]);

  const getReactJson = useCallback((data) => {
    const items = [];
    Object.entries(data).forEach(([key, value]) => {
      if (key === "_id") {
        return;
      }
      items.push({
        key,
        label: key,
        children:
          typeof value == "object" ? JSON.stringify(value) : String(value),
      });
    });
    return <Descriptions bordered column={2} colon items={items} />;
  }, []);

  const handlePanelChange = (key: string | string[]) => {
    setActiveKey(Array.isArray(key) ? key : [key]);
  };

  if (!node) {
    return <div></div>;
  }

  // 创建组件
  const createComponents = (node) => {
    const _components = node._components;
    if (!_components) return [];
    return _components.map((item, i) => {
      const data = PrefabData[item.__id__];
      const clone = { ...data };
      delete clone.__type__;
      delete clone._name;
      delete clone._objFlags;
      delete clone.node;
      const children = getReactJson(clone);
      return {
        key: i + 1,
        label: <Checkbox checked={data._enabled}>{data.__type__}</Checkbox>,
        children,
      };
    });
  };

  const items = [
    {
      key: 0,
      label: (
        <Checkbox checked={node._active}>
          {(node.title || "null") + "<cc.Node>"}
        </Checkbox>
      ),
      children: getReactJson({
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

  return (
    <Collapse
      style={{ overflow: "auto", height: "100vh" }}
      activeKey={activeKey}
      items={items}
      bordered={false}
      size="small"
      onChange={handlePanelChange}
    />
  );
};

export default Right;

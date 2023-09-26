import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Checkbox, Descriptions, Collapse } from "antd";

interface DataItem {
  __id__?: number;
}

interface Props {
  data: DataItem | DataItem[];
  onIdClick: (id: number) => void;
}

const IdList: React.FC<Props> = ({ data, onIdClick }) => {
  if(!data){
    return <div></div>
  }
  if(!Array.isArray(data)){
    data = [data];
  }

  const handleIdClick = (id: number) => {
    onIdClick(id);
  };
  // console.log(data);
  return (
    <div>
      {data.map((item) => (
        item.__id__ ? ( <a key={item.__id__} onClick={() => handleIdClick(item.__id__)}>
          {`__id__:${item.__id__ }`}
        </a>) : JSON.stringify(item)
      ))}
    </div>
  );
};

const Right = ({ node, onIdClick }) => {
  const [activeKey, setActiveKey] = useState<string[]>([]);
  if(node){
    node = window.PrefabData.getNodeFromId(node.key);
  }
  useEffect(() => {
    if(node) {
      setActiveKey(Array.from({ length: node.data._components.length+1 }).map((_, i) => String(i)));
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
          typeof value == "object" ? <IdList data={value} onIdClick={onIdClick}/> : String(value),
      });
    });
    return <Descriptions bordered column={2} colon items={items} />;
  }, [onIdClick]);

  const handlePanelChange = (key: string | string[]) => {
    setActiveKey(Array.isArray(key) ? key : [key]);
  };

  if (!node) {
    return <div></div>;
  }

  // 创建组件
  const createComponents = (node) => {
    const _components = node.comps;
    if (!_components) return [];
    return _components.map((item, i) => {
      const data = window.PrefabData.getCompFromId(item.id).data;
      const children = getReactJson(data);
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
        <Checkbox checked={node.data._active}>
          {(node.title || "null") + "<cc.Node>"}
        </Checkbox>
      ),
      children: getReactJson({
        x: node.data._position[0],
        y: node.data._position[1],
        width: node.data._contentSize[0],
        height: node.data._contentSize[1],
        anchorX: node.data._anchorPoint[0],
        anchorY: node.data._anchorPoint[1],
        scaleX: node.data._scale[0],
        scaleY: node.data._scale[1],
        rotation: node.data._eulerAngles[2],
        opacity: node.data._opacity,
        color: node.data._color,
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
      onChange={handlePanelChange}
    />
  );
};

export default Right;

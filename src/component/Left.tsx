import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Input, Layout, Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";

const { Search } = Input;

type OnSelectType = TreeProps["onSelect"];

type SelectInfoType = Parameters<OnSelectType>[1];

interface LeftProps {
  onSelect: OnSelectType;
  treeData: DataNode[];
}

const Left = forwardRef((props: LeftProps, ref) => {
  const [treeData, setTreeData] = React.useState<DataNode[]>(props.treeData);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");


  let treeDataMap = {};
  if(treeData){
    const map = {};
    const Q = [...treeData];
    while (Q.length) {
      const node = Q.shift();
      if (node.children) {
        Q.push(...node.children);
      }
      map[node.key] = node;
    }
    treeDataMap = map;
  }
  
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};
  
  const onSelect: OnSelectType = (keys, info: SelectInfoType) => {
    if (keys.length === 0) return;
    setSelectedKeys(keys);
    props.onSelect(keys, info);
  }; // end onSelect

  const handleIdClick = (id: number) => {
    if(treeData){
      let node = treeDataMap[id];
      if(!node){
        node = treeDataMap[window.PrefabData.getNodeFromId(id).id];
      }
      if (node && !node.style) {
        node.style = { backgroundColor: "blue" };

        // setSelectedKeys(window.PrefabData.getAllParentKey(node));
        // 如果tree item 不在可视区域内，需要滚动到可视区域内
        const dom = document.querySelector(`.my-tree li[data-key="${node.key}"]`);
        if(dom){
          dom.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        setTimeout(() => {
          delete node.style;
          setTreeData([...treeData]);
        }, 300);
        setTreeData([...treeData]);
      }
    }
  };

  useEffect(() => {
    setTreeData(props.treeData);
  }, [props.treeData]);

  useImperativeHandle(ref, () => ({
    handleIdClick,
  }));

  const onExpand: TreeProps["onExpand"] = (
    expandedKeysValue: React.Key[],
    info
  ) => {
    // console.log("onExpand", expandedKeysValue, info);
    // setExpandedKeys([...expandedKeysValue]);
  };

  if (!treeData.length) {
    return <div></div>;
  }

  return (
    <div>
      <Search placeholder="Search" onChange={onChange} />
      <Tree
        style={{
          marginTop: 10,
          marginBottom: 10,
          whiteSpace: "nowrap",
          overflow: "auto",
          height: "calc(100vh - 60px)",
        }}
        autoExpandParent
        defaultExpandParent
        className="my-tree"
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        // expandedKeys={expandedKeys}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
    </div>
  );
});

export default Left;

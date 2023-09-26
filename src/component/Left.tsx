import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Input, Layout, Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";
import {walk} from '../utils/prefab.mjs';

const { Search } = Input;

type OnSelectType = TreeProps["onSelect"];

type SelectInfoType = Parameters<OnSelectType>[1];

interface LeftProps {
  onSelect: OnSelectType;
  treeData: DataNode[];
}

const Left = forwardRef((props: LeftProps, ref) => {
  const [treeData, setTreeData] = React.useState<DataNode[]>(props.treeData);
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

        // 所有的父节点展开
        const parentKeys = window.PrefabData.getAllParentKey(window.PrefabData.getNodeFromId(id));
        setExpandedKeys(Array.from(new Set(parentKeys.concat(expandedKeys))));

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
    if(props.treeData && props.treeData.length){
      const keys = [];
      walk(props.treeData[0], (node) => {
        keys.push(node.key);
      });
      setExpandedKeys(keys);
    }
  }, [props.treeData]);

  useImperativeHandle(ref, () => ({
    handleIdClick,
  }));

  const onExpand: TreeProps["onExpand"] = (
    expandedKeysValue: React.Key[],
    info
  ) => {
    setExpandedKeys(expandedKeysValue);
  };

  if (!treeData.length) {
    return <div></div>;
  }

  console.log('dddd')
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
        className="my-tree"
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        treeData={treeData}
      />
    </div>
  );
});

export default Left;

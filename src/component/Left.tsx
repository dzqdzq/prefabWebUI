import React, { useState } from "react";
import { Input, Layout, Tree } from "antd";
import type { DataNode, TreeProps } from "antd/es/tree";

const { Search } = Input;

type OnSelectType = TreeProps["onSelect"];

type SelectInfoType = Parameters<OnSelectType>[1];

interface LeftProps {
  onSelect: OnSelectType;
  treeData: DataNode[];
}

const Left: React.FC<LeftProps> = (props: LeftProps) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const { treeData } = props;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const onSelect: OnSelectType = (keys, info: SelectInfoType) => {
    if (keys.length === 0) return;
    setSelectedKeys(keys);
    props.onSelect(keys, info);
  }; // end onSelect

  const onExpand: TreeProps["onExpand"] = (
    expandedKeysValue: React.Key[],
    info
  ) => {
    console.log("onExpand", expandedKeysValue, info);
    setExpandedKeys([...expandedKeysValue]);
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
        className="my-tree"
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
    </div>
  );
};

export default Left;

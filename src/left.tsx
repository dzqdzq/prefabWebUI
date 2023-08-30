import React, { useMemo, useState, useEffect } from 'react';
import { Input, Layout, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import { walk, convertPrefabToNodeTree } from './utils/parse';

const { Search } = Input;

type OnSelectType = TreeProps['onSelect'];

type SelectInfoType = Parameters<OnSelectType>[1];

interface LeftProps {
  onSelect: OnSelectType;
}

const Left: React.FC<LeftProps> = (props: LeftProps) => {
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const { value } = e.target;
    // setSearchValue(value);
    // const filterTreeData = (data: DataNode[]): DataNode[] => {
    //   return data
    //     .map((node) => {
    //       if (node.children) {
    //         const children = filterTreeData(node.children);
    //         if (children.length > 0) {
    //           return {
    //             ...node,
    //             children,
    //           };
    //         }
    //       }
    //       // @ts-ignore
    //       if (node.title.includes(value)) {
    //         return node;
    //       }
    //       return null;
    //     })
    //     .filter((node) => node !== null);
    // };
    // setTreeData(filterTreeData(treeData));
  };

  const onSelect: OnSelectType = (keys, info: SelectInfoType) => {
    if (keys.length === 0) return;
    setSelectedKeys(keys);
    props.onSelect(keys, info);
  };

  const onExpand: TreeProps['onExpand'] = (
    expandedKeysValue: React.Key[],
    info
  ) => {
    console.log('onExpand', expandedKeysValue, info);

    // if (info.nativeEvent) {
    //   setExpandedKeys(expandedKeysValue.slice(0, 6));
    //   return;
    // }
    // 删除最后一个元素
    // expandedKeysValue.pop();
    setExpandedKeys([...expandedKeysValue]);
  };

  useEffect(() => {
    fetch(window.prefabPath)
      .then((response) => response.json())
      .then((data) => {
        const root = convertPrefabToNodeTree(data);
        let i = 0;
        const keys = [];
        walk(root, (node) => {
          node.title = node._name;
          node.key = node._name + i++;
          node.children = node._children;
          if (node.children.length > 0) {
            keys.push(node.key);
          }
        });
        window.PrefabData = data;
        setTreeData([root]);
        setExpandedKeys(keys);
        const simulateInfo:SelectInfoType  = {
          node: root,
          selected: true,
          selectedNodes: [root],
          nativeEvent: null,
          event: 'select',
        };

        onSelect([root.key], simulateInfo);
      });
  }, []);

  return (
    <div>
      <Search placeholder='Search' onChange={onChange} />
      {treeData.length && <Tree
         style={{
          marginTop: 10,
          marginBottom: 10,
          whiteSpace: 'nowrap',
          overflow: 'auto',
          height: 'calc(100vh - 60px)',
        }}
        className="my-tree"
        // autoExpandParent={true}
        // defaultExpandParent={true}
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        // expandedKeys={expandedKeys}
        selectedKeys={selectedKeys}
        // selectable
        treeData={treeData}
      />}
    </div>
  );
};

export default Left;

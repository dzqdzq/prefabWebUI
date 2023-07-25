import React, { useMemo, useState, useEffect } from 'react';
import { Input, Layout, Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import './index.css';
import { walk, convertPrefabToNodeTree } from './utils/parse';

const { Search } = Input;

interface LeftProps {
  onSelect: TreeProps['onSelect'];
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

  const onSelect: TreeProps['onSelect'] = (keys, info: { node }) => {
    if (keys.length === 0) return;
    setSelectedKeys(keys);
    // @ts-ignore
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
        const simulateInfo = {
          node: root,
          selected: true,
          selectedNodes: [root],
        };

        // @ts-ignore
        onSelect([root.key], simulateInfo);
      });
  }, []);

  // useEffect(() => {
  //   console.log('dzq');
  // }, [selectedKeys]);

  return (
    <Layout>
      <Search placeholder='Search' onChange={onChange} />
      <Tree
        style={{
          marginTop: 10,
          marginBottom: 10,
          whiteSpace: 'nowrap',
          overflow: 'auto',
        }}
        // autoExpandParent={true}
        // defaultExpandParent={true}
        // defaultExpandAll={true}
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        selectedKeys={selectedKeys}
        // selectable
        treeData={treeData}
      />
    </Layout>
  );
};

export default Left;

import React, { useEffect, useState } from "react";
import Left from "./component/Left";
import Right from "./component/Right";
import type { TreeProps } from "antd/es/tree";
import { Allotment } from "allotment";
import { walk, convertPrefabToNodeTree } from "./utils/parse";

import "allotment/dist/style.css";

const App: React.FC = () => {
  const [treeData, setTreeData] = useState([]);
  const [node, setNode] = useState(null);

  useEffect(() => {
    const fetchTreeData = () => {
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
          setNode(root);
        });
    };

    fetchTreeData();
  }, []);

  const onSelectNode: TreeProps["onSelect"] = (keys, info: { node }) => {
    setNode(info.node);
  };

  return (
    <Allotment proportionalLayout>
      <Allotment.Pane minSize={200} maxSize={400} preferredSize={300}>
        <Left treeData={treeData} onSelect={onSelectNode} />
      </Allotment.Pane>
      <Allotment.Pane minSize={200}>
        <Right node={node} />
      </Allotment.Pane>
    </Allotment>
  );
};
export default App;

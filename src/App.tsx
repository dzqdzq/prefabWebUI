import React, { useEffect, useState, useRef } from "react";
import Left from "./component/Left";
import Right from "./component/Right";
import type { TreeProps } from "antd/es/tree";
import { Allotment } from "allotment";
import { Prefab } from "./utils/prefab.mjs";

import "allotment/dist/style.css";

const App: React.FC = () => {
  const [treeData, setTreeData] = useState([]);
  const [node, setNode] = useState(null);
  const leftRef = useRef(null);

  useEffect(() => {
    const fetchTreeData = () => {
      fetch(window.prefabPath)
        .then((response) => response.json())
        .then((data) => {
          const prefab = new Prefab(data);
          window.PrefabData = prefab;
          const tree = prefab.getAntdTree();
          setTreeData(tree);
          setNode(tree[0]);
        });
    };

    fetchTreeData();
  }, []);

  const onSelectNode: TreeProps["onSelect"] = (keys, info: { node }) => {
    setNode(info.node);
  };

  const handleIdClick = (id: number) => {
    if (leftRef.current) {
      leftRef.current.handleIdClick(id);
    }
  }

  return (
    <Allotment proportionalLayout>
      <Allotment.Pane minSize={200} maxSize={250} preferredSize={200}>
        <Left ref={leftRef} treeData={treeData} onSelect={onSelectNode} />
      </Allotment.Pane>
      <Allotment.Pane minSize={300}>
        <Right node={node} onIdClick={handleIdClick} />
      </Allotment.Pane>
    </Allotment>
  );
};
export default App;

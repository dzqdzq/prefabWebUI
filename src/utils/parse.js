function parseColor(value) {
  const { r, g, b, a } = value;
  return [r, g, b, a];
}

function parseVec2(value) {
  const { x, y } = value;
  return [x, y];
}

function parseVec3(value) {
  const { x, y, z } = value;
  return [x, y, z];
}

function parseSize(value) {
  const { width, height } = value;
  return [width, height];
}

const typeParse = {
  'cc.Color': parseColor,
  'cc.Vec2': parseVec2,
  'cc.Vec3': parseVec3,
  'cc.Size': parseSize,
};

const id = (data) => data.__id__;
function convertPrefabToNodeTree(prefabObj) {
  const headNode = prefabObj[id(prefabObj[0].data)];
  function _(node) {
    delete node.__id__;
    delete node._parent;
    delete node.groupIndex;
    delete node._objFlags;
    parseNode(node);
    // parseComponent(node, prefabObj);
    node._children.forEach((info, i) => {
      const id_ = id(info);
      if (id_) {
        node._children[i] = _(prefabObj[id_]);
      }
    });
    return node;
  }
  _(headNode);
  return headNode;
}

function parseComponent(node, prefabObj) {
  node._components.forEach((comp, i) => {
    const id_ = id(comp);
    node._components[i] = prefabObj[id_];
  });
}

function parseNode(node) {
  parseTrs(node);
  for (let key in node) {
    const value = node[key];
    if (typeof value === 'object') {
      if (value.__type__ && typeParse[value.__type__]) {
        node[key] = typeParse[value.__type__](value);
        continue;
      }
    }
  }
}

function parseTrs(node) {
  const _trs = node._trs.array;
  node._scale = [_trs[7], _trs[8], _trs[9]];
  node._position = [_trs[0], _trs[1], _trs[2]];
  node._quat = _trs.slice(3, 7);
  delete node._trs;
}

// 遍历node树
function walk(node, cb) {
  cb(node);
  node._children.forEach((child) => {
    walk(child, cb);
  });
}

export { walk, convertPrefabToNodeTree };

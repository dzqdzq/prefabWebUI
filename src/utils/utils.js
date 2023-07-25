export function isCustomComp(compData) {
  return (
    compData.__type__.length === 23 && !compData.__type__.startsWith('cc.')
  );
}

export function isNode(compData) {
  return compData.__type__ === 'cc.Node';
}

export function getNodeName(compData) {
  return compData.title;
}

export function getCompName(compData, prefabData) {
  const __type__ = compData.__type__;
  if (!compData.node) {
    return compData;
  }
  return getNodeName(prefabData[compData.node.__id__]) + `(${__type__})`;
}

export function getAnyName(compData, prefabData) {
  if (isNode(compData)) {
    return getNodeName(compData);
  }
  return getCompName(compData, prefabData);
}

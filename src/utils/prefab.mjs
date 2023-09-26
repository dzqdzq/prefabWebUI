import parseNode from './parse.mjs';

const id = (data) => data?.__id__;

export function walk(node, cb) {
    cb(node);
    node.children.forEach((child) => {walk(child, cb);});
}

function cloneTree(node) {
    const { key, title, children } = node;
    const clonedChildren = children.map(cloneTree);
    return { key, title, children: clonedChildren };
}

class Node{
    constructor(d){
        Object.assign(this, d);
    }

    get key(){
        return this.id;
    }

    get title(){
        return this.__raw._name;
    }

    get data(){
        return this.__raw;
    }

    get parentId(){
        if(this.parent)
            return this.parent.id;
        return 0;
    }

    toJSON(){
        // 忽略parent
        const { parent, ...rest } = this;
        return rest;
    }
}

export class Prefab{
    constructor(dataArr){
        dataArr.filter((node) => node.__type__ == 'cc.Node').forEach(parseNode);
        this._dataArr = dataArr;
        Node._d = dataArr;
        // console.log(this._dataArr);
        dataArr.forEach((node, i) => {
            node._id = i;
        });
        this._dataTreeMap = {};

        for(let i=1; i<dataArr.length; i++){
            const node = dataArr[i];
            const type = node.__type__;
            if(type === 'cc.PrefabInfo'){
                continue;
            }
            const isComp = typeof node._children === 'undefined';
            if(isComp){
                this._dataTreeMap[i] = new Node({
                    type: 'comp',
                    id: i,
                    nodeId: id(node.node),
                });
            }else{
                this._dataTreeMap[i] = new Node({
                    type: 'node',
                    id: i,
                    children: node._children.map((item) => item.__id__),
                    comps: node._components.map((item) => item.__id__),
                });
            }
        }// end for

        walk(this._dataTreeMap[1], (node) => {
            node.__raw = dataArr[node.id];
            node.children = node.children.map((id) => {
                this._dataTreeMap[id].parent = node;
                return this._dataTreeMap[id];
            });
            node.comps = node.comps.map((id) => {
                this._dataTreeMap[id].__raw = dataArr[id];
                return this._dataTreeMap[id];
            });
        });
    }

    getData(node){
        return this._dataArr[node.id];
    }

    getAntdTree(){
        return [cloneTree(this.root)];
    }

    getAllParent(node){
        const parents = [];
        let parent = node.parent;
        while(parent){
            parents.push(parent);
            parent = parent.parent;
        }
        return parents;
    }

    getAllParentKey(node){
        return this.getAllProp(this.getAllParent(node), 'key');
    }

    getAllProp(nodeArr, key){
        return nodeArr.map((node) => {
            return node[key];
        });
    }

    getAllDataProp(nodeArr, key){
        return nodeArr.map((node) => {
            return node.data[key];
        });
    }

    getCompFromId(id){
        return this._dataTreeMap[id];
    }

    getNodeFromId(id){
        const node = this._dataTreeMap[id];
        if(this._dataTreeMap[id].type === 'node'){
            return this._dataTreeMap[id];
        }
        return this._dataTreeMap[node.nodeId];
    }

    get root(){
        return this._dataTreeMap[1];
    }

    print(){
        console.log(JSON.stringify(this._dataTreeMap[1], null, 2));
    }
}

import fs from 'fs';
import { Prefab } from '../src/utils/prefab.mjs';

function test(){
    const prefabPath = new URL('../public/AviaBC2Navigation.prefab', import.meta.url);
    fs.readFile(prefabPath, 'utf8', (err, data) => {
        if(err){
            console.log(err);
            return;
        }
        const prefab = new Prefab(JSON.parse(data));
        prefab.print();

        console.log(prefab.getAllParentKey(prefab.getNodeFromId(92)));
    });
}

test();
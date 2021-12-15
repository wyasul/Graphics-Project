import {ALoadedModel, ASerializable, Color, Vec2} from "../../../anigraph";
import * as THREE from "three";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";

const loader = new PLYLoader();
const GemGeometry:THREE.BufferGeometry|Promise<THREE.BufferGeometry> = loader.loadAsync('./models/ply/binary/ruby.ply');

@ASerializable("GemNodeModel")
export class GemNodeModel extends ALoadedModel {
    static GemObject3D:THREE.Object3D;
    selectable = true;
    matrixIdx: Vec2;

    constructor() {
        super(GemNodeModel.GemObject3D);

        const self=this;
        this.matrixIdx = new Vec2();

        this.subscribe(this.addStateKeyListener('gem', ()=>{
            self.geometry.touch();
        }))
    }

    static async CreateDefaultNode(){
        if (!GemNodeModel.GemObject3D) {
            const geometry = await GemGeometry;
            GemNodeModel.GemObject3D = new THREE.Mesh(geometry);
        }
        let newNode = new GemNodeModel();
        newNode.color = Color.Random();
        return newNode;
    }

}
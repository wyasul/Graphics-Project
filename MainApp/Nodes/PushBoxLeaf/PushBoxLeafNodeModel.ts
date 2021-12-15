import {ATriangleMeshElement} from "../../../anigraph/arender/basic/ATriangleMeshElement";
import {
    ALoadedModel,
    AMaterial,
    AObjectState, ASceneNodeModel, ASerializable, BoundingBox3D,
    Color,
    NodeTransform3D,
    Quaternion,
    V2,
    V3,
    V4,
    Vec2,
    Vec3,
    VertexArray3D
} from "../../../anigraph";
import * as THREE from "three";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";

const loader = new PLYLoader();
const GemGeometry:THREE.BufferGeometry|Promise<THREE.BufferGeometry> = loader.loadAsync('./models/ply/binary/sphere.ply');

@ASerializable("PushBoxLeafNodeModel")
export class PushBoxLeafNodeModel extends ALoadedModel {
    static LeafObject3D:THREE.Object3D;
    selectable=true;
    leafSpeed: number = 0.5;
    leafFalling:boolean = false;
    reGrow:boolean = false;
    branchPosition:Vec3 = V3(0,0,0);
    size:number = 0;
    fallEndTime:number=0;
    reGenTime:number=0;

    constructor() {
        super(PushBoxLeafNodeModel.LeafObject3D);

        const self=this;

        this.subscribe(this.addStateKeyListener('gem', ()=>{
            self.geometry.touch();
        }))
    }

    static async CreateDefaultNode(){
        if (!PushBoxLeafNodeModel.LeafObject3D) {
            const geometry = await GemGeometry;
            PushBoxLeafNodeModel.LeafObject3D = new THREE.Mesh(geometry);
        }
        let newNode = new PushBoxLeafNodeModel();
        newNode.color = Color.Random();
        return newNode;
    }

}
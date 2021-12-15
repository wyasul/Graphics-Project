import * as THREE from "three";
import {
    ALoadedModel,
    AMaterialManager,
    AObjectState,
    ASceneNodeModel,
    ASerializable,
    BezierTween,
    V3,
    Color,
    GetAppState, Quaternion,
    Vec3,
    VertexArray3D, Vec2
} from "../../../anigraph";
import {bezier} from "@leva-ui/plugin-bezier";
import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {button} from "leva";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";

const DEFAULT_DURATION = 1.5;

const loader = new PLYLoader();
const WallGeometry:THREE.BufferGeometry|Promise<THREE.BufferGeometry> = loader.loadAsync('./models/ply/diamond_ore.ply');

@ASerializable("PushBoxWallNodeModel")
export class PushBoxWallNodeModel extends ALoadedModel{
    //Our vertices
    static WallObject3D:THREE.Object3D;

    constructor() {
        super(PushBoxWallNodeModel.WallObject3D);
        this.transform._scale = V3(4,4,4);
        this.setMaterial('wall');
    }

    /**
     * Define this to customize what gets created when you click the create default button in the GUI
     * @constructor
     */
    static async CreateDefaultNode(radius:number=50, widthSegments:number=50, heightSegments:number=50, ...args:any[]){
        if(!PushBoxWallNodeModel.WallObject3D){
            const geometry = await WallGeometry;
            PushBoxWallNodeModel.WallObject3D = new THREE.Mesh(geometry);
        }
        let wallNode = new PushBoxWallNodeModel();
        wallNode.color = Color.FromRGBA(100,200,200,200)
        return wallNode;
    }

    getModelGUIControlSpec(): { [p: string]: any } {
        const self = this;
        const specs = {
            looking: {
                value: {x: self.transform.anchor.x, y:self.transform.anchor.y},
                joystick: "invertY",
                step: 5,
                onChange:(v: any)=>{
                    self.transform.anchor = new Vec3(v.x, v.y, 0);
                }
            }
        }
        return {...super.getModelGUIControlSpec(),...specs};
    }

}
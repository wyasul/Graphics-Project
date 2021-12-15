import {ASceneNodeController, ASerializable, Vec3} from "../../../anigraph";
import {GroundModel} from "./GroundModel";

@ASerializable("GroundController")
export class GroundController extends ASceneNodeController<GroundModel>{
}

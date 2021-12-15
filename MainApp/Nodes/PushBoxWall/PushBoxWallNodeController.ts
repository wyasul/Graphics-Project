import {AInteractionEvent, AKeyboardInteraction, ASceneNodeController, Quaternion, Vec3} from "../../../anigraph";
import {PushBoxWallNodeModel} from "./PushBoxWallNodeModel";
import {PushBoxGameControls} from "../../PlayerControls/PushBoxGameControls";

export class PushBoxWallNodeController extends ASceneNodeController<PushBoxWallNodeModel> {


    onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    }

    onKeyUp(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    }

}
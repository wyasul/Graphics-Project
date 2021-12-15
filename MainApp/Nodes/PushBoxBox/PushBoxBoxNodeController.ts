import {AInteractionEvent, AKeyboardInteraction, ASceneNodeController, Quaternion, Vec3} from "../../../anigraph";
import {PushBoxBoxNodeModel} from "./PushBoxBoxNodeModel";
import {PushBoxGameControls} from "../../PlayerControls/PushBoxGameControls";

export class PushBoxBoxNodeController extends ASceneNodeController<PushBoxBoxNodeModel> {

    onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    }

    onKeyUp(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    }

    //new added, to achieve smooth motion
    move(duration?: number, target?:Vec3) {
        duration = duration ?? this.model.moveDuration;
        if (this.model.isMoving) {
            return;
        }
        const self = this;
        const moveStart = this.model.transform.position;
        const diff = target!.minus(moveStart);
        let height:number = target!.z;
        this.addTimedAction((actionProgress ) => {
            self.model.isMoving = true;
            self.model.transform.position = new Vec3(moveStart.x + diff.x * actionProgress, moveStart.y + diff.y * actionProgress, height);
        }, duration, ()=>{
            self.model.isMoving = false;
            self.model.transform.position = target!;
        }, this.model.moveTween);

    }
}
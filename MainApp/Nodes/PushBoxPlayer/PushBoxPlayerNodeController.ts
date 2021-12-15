import {AInteractionEvent, AKeyboardInteraction, ASceneNodeController, Quaternion, Vec3} from "../../../anigraph";
import {PushBoxPlayerNodeModel} from "./PushBoxPlayerNodeModel";
import {PushBoxGameControls} from "../../PlayerControls/PushBoxGameControls";

export class PushBoxPlayerNodeController extends ASceneNodeController<PushBoxPlayerNodeModel> {

    // Deprecated
    // onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    //     let target:Vec3 = this.model.transform.position;
    //     console.log("Start of onKeyDown: " + target);
    //
    //     if (interaction.keysDownState[' ']) {
    //         this.spin();
    //     }
    //
    //     if (interaction.keysDownState[']']) {
    //         this.model.transform.rotation = this.model.transform.rotation.times(Quaternion.RotationZ(Math.PI * 0.1));
    //     }
    //     if (interaction.keysDownState['[']) {
    //         this.model.transform.rotation = this.model.transform.rotation.times(Quaternion.RotationZ(-Math.PI * 0.1));
    //     }
    //
    //     //new added, use arrow keys and wasd to control the motion of dragon.
    //     if ((interaction.keysDownState['w'] || interaction.keysDownState['ArrowUp']) && !this.model.reachUpBoundary) {
    //         // this.model.transform.rotation = Quaternion.RotationZ(-Math.PI*3/4);
    //         target = this.model.transform.position.plus(new Vec3(0, this.model.stepLength, 0));
    //         this.move(this.model.moveDuration, target);
    //         console.log("this.model.reachUpBoundary: " + this.model.reachUpBoundary);
    //     } else if (this.model.reachUpBoundary) console.log("Reached up boundary");
    //     if ((interaction.keysDownState['s'] || interaction.keysDownState['ArrowDown']) && !this.model.reachBottomBoundary) {
    //         // this.model.transform.rotation = Quaternion.RotationZ(-Math.PI);
    //         target = this.model.transform.position.plus(new Vec3(0, -this.model.stepLength, 0));
    //         this.move(this.model.moveDuration, target)
    //     } else if (this.model.reachBottomBoundary) console.log("Reached bottom boundary");
    //     if ((interaction.keysDownState['a'] || interaction.keysDownState['ArrowLeft']) && !this.model.reachLeftBoundary) {
    //         // this.model.transform.rotation = Quaternion.RotationZ(-Math.PI/2);
    //         target = this.model.transform.position.plus(new Vec3(-this.model.stepLength, 0, 0));
    //         this.move(this.model.moveDuration, target)
    //     } else if (this.model.reachLeftBoundary) console.log("Reached left boundary");
    //     if ((interaction.keysDownState['d'] || interaction.keysDownState['ArrowRight']) && !this.model.reachRightBoundary) {
    //         // this.model.transform.rotation = Quaternion.RotationZ(Math.PI/2);
    //         target = this.model.transform.position.plus(new Vec3(this.model.stepLength, 0, 0));
    //         this.move(this.model.moveDuration, target);
    //     } else if (this.model.reachRightBoundary) console.log("Reached right boundary!");
    //     console.log("result: "+target);
    //     return target;
    // }

    onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    }

    onKeyUp(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    }

    spin(duration?: number) {
        duration = duration ?? this.model.spinDuration;
        if(this.model.isSpinning){
            return;
        }
        const self = this;
        const rotationStart = this.model.transform.rotation;

        this.addTimedAction( (actionProgress) => {
                self.model.isSpinning = true;
                self.model.transform.rotation = rotationStart.times(Quaternion.FromAxisAngle(self.model.transform.rotation.Mat3().c2, actionProgress * self.model.nSpins * Math.PI * 2))
            }, duration,
            () => {
                self.model.isSpinning=false;
                self.model.transform.rotation = rotationStart;
            },
            this.model.spinTween)
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
            height = this.moveDynamics(actionProgress, height);
            self.model.transform.position = new Vec3(moveStart.x + diff.x * actionProgress, moveStart.y + diff.y * actionProgress, height);
        }, duration, ()=>{
            self.model.isMoving = false;
            self.model.transform.position = target!;
        }, this.model.moveTween);

        // doesn't seem to do anything?
        // let x = self.model.getWorldPosition().x
        // let y = self.model.getWorldPosition().y
        // let z = self.model.getWorldPosition().z
        // let v = new Vec3(x, y, z+55)

    }


    moveDynamics(actionProgress: number, height: number) {
        if (actionProgress < 0.05) height += 0.05;
        if (actionProgress < 0.1 && actionProgress >= 0.05) height += 0.045;
        if (actionProgress < 0.15 && actionProgress >= 0.1) height += 0.04;
        if (actionProgress < 0.2 && actionProgress >= 0.15) height += 0.03;
        if (actionProgress < 0.3 && actionProgress >= 0.2) height += 0.02;
        if (actionProgress < 0.4 && actionProgress >= 0.3) height += 0.011;
        if (actionProgress < 0.5 && actionProgress >= 0.4) height += 0.008;
        if (actionProgress < 0.6 && actionProgress >= 0.5) height += -0.008;
        if (actionProgress < 0.7 && actionProgress >= 0.6) height += -0.011;
        if (actionProgress < 0.8 && actionProgress >= 0.7) height += -0.02;
        if (actionProgress < 0.85 && actionProgress >= 0.8) height += -0.03;
        if (actionProgress < 0.9 && actionProgress >= 0.85) height += -0.04;
        if (actionProgress < 0.95 && actionProgress >= 0.9) height += -0.045;
        if (actionProgress <= 1 && actionProgress >= 0.95) height += -0.05;
        return height

    }
}
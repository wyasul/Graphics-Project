import {AInteractionEvent, AKeyboardInteraction, ASceneNodeController, Quaternion, Vec3} from "../../../anigraph";
import {DragonNodeModel} from "./DragonNodeModel";
import {GroundController} from "../Ground/GroundController";

export class DragonNodeController extends ASceneNodeController<DragonNodeModel> {

    onKeyDown(interaction: AKeyboardInteraction, event: AInteractionEvent) {
        let target: Vec3 = this.model.transform.position;
        console.log("Start of onKeyDown: " + target);

        if (interaction.keysDownState[' ']) {
            this.spin();
        }

        if (interaction.keysDownState[']']) {
            this.model.transform.rotation = this.model.transform.rotation.times(Quaternion.RotationZ(Math.PI * 0.1));
        }
        if (interaction.keysDownState['[']) {
            this.model.transform.rotation = this.model.transform.rotation.times(Quaternion.RotationZ(-Math.PI * 0.1));
        }

        //new added, use arrow keys and wasd to control the motion of dragon.
        if ((interaction.keysDownState['w'] || interaction.keysDownState['ArrowUp']) && !this.model.reachUpBoundary) {
            // this.model.transform.rotation = Quaternion.RotationZ(-Math.PI*3/4);
            target = this.model.transform.position.plus(new Vec3(0, 10, 0));
            this.move(this.model.moveDuration, target);
            console.log("this.model.reachUpBoundary: " + this.model.reachUpBoundary);
        } else if (this.model.reachUpBoundary) console.log("Reached up boundary");
        if ((interaction.keysDownState['s'] || interaction.keysDownState['ArrowDown']) && !this.model.reachBottomBoundary) {
            // this.model.transform.rotation = Quaternion.RotationZ(-Math.PI);
            target = this.model.transform.position.plus(new Vec3(0, -10, 0));
            this.move(this.model.moveDuration, target)
        } else if (this.model.reachBottomBoundary) console.log("Reached bottom boundary");
        if ((interaction.keysDownState['a'] || interaction.keysDownState['ArrowLeft']) && !this.model.reachLeftBoundary) {
            // this.model.transform.rotation = Quaternion.RotationZ(-Math.PI/2);
            target = this.model.transform.position.plus(new Vec3(-10, 0, 0));
            this.move(this.model.moveDuration, target)
        } else if (this.model.reachLeftBoundary) console.log("Reached left boundary");
        if ((interaction.keysDownState['d'] || interaction.keysDownState['ArrowRight']) && !this.model.reachRightBoundary) {
            // this.model.transform.rotation = Quaternion.RotationZ(Math.PI/2);
            target = this.model.transform.position.plus(new Vec3(10, 0, 0));
            this.move(this.model.moveDuration, target);
        } else if (this.model.reachRightBoundary) console.log("Reached right boundary!");

        return target;
    }


    onKeyUp(interaction: AKeyboardInteraction, event: AInteractionEvent) {
    }

    spin(duration?: number) {
        duration = duration ?? this.model.spinDuration;
        if (this.model.isSpinning) {
            return;
        }
        const self = this;
        const rotationStart = this.model.transform.rotation;

        this.addTimedAction((actionProgress) => {
                self.model.isSpinning = true;
                self.model.transform.rotation = rotationStart.times(Quaternion.FromAxisAngle(self.model.transform.rotation.Mat3().c2, actionProgress * self.model.nSpins * Math.PI * 2))
            }, duration,
            () => {
                self.model.isSpinning = false;
                self.model.transform.rotation = rotationStart;
            },
            this.model.tween)
    }

    //new added, to achieve smooth motion
    move(duration?: number, target?: Vec3) {
        duration = duration ?? this.model.moveDuration;
        if (this.model.isMoving) {
            return;
        }
        const self = this;
        const moveStart = this.model.transform.position;
        const diff = target!.minus(moveStart);
        let height: number = 0;
        this.addTimedAction((actionProgress) => {
            self.model.isMoving = true;
            if (actionProgress > 0.5) height += -0.1;
            else height += 0.1;
            self.model.transform.position = new Vec3(moveStart.x + diff.x * actionProgress, moveStart.y + diff.y * actionProgress, height);
        }, duration, () => {
            self.model.isMoving = false;
            self.model.transform.position = target!;
            self.model.transform.position.z = 0;
        }, this.model.moveTween);
    }

}

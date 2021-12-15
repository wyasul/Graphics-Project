/***
 * Check out the parent class APointerDragPlayerControls for more implementation details.
 * This is an example of how to implement draggin-based controls like orbit.
 */
import {
    ADragInteraction,
    AInteractionEvent, AKeyboardInteraction, NodeTransform3D, Quaternion, V3, V4, Vec3,
} from "../../anigraph";
import {APointerDragPlayerControls} from "../../anigraph/aplayercontrols/APointerDragPlayerControls";
import {AWheelInteraction} from "../../anigraph/ainteraction/AWheelInteraction";

export class ExampleDragOrbitControls extends APointerDragPlayerControls{
    static NameInGUI(){ // @ts-ignore
        return "OrbitOnDrag";}

    dragStartCallback(interaction:ADragInteraction, event:AInteractionEvent){
        interaction.dragStartPosition = event.cursorPosition;
        interaction.setInteractionState('lastCursor', event.cursorPosition);
    }

    dragMoveCallback(interaction:ADragInteraction, event:AInteractionEvent){
        let mouseMovement = event.cursorPosition.minus(interaction.getInteractionState('lastCursor'));
        interaction.setInteractionState('lastCursor', event.cursorPosition);
        let rotationX = mouseMovement.y*0.002;
        let rotationY = mouseMovement.x*0.002;
        let qY = Quaternion.FromAxisAngle(this.cameraNode.right, rotationX);
        let qX = Quaternion.FromAxisAngle(this.cameraNode.up, rotationY);
        let newPose = this.cameraNode.camera.pose.clone();
        newPose = new NodeTransform3D(qX.getInverse().appliedTo(newPose.position), newPose.rotation.times(qX));
        newPose = new NodeTransform3D(qY.getInverse().appliedTo(newPose.position), newPose.rotation.times(qY));
        this.cameraNode.camera.pose = newPose;
    }

    dragEndCallback(interaction:ADragInteraction, event?:AInteractionEvent){
    }

    wheelCallback(interaction:AWheelInteraction, event:AInteractionEvent){
        let zoom= (event.DOMEvent as WheelEvent).deltaY;
        this.cameraNode.stepForward(0.25*zoom);
    }


    /**
     * We will use 'wasd' controls for translating the camera here. When one of these buttons is pressed,
     * we will call this.cameraNode.moveXXX() to set the camera moving in the corresponding direction.
     * The camera will continue moving in this direction until the button is released (triggering a onKeyUp callback).
     * This works better than moving at every key down event, because those events can be sporadic, but setting state
     * lets us tie movement to a constant speed over time based on the game's clock, which is more consistent than event
     * handlers.
     * @param interaction
     * @param event
     */
    onKeyDown(interaction:AKeyboardInteraction, event:AInteractionEvent){
        if(interaction.keysDownState['w']){
            this.cameraNode.moveForward();
        }
        if(interaction.keysDownState['a']){
            this.cameraNode.moveLeft();
        }
        if(interaction.keysDownState['s']){
            this.cameraNode.moveBackward();
        }
        if(interaction.keysDownState['d']){
            this.cameraNode.moveRight();
        }
        if(interaction.keysDownState['r']){
            this.cameraNode.moveUp();
        }
        if(interaction.keysDownState['f']){
            this.cameraNode.moveDown();
        }
        if(interaction.keysDownState['P']){
            console.log(this.camera.pose);
        }
    }


    /**
     * When we receive a key up event we will halt motion in the corresponding direction.
     * @param interaction
     * @param event
     */
    onKeyUp(interaction:AKeyboardInteraction, event:AInteractionEvent){
        if(!interaction.keysDownState['w']){
            this.cameraNode.haltForward();
        }
        if(!interaction.keysDownState['a']){
            this.cameraNode.haltLeft();
        }
        if(!interaction.keysDownState['s']){
            this.cameraNode.haltBackward();
        }
        if(!interaction.keysDownState['d']){
            this.cameraNode.haltRight();
        }
        if(!interaction.keysDownState['r']){
            this.cameraNode.haltUp();
        }
        if(!interaction.keysDownState['f']){
            this.cameraNode.haltDown();
        }
    }
}

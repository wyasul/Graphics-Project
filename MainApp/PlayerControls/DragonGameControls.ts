import {APlayerControls} from "../../anigraph/aplayercontrols/APlayerControls";
import {
    A3DSceneController, AClickInteraction,
    ADOMPointerMoveInteraction,
    AInteractionEvent, AKeyboardInteraction, ASceneNodeModel, ASerializable,
    CallbackType, GetAppState, Quaternion, V3, Vec3
} from "../../anigraph";
import {APointerLockPlayerControls} from "../../anigraph/aplayercontrols";
import {FilteredVector} from "../../anigraph/amvc/FilteredVector";
import {MainAppState} from "../MainAppState";
import {AWheelInteraction} from "../../anigraph/ainteraction/AWheelInteraction";
import {GroundController} from "../Nodes/Ground/GroundController";
import {GroundModel} from "../Nodes/Ground/GroundModel";
import {position} from "@chakra-ui/react";

@ASerializable("DragonGameControls")
export class DragonGameControls extends APointerLockPlayerControls{
    // cameraFilter!:FilteredVector<Vec3>;
    // selectedModel!:ASceneNodeModel|undefined;
    // camOffset:number=1;
    // startOffset!:Vec3;
    //
    // // helper function to cast our appstate to the appropriate custom type
    // get appState(){
    //     return GetAppState() as MainAppState;
    // }
    //
    // get dragon(){
    //     return this.appState.dragon;
    // }
    //
    // get dragonController(){
    //     return this.appState.dragonController;
    // }
    //
    // get ground() {
    //     return this.appState.getGroundModel();
    // }
    //
    // //A handle for our control mode
    // static NameInGUI(){ // @ts-ignore
    //     return "DragonGame";}
    //
    //
    // //##################//--Set up the camera filter--\\##################
    // //<editor-fold desc="Set up the camera filter">
    // beforeActivate(...args:any[]) {
    //     super.beforeActivate();
    //     this.startOffset = new Vec3(28,-55,50);
    //     this.cameraNode.camera.pose.rotation = new Quaternion(-0.3696438, -0.0990458, -0.2391176, 0.8923991 )
    //     const self = this;
    //     if(this.dragon){
    //         this.cameraFilter = new FilteredVector<Vec3>(
    //             this.dragon.transform.position.plus(this.startOffset),
    //             0.2,
    //             (filteredValue:FilteredVector<Vec3>)=>{
    //                 self.camera.setPosition(self.cameraFilter.value);
    //             });
    //     }
    // }
    // afterDeactivate(...args:any[]) {
    //     super.afterDeactivate(...args);
    //     if(this.cameraFilter) {
    //         this.cameraFilter.dispose();
    //     }
    // }
    // //</editor-fold>
    // //##################\\--Set up the camera filter--//##################
    //
    //
    // /**
    //  * Bind any methods you want to use as callbacks.
    //  * Doing so will let you refer to "this" inside of the function safely.
    //  */
    // bindMethods() {
    //     super.bindMethods();
    //     this.onClick = this.onClick.bind(this);
    // }
    //
    // /**
    //  * We will add a custom click function here.
    //  */
    // onClick(){
    //     this.dragonController?.spin();
    //     console.log("Pew Pew Pew!");
    // }
    //
    // /**
    //  * We will need to update our init function to add the new click interaction...
    //  * @param owner
    //  * @param args
    //  */
    // init(owner:A3DSceneController<any, any>, ...args:any[]){
    //     super.init(owner, ...args);
    //
    //     // initialize the controls
    //     this.addInteraction(AClickInteraction.Create(
    //         this.domElement,
    //         this.onClick
    //     ))
    //
    //     this.addInteraction(AWheelInteraction.Create(
    //         this.domElement,
    //         this.wheelCallback
    //     ));
    //     //SCALES
    // }
    //
    // updateCamera(){
    //     if(this.appState.dragon) {
    //         this.cameraFilter.target = this.dragon.transform.position.plus(this.startOffset.times(this.camOffset));
    //     }
    // }
    //
    // //</editor-fold>
    // //##################\\--Adding additional types of interactions--//##################
    //
    // onMouseMove(interaction:ADOMPointerMoveInteraction,  event:AInteractionEvent ) {
    //     // ignore if we aren't locked
    //     if ( this.isLocked === false ) return;
    //
    //     // convenience function to get mouse movement across different browsers
    //     let mouseMovement = APlayerControls.GetMouseEventMovement(event);
    //
    //     let translate = V3(mouseMovement.x,-mouseMovement.y,0).times(1);
    //     if(this.dragon){
    //         this.dragon.transform.position = this.dragon.transform.position.plus(translate);
    //         this.updateCamera();
    //     }
    // }
    //
    // wheelCallback(interaction:AWheelInteraction, event?:AInteractionEvent){
    //     if(event) {
    //         let zoom = (event.DOMEvent as WheelEvent).deltaY;
    //         this.camOffset = this.camOffset + 0.005 * zoom;
    //         this.updateCamera();
    //     }
    // }
    //
    // dispose(){
    //     super.dispose();
    //     // Any cleanup you need to do
    // };
    //
    // onKeyDown( interaction:AKeyboardInteraction, event:AInteractionEvent){
    //     if(this.dragon.isSpinning || this.dragon.isMoving) return;
    //
    //     let position = this.dragonController!.model.transform.position;
    //     this.dragon.reachUpBoundary = this.ground.hasReachUpBoundary(position);
    //     this.dragon.reachBottomBoundary = this.ground.hasReachBottomBoundary(position);
    //     this.dragon.reachLeftBoundary = this.ground.hasReachLeftBoundary(position);
    //     this.dragon.reachRightBoundary = this.ground.hasReachRightBoundary(position);
    //
    //     let ground:GroundModel = this.ground;
    //     this.dragon.stepLength = ground.cellSize;
    //
    //     // console.log("row: " + this.ground.getMatrixIdx(position) + ", column: " + this.ground.getMatrixIdx(position));
    //     // console.log("reachUpBoundary: " + this.dragon.reachUpBoundary);
    //     let oldPosition = new Vec3(position.x, position.y, position.z);
    //
    //     let newPosition = this.dragonController?.onKeyDown(interaction, event) as Vec3;
    //     ground.updateMatrix(oldPosition, newPosition, "player");
    //
    // }
    //
    // onKeyUp(interaction:AKeyboardInteraction, event:AInteractionEvent){
    //     this.dragonController?.onKeyUp(interaction, event);
    // }

}

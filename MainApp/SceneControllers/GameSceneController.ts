import {A3DSceneController, AMVCSpec, ASceneModel, ASceneNodeModel, BasicSceneNodeController} from "../../anigraph";
import {BasicGameSceneControllerSpecs} from "./SceneControllerSpecs";
import {ExampleFlyingCameraControls} from "../PlayerControls/ExampleFlyingPlayerControls";
import {folder} from "leva";
import {ExampleDragOrbitControls} from "../PlayerControls/ExampleDragOrbitControls";
import {RotateSelectedObject} from "../PlayerControls/RotateSelectedObject";
import {ExampleNodeModel} from "../Nodes/Example/ExampleNodeModel";
import {ExampleNodeView} from "../Nodes/Example/ExampleNodeView";
import {ExampleThirdPersonControls} from "../PlayerControls/ExampleThirdPersonControls";
import {PushBoxGameControls} from "../PlayerControls/PushBoxGameControls";

export class GameSceneController extends A3DSceneController<ASceneNodeModel, ASceneModel<ASceneNodeModel>> {
    initClassSpec() {
        super.initClassSpec();
        this.addClassSpecs(BasicGameSceneControllerSpecs());
        this.addClassSpec(new AMVCSpec(ExampleNodeModel, ExampleNodeView, BasicSceneNodeController));
        // add additional specs here
    }


    initView() {
        super.initView();
        this.view.setSkyBoxToSpace();
    }

    initCameraControls() {
        this.addControlType(ExampleFlyingCameraControls);
        this.addControlType(ExampleDragOrbitControls);
        this.addControlType(RotateSelectedObject);
        this.addControlType(ExampleThirdPersonControls);
        // this.addControlType(DragonGameControls);
        // this.setCurrentInteractionMode(DragonGameControls);
        this.addControlType(PushBoxGameControls);
        this.setCurrentInteractionMode(PushBoxGameControls);
    }

    initSceneCamera() {
        super.initSceneCamera();
    }

    /**
     * We will add a dropdown box that lets us switch between different interactionModes
     * @returns {any}
     */
    getControlPanelSpecs(){
        const self = this;
        let controlSpecs:any = {};
        controlSpecs['InteractionMode:']={
            value: self._currentInteractionModeName,
            options: self._interactions.getGUISelectableModesList(),
            onChange: (v: any) => {
                self.setCurrentInteractionMode(v);
            }
        }
        return folder({
                ...controlSpecs
            },
            {collapsed: false}
        );
        return controlSpecs;
    }


}

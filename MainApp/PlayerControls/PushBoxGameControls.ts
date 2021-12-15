import {
    A3DSceneController,
    AClickInteraction,
    ADOMPointerMoveInteraction,
    AInteractionEvent,
    AKeyboardInteraction,
    ASceneNodeModel,
    ASerializable,
    Color,
    GetAppState,
    Quaternion,
    Vec2,
    Vec3
} from "../../anigraph";
import {APointerLockPlayerControls} from "../../anigraph/aplayercontrols";
import {FilteredVector} from "../../anigraph/amvc/FilteredVector";
import {MainAppState} from "../MainAppState";
import {AWheelInteraction} from "../../anigraph/ainteraction/AWheelInteraction";
import {Const} from "../Const";
import {PushBoxBoxNodeModel} from "../Nodes/PushBoxBox/PushBoxBoxNodeModel";
import {v4 as uuidv4} from "uuid";

@ASerializable("PushBoxGameControls")
export class PushBoxGameControls extends APointerLockPlayerControls{
    cameraFilter!:FilteredVector<Vec3>;
    selectedModel!:ASceneNodeModel|undefined;
    camOffset:number=1;
    startOffset!:Vec3;

    // helper function to cast our appstate to the appropriate custom type
    get appState(){
        return GetAppState() as MainAppState;
    }

    get player(){
        return this.appState.player;
    }

    get goals() {
        return this.appState.goals;
    }

    get playerController(){
        return this.appState.playerController;
    }

    get ground() {
        return this.appState.getGroundModel();
    }

    getBoxContoller(box: PushBoxBoxNodeModel) {
        return this.appState.getBoxController(box);
    }

    getBox(vec:Vec2) {
        let boxes = this.appState.boxes;
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].matrixIdx.isEqualTo(vec)) {
                return boxes[i];
            }
        }
        return undefined;
    }

    //A handle for our control mode
    static NameInGUI(){ // @ts-ignore
        return "PushBoxGame";}


    //##################//--Set up the camera filter--\\##################
    //<editor-fold desc="Set up the camera filter">
    beforeActivate(...args:any[]) {
        super.beforeActivate();


        this.startOffset = this.camera.pose.position.clone();
        const self = this;
        if (this.player) {
            this.cameraFilter = new FilteredVector<Vec3>(
                this.player.transform.position.plus(this.startOffset),
                0.2,
                (filteredValue: FilteredVector<Vec3>) => {
                    self.camera.setPosition(self.cameraFilter.value);
                });
            this.camera.setPosition(this.startOffset);
        }
    }

    afterDeactivate(...args:any[]) {
        super.afterDeactivate(...args);
        if(this.cameraFilter) {
            this.cameraFilter.dispose();
        }
    }
    //</editor-fold>
    //##################\\--Set up the camera filter--//##################


    /**
     * Bind any methods you want to use as callbacks.
     * Doing so will let you refer to "this" inside of the function safely.
     */
    bindMethods() {
        super.bindMethods();
        this.onClick = this.onClick.bind(this);
    }

    /**
     * We will add a custom click function here.
     */
    onClick(){
        this.playerController?.spin();
        console.log("Player: Pew Pew Pew!");
    }

    /**
     * We will need to update our init function to add the new click interaction...
     * @param owner
     * @param args
     */
    init(owner:A3DSceneController<any, any>, ...args:any[]){
        super.init(owner, ...args);

        // initialize the controls
        this.addInteraction(AClickInteraction.Create(
            this.domElement,
            this.onClick
        ))

        this.addInteraction(AWheelInteraction.Create(
            this.domElement,
            this.wheelCallback
        ));
    }

    updateCamera(){
        if(this.appState.player) {
            this.cameraFilter.target = this.player.transform.position.plus(this.startOffset.times(this.camOffset));
        }
    }

    //</editor-fold>
    //##################\\--Adding additional types of interactions--//##################

    onMouseMove(interaction:ADOMPointerMoveInteraction,  event:AInteractionEvent ) {
        // ignore if we aren't locked
        // if ( this.isLocked === false ) return;
        //
        // // convenience function to get mouse movement across different browsers
        // let mouseMovement = APlayerControls.GetMouseEventMovement(event);
        //
        // let translate = V3(mouseMovement.x,-mouseMovement.y,0).times(1);
        // if(this.player){
        //     this.player.transform.position = this.player.transform.position.plus(translate);
        //     this.updateCamera();
        // }
        return;
    }

    wheelCallback(interaction:AWheelInteraction, event?:AInteractionEvent){
        if(event) {
            let zoom = (event.DOMEvent as WheelEvent).deltaY;
            this.camOffset = this.camOffset + 0.005 * zoom;
            this.updateCamera();
        }
    }

    dispose(){
        super.dispose();
        // Any cleanup you need to do
    };

    // Previous Implementation Deprecated
    // onKeyDown( interaction:AKeyboardInteraction, event:AInteractionEvent){
    //     if (this.player.isSpinning || this.player.isMoving) return;
    //
    //     let position = this.playerController!.model.transform.position;
    //     this.player.reachUpBoundary = this.ground.hasReachUpBoundary(position);
    //     this.player.reachBottomBoundary = this.ground.hasReachBottomBoundary(position);
    //     this.player.reachLeftBoundary = this.ground.hasReachLeftBoundary(position);
    //     this.player.reachRightBoundary = this.ground.hasReachRightBoundary(position);
    //
    //     let ground:GroundModel = this.ground;
    //     this.player.stepLength = ground.cellSize;
    //
    //     let oldPosition = new Vec3(position.x, position.y, position.z);
    //
    //     let newPosition = this.playerController?.onKeyDown(interaction, event) as Vec3;
    //     ground.updateMatrix(oldPosition, newPosition, "player");
    //     console.log(ground.locationMatrix);
    //
    // }

    onKeyDown(interaction:AKeyboardInteraction, event:AInteractionEvent){
        if (this.player.isSpinning || this.player.isMoving) return;

        const positionVec = this.player.matrixIdx;
        let playerMoved = false;
        if (interaction.keysDownState['w'] || interaction.keysDownState['ArrowUp']) {
            this.player.transform.rotation = Quaternion.RotationZ(Math.PI);
            playerMoved = this.moveUp(positionVec);
        } else if (interaction.keysDownState['s'] || interaction.keysDownState['ArrowDown']) {
            this.player.transform.rotation = Quaternion.RotationZ(0);
            playerMoved = this.moveDown(positionVec);
        } else if (interaction.keysDownState['a'] || interaction.keysDownState['ArrowLeft']) {
            this.player.transform.rotation = Quaternion.RotationZ(Math.PI*0.5);
            playerMoved = this.moveLeft(positionVec);
        } else if (interaction.keysDownState['d'] || interaction.keysDownState['ArrowRight']) {
            this.player.transform.rotation = Quaternion.RotationZ(-Math.PI*0.5);
            playerMoved = this.moveRight(positionVec);
        }
        else if (interaction.keysDownState['r']) {
            const subscriptionHandle = uuidv4();
            this.appState.subscribe(this.appState.appClock.CreateTimedAction(
                    () => {
                    },
                    0.1,
                    () => {
                        this.appState.unsubscribe(subscriptionHandle);
                        this.appState.clearScreen();
                        this.ground.updateMatrix(this.ground.level);
                        this.appState.updatePushBoxGame(true);
                    }),
                subscriptionHandle
            );
        }
        else if (interaction.keysDownState['n']) {
            const subscriptionHandle = uuidv4();
            this.appState.subscribe(this.appState.appClock.CreateTimedAction(
                    ()=>{},
                    0.1,
                    () => {
                        this.appState.unsubscribe(subscriptionHandle);
                        this.appState.clearScreen();
                        this.ground.level +=1
                        this.ground.updateMatrix(this.ground.level);
                        this.appState.updatePushBoxGame(true);
                    }),
                subscriptionHandle
            );
        }

        // check goal condition
        if (playerMoved) {
            let count = 0;
            for (let i = 0; i < this.goals.length; i++) {
                const y = this.goals[i].matrixIdx.y;
                const x = this.goals[i].matrixIdx.x;
                if (this.ground.locationMatrix[y][x] == Const.box) {
                    this.goals[i].color = new Color(0, 255, 0);
                    this.goals[i].intensity = 0.001;
                    count++;
                } else {
                    this.goals[i].color = new Color(0, 0, 255);
                    this.goals[i].intensity = 0.01;
                }
            }
            if (count == this.goals.length) {
                console.log('You won!');
                if (Const.lastLevel == this.ground.level) {
                    console.log("You beat the last level!")
                    return;
                }

                const subscriptionHandle = uuidv4();
                this.appState.subscribe(this.appState.appClock.CreateTimedAction(
                    ()=>{},
                    0.9,
                    () => {
                        this.appState.unsubscribe(subscriptionHandle);
                        this.appState.clearScreen();
                        this.ground.level = this.ground.level + 1;
                        this.ground.updateMatrix(this.ground.level);
                        this.appState.updatePushBoxGame(true);
                    }),
                    subscriptionHandle
                );
            }
        }
    }

    moveUp(positionVec:Vec2):boolean {
        let playerMoved = false;
        if (this.player.isMoving || this.player.isSpinning) return playerMoved;
        const y = positionVec.y;
        const x = positionVec.x;
        let locationMatrix = this.ground.locationMatrix;
        if (y <= 0) { // reached upper boundary
            console.log("Player reached upper boundary");
        } else if (locationMatrix[y-1][x] == Const.wall){ // reached upper wall
            console.log("Player reached a wall in upper direction");
        } else if (locationMatrix[y-1][x] == Const.box) {
            if (y <= 1 || locationMatrix[y-2][x] != Const.empty) {
                console.log("The box cannot move up");
            } else {
                locationMatrix[y-2][x] = Const.box;
                locationMatrix[y-1][x] = Const.player;
                locationMatrix[y][x] = Const.empty;
                const newPlayerIdx = new Vec2(x, y-1);
                const newBoxIdx = new Vec2(x, y-2);

                // move box and player
                let box = this.getBox(new Vec2(x, y-1)) as unknown as PushBoxBoxNodeModel;
                let boxController = this.getBoxContoller(box);
                this.playerController?.move(this.player.moveDuration,
                    this.ground.vectorToPosition(newPlayerIdx));
                boxController?.move(box.moveDuration,
                    this.ground.vectorToPosition(newBoxIdx));

                // update matrix index
                this.player.matrixIdx = newPlayerIdx;
                box.matrixIdx = newBoxIdx;
                playerMoved = true;
            }
        } else {
            if (this.ground.locationMatrix[y - 1][x] == Const.gem) {
                const subscriptionHandle = uuidv4();
                this.appState.subscribe(this.appState.appClock.CreateTimedAction(
                        () => {
                        },
                        0.5,
                        () => {
                            this.appState.unsubscribe(subscriptionHandle);
                            let vec = new Vec2(x, y - 1);
                            for (let i = 0; i < this.appState.gems.length; i++) {
                                let gem = this.appState.gems[i];
                                if (gem.matrixIdx.isEqualTo(vec)) {
                                    this.appState.gems.splice(i, 1);
                                    this.appState.sceneModel.removeNode(gem);
                                    break;
                                }
                            }
                        }),
                    subscriptionHandle
                );
            }

            this.ground.locationMatrix[y - 1][x] = Const.player;
            this.ground.locationMatrix[y][x] = Const.empty;
            const newPlayerIdx = new Vec2(x, y - 1);

            // move player
            this.playerController?.move(this.player.moveDuration,
                this.ground.vectorToPosition(newPlayerIdx));

            // update matrix index
            this.player.matrixIdx = newPlayerIdx;
            playerMoved = true;
        }

        return playerMoved;
    }

    moveDown(positionVec:Vec2):boolean {
        let playerMoved = false;
        if (this.player.isMoving || this.player.isSpinning) return playerMoved;
        const y = positionVec.y;
        const x = positionVec.x;
        let locationMatrix = this.ground.locationMatrix;
        if (y >= locationMatrix.length-1) { // reached lower boundary
            console.log("Player reached lower boundary");
        } else if (locationMatrix[y+1][x] == Const.wall){ // reached lower wall
            console.log("Player reached a wall in lower direction");
        } else if (locationMatrix[y+1][x] == Const.box) {
            if (y >= locationMatrix.length-2 || this.ground.locationMatrix[y+2][x] != Const.empty) {
                console.log("The box cannot move down");
            } else {
                this.ground.locationMatrix[y+2][x] = Const.box;
                this.ground.locationMatrix[y+1][x] = Const.player;
                this.ground.locationMatrix[y][x] = Const.empty;
                const newPlayerIdx = new Vec2(x, y+1);
                const newBoxIdx = new Vec2(x, y+2);

                // move box and player
                let box = this.getBox(new Vec2(x, y+1)) as unknown as PushBoxBoxNodeModel;
                let boxController = this.getBoxContoller(box);
                this.playerController?.move(this.player.moveDuration,
                    this.ground.vectorToPosition(newPlayerIdx));
                boxController?.move(box.moveDuration,
                    this.ground.vectorToPosition(newBoxIdx));

                // update matrix index
                this.player.matrixIdx = newPlayerIdx;
                box.matrixIdx = newBoxIdx;
                playerMoved = true;
            }
        } else {
            if (this.ground.locationMatrix[y + 1][x] == Const.gem) {
                const subscriptionHandle = uuidv4();
                this.appState.subscribe(this.appState.appClock.CreateTimedAction(
                        () => {
                        },
                        0.5,
                        () => {
                            this.appState.unsubscribe(subscriptionHandle);
                            let vec = new Vec2(x, y + 1);
                            for (let i = 0; i < this.appState.gems.length; i++) {
                                let gem = this.appState.gems[i];
                                if (gem.matrixIdx.isEqualTo(vec)) {
                                    this.appState.gems.splice(i, 1);
                                    this.appState.sceneModel.removeNode(gem);
                                    break;
                                }
                            }
                        }),
                    subscriptionHandle
                );
            }

            this.ground.locationMatrix[y + 1][x] = Const.player;
            this.ground.locationMatrix[y][x] = Const.empty;
            const newPlayerIdx = new Vec2(x, y + 1);

            // move player
            this.playerController?.move(this.player.moveDuration,
                this.ground.vectorToPosition(newPlayerIdx));

            // update matrix index
            this.player.matrixIdx = newPlayerIdx;
            playerMoved = true;
        }

        return playerMoved;
    }

    moveLeft(positionVec:Vec2):boolean {
        let playerMoved = false;
        if (this.player.isMoving || this.player.isSpinning) return playerMoved;
        const y = positionVec.y;
        const x = positionVec.x;
        let locationMatrix = this.ground.locationMatrix;
        if (x <= 0) { // reached left boundary
            console.log("Player reached left boundary");
        } else if (locationMatrix[y][x-1] == Const.wall){ // reached left wall
            console.log("Player reached a wall in left direction");
        } else if (locationMatrix[y][x-1] == Const.box) {
            if (x <= 1 || locationMatrix[y][x-2] != Const.empty) {
                console.log("The box cannot move left");
            } else {
                locationMatrix[y][x-2] = Const.box;
                locationMatrix[y][x-1] = Const.player;
                locationMatrix[y][x] = Const.empty;
                const newPlayerIdx = new Vec2(x-1, y);
                const newBoxIdx = new Vec2(x-2, y);

                // move box and player
                let box = this.getBox(new Vec2(x-1, y)) as unknown as PushBoxBoxNodeModel;
                let boxController = this.getBoxContoller(box);
                this.playerController?.move(this.player.moveDuration,
                    this.ground.vectorToPosition(newPlayerIdx));
                boxController?.move(box.moveDuration,
                    this.ground.vectorToPosition(newBoxIdx));

                // update matrix index
                this.player.matrixIdx = newPlayerIdx;
                box.matrixIdx = newBoxIdx;
                playerMoved = true;
            }
        } else {
            if (this.ground.locationMatrix[y][x - 1] == Const.gem) {
                const subscriptionHandle = uuidv4();
                this.appState.subscribe(this.appState.appClock.CreateTimedAction(
                        () => {
                        },
                        0.5,
                        () => {
                            this.appState.unsubscribe(subscriptionHandle);
                            let vec = new Vec2(x - 1, y);
                            for (let i = 0; i < this.appState.gems.length; i++) {
                                let gem = this.appState.gems[i];
                                if (gem.matrixIdx.isEqualTo(vec)) {
                                    this.appState.gems.splice(i, 1);
                                    this.appState.sceneModel.removeNode(gem);
                                    break;
                                }
                            }
                        }),
                    subscriptionHandle
                );
            }

            this.ground.locationMatrix[y][x - 1] = Const.player;
            this.ground.locationMatrix[y][x] = Const.empty;
            const newPlayerIdx = new Vec2(x - 1, y);

            // move player
            this.playerController?.move(this.player.moveDuration,
                this.ground.vectorToPosition(newPlayerIdx));

            // update matrix index
            this.player.matrixIdx = newPlayerIdx;
            playerMoved = true;
        }

        return playerMoved;
    }

    moveRight(positionVec:Vec2):boolean {
        let playerMoved = false;
        if (this.player.isMoving || this.player.isSpinning) return playerMoved;
        const y = positionVec.y;
        const x = positionVec.x;
        let locationMatrix = this.ground.locationMatrix;
        if (x >= locationMatrix.length-1) { // reached right boundary
            console.log("Player reached right boundary");
        } else if (locationMatrix[y][x+1] == Const.wall){ // reached right wall
            console.log("Player reached a wall in right direction");
        } else if (locationMatrix[y][x+1] == Const.box) {
            if (x >= locationMatrix.length-2 || this.ground.locationMatrix[y][x+2] != Const.empty) {
                console.log("The box cannot move right");
            } else {
                this.ground.locationMatrix[y][x+2] = Const.box;
                this.ground.locationMatrix[y][x+1] = Const.player;
                this.ground.locationMatrix[y][x] = Const.empty;
                const newPlayerIdx = new Vec2(x+1, y);
                const newBoxIdx = new Vec2(x+2, y);

                // move box and player
                let box = this.getBox(new Vec2(x+1, y)) as unknown as PushBoxBoxNodeModel;
                let boxController = this.getBoxContoller(box);
                this.playerController?.move(this.player.moveDuration,
                    this.ground.vectorToPosition(newPlayerIdx));
                boxController?.move(box.moveDuration,
                    this.ground.vectorToPosition(newBoxIdx));

                // update matrix index
                this.player.matrixIdx = newPlayerIdx;
                box.matrixIdx = newBoxIdx;
                playerMoved = true;
            }
        } else {
            if (this.ground.locationMatrix[y][x + 1] == Const.gem) {
                const subscriptionHandle = uuidv4();
                this.appState.subscribe(this.appState.appClock.CreateTimedAction(
                        () => {
                        },
                        0.5,
                        () => {
                            this.appState.unsubscribe(subscriptionHandle);
                            let vec = new Vec2(x + 1, y);
                            for (let i = 0; i < this.appState.gems.length; i++) {
                                let gem = this.appState.gems[i];
                                if (gem.matrixIdx.isEqualTo(vec)) {
                                    this.appState.gems.splice(i, 1);
                                    this.appState.sceneModel.removeNode(gem);
                                    break;
                                }
                            }
                        }),
                    subscriptionHandle
                );
            }

            this.ground.locationMatrix[y][x + 1] = Const.player;
            this.ground.locationMatrix[y][x] = Const.empty;
            const newPlayerIdx = new Vec2(x + 1, y);

            // move player
            this.playerController?.move(this.player.moveDuration,
                this.ground.vectorToPosition(newPlayerIdx));

            // update matrix index
            this.player.matrixIdx = newPlayerIdx;
            playerMoved = true;
        }

        return playerMoved;
    }

    onKeyUp(interaction:AKeyboardInteraction, event:AInteractionEvent){
        this.playerController?.onKeyUp(interaction, event);

    }

}
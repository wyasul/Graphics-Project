import {
    AMaterialManager,
    ASceneNodeModel,
    Color,
    Mat3,
    NodeTransform3D,
    Quaternion,
    V3,
    Vec2,
    Vec3
} from "../../anigraph";
import {PushBoxPlayerNodeModel} from "../Nodes/PushBoxPlayer/PushBoxPlayerNodeModel";
import {PushBoxPlayerNodeController} from "../Nodes/PushBoxPlayer/PushBoxPlayerNodeController";
import {EnemyNodeModel} from "../Nodes/Enemy/EnemyNodeModel";
import {PushBoxGameControls} from "../PlayerControls/PushBoxGameControls";
import {StarterAppState} from "./StarterAppState";
import {RingNodeModel} from "../Nodes/ExampleProcedureGeometry/RingNodeModel";
import {RingSegment} from "../Nodes/ExampleProcedureGeometry/RingSegment";
import {GroundModel} from "../Nodes/Ground/GroundModel";
import {GemNodeModel} from "../Nodes/PushBoxGem/GemNodeModel";
import {Const} from "../Const";
import {PushBoxBoxNodeModel} from "../Nodes/PushBoxBox/PushBoxBoxNodeModel";
import {PushBoxLeafNodeModel} from "../Nodes/PushBoxLeaf/PushBoxLeafNodeModel";
import {PushBoxBoxNodeController} from "../Nodes/PushBoxBox/PushBoxBoxNodeController";
import {PushBoxWallNodeModel} from "../Nodes/PushBoxWall/PushBoxWallNodeModel";
import {PushBoxGoalNodeModel} from "../Nodes/PushBoxGoal/PushBoxGoalNodeModel";


export class PushBoxGameAppState extends StarterAppState {

    /**
     * We will control the dragon in our example game
     * @type {PushBoxPlayerNodeModel}
     */
    player!:PushBoxPlayerNodeModel;
    boxes:PushBoxBoxNodeModel[] = [];
    goals: PushBoxGoalNodeModel[] = [];
    gems: GemNodeModel[] = [];
    gemSpeed: number = 1;


    /**
     * A convenient getter for accessing the dragon's scene controller in the game view, which we have customized
     * in Nodes/Dragon/DragonNodeController.ts
     * @returns {ASceneNodeController<ASceneNodeModel> | undefined}
     */
    get playerController(): PushBoxPlayerNodeController | undefined {
        return this.getGameNodeControllerForModel(this.player) as PushBoxPlayerNodeController | undefined;
    }

    getBoxController(box:PushBoxBoxNodeModel): PushBoxBoxNodeController {
        return this.getGameNodeControllerForModel(box) as PushBoxBoxNodeController;
    }

    // For debugging, you can customize what happens when you select a model in the SceneGraph view (Menu->Show Scene Graph)
    handleSceneGraphSelection(m: any) {
        this.selectionModel.selectModel(m);
        console.log(`Model: ${m.name}: ${m.uid}`)
        console.log(m);
        console.log(`Transform with position:${m.transform.position}\nrotation: ${m.transform.rotation} \nmatrix:\n${m.transform.getMatrix().asPrettyString()}`)
    }

    genRotationMatrixAroundX(angle: number): Mat3 {
        return new Mat3(1, 0, 0,
            0, Math.cos(angle), -Math.sin(angle),
            0, Math.sin(angle), Math.cos(angle));
    }


    genRotationMatrixAroundZ(angle: number): Mat3 {
        return new Mat3(Math.cos(angle), -Math.sin(angle), 0,
            Math.sin(angle), Math.cos(angle), 0,
            0, 0, 1);
    }

    genRotationMatrixAroundY(angle: number): Mat3 {
        return new Mat3(Math.cos(angle), 0, Math.sin(angle),
            0, 1, 0,
            -Math.sin(angle), 0, Math.cos(angle));
    }

    normalize(vector: Vec3): Vec3 {
        vector.normalize();
        return vector;
    }

    addTreeModel() {
        let tree = new RingNodeModel();
        tree.segments = this.genBranches();
        tree.color.a = 0;
        this.setNodeMaterial(tree, 'Toon');
        return tree;
    }

    async addLeafModel() {
        let ringModels = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
            return node instanceof RingNodeModel;
        }) as RingNodeModel[];

        for (let ringModel of ringModels) {
            for (let s of ringModel.segments) {
                if (s.isLast) {
                    s.colors = [Color.FromString('#3A5F0B')];
                    for (let c of s.colors) c.a=0;
                    let sphere = await PushBoxLeafNodeModel.CreateDefaultNode();
                    sphere.color = Color.FromString('#00ff00');
                    sphere.color.a = 1;
                    sphere.transform.position = s.end.plus(ringModel.transform.position);
                    sphere.transform.scale = 2 * s.radius;
                    sphere.branchPosition = sphere.transform.position;
                    sphere.size = 2 * s.radius;
                    this.sceneModel.addNode(sphere);
                }
            }
        }
    }

    genBranches(start: Vec3 = V3(0, 0, 0), angle: number = Math.PI / 4, radius: number = 3 * 0.5, length: number = 25*0.4): Array<RingSegment> {
        let end: Vec3;
        end = start.plus(V3(0, 0, length));

        let dir = this.normalize(end.minus(start));

        let leftDir = this.genRotationMatrixAroundY(angle).times(dir);
        let leftEnd = leftDir.times(length).plus(end);
        let rightDir = this.genRotationMatrixAroundY(-angle).times(dir);
        let rightEnd = rightDir.times(length).plus(end);

        let backDir = this.genRotationMatrixAroundX(angle).times(dir);
        let frontDir = this.genRotationMatrixAroundX(-angle).times(dir);
        let backEnd = backDir.times(length).plus(end);
        let frontEnd = frontDir.times(length).plus(end);

        let branchColor = Color.FromString('#ffffff');
        let leftBranch = this.genBranchesHelper(leftDir, leftEnd, angle, radius * 0.8, length * 0.7);
        let rightBranch = this.genBranchesHelper(rightDir, rightEnd, angle, radius * 0.8, length * 0.7);
        let backBranch = this.genBranchesHelper(backDir, backEnd, angle, radius * 0.8, length * 0.7);
        let frontBranch = this.genBranchesHelper(frontDir, frontEnd, angle, radius * 0.8, length * 0.7);

        return [
            new RingSegment(start, end, radius, [branchColor]),
            new RingSegment(end, rightEnd, radius, [branchColor]),
            new RingSegment(end, leftEnd, radius, [branchColor]),
            new RingSegment(end, backEnd, radius, [branchColor]),
            new RingSegment(end, frontEnd, radius, [branchColor]),
        ].concat(leftBranch).concat(rightBranch).concat(backBranch).concat(frontBranch);
    }

    genBranchesHelper(prevDir: Vec3, start: Vec3, angle: number, radius: number, length: number) {
        if (length < 15 * 0.4 || radius < 0.5) return Array<RingSegment>();

        let leftDir = this.genRotationMatrixAroundY(angle).times(prevDir);
        let leftEnd = leftDir.times(length).plus(start);
        let rightDir = this.genRotationMatrixAroundY(-angle).times(prevDir);
        let rightEnd = rightDir.times(length).plus(start);

        let backDir = this.genRotationMatrixAroundX(angle).times(prevDir);
        let frontDir = this.genRotationMatrixAroundX(-angle).times(prevDir);
        let backEnd = backDir.times(length).plus(start);
        let frontEnd = frontDir.times(length).plus(start);

        let leftBranch: Array<RingSegment> = this.genBranchesHelper(leftDir, leftEnd, angle, radius * 0.8, length * 0.6);
        let rightBranch: Array<RingSegment> = this.genBranchesHelper(rightDir, rightEnd, angle, radius * 0.8, length * 0.6);
        let backBranch: Array<RingSegment> = this.genBranchesHelper(backDir, backEnd, angle, radius * 0.8, length * 0.6);
        let frontBranch: Array<RingSegment> = this.genBranchesHelper(frontDir, frontEnd, angle, radius * 0.8, length * 0.6);

        let branchColor = Color.FromString('#ffffff');

        let rightSegment = new RingSegment(start, rightEnd, radius, [branchColor, branchColor]);
        rightSegment.isLast = rightBranch.length == 0;
        let leftSegment = new RingSegment(start, leftEnd, radius, [branchColor, branchColor]);
        leftSegment.isLast = leftBranch.length == 0;
        let backSegment = new RingSegment(start, backEnd, radius, [branchColor, branchColor]);
        backSegment.isLast = backBranch.length == 0;
        let frontSegment = new RingSegment(start, frontEnd, radius, [branchColor, branchColor]);
        frontSegment.isLast = frontBranch.length == 0;

        return [
            rightSegment, leftSegment, frontSegment, backSegment,
        ].concat(leftBranch).concat(rightBranch).concat(rightBranch).concat(backBranch).concat(frontBranch);
    }

    updateLeaves(t: number) {
        let leaves = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
            return node instanceof PushBoxLeafNodeModel;
        }) as PushBoxLeafNodeModel[];

        let falling = 0, changingColor = 0, reGening = 0;

        for (let leaf of leaves) {
            if (leaf.leafFalling) falling += 1;
            else if (leaf.reGrow) reGening += 1;
            else changingColor += 1;
        }

        // console.log("coloring: " + changingColor + " falling: " + falling + " reGening: " + reGening);

        for (let leaf of leaves) {
            if (!leaf.leafFalling && !leaf.reGrow && changingColor !== 0 && reGening == 0) {
                let green = Color.FromString('#00ff00');
                let yellow = Color.FromString('#ff9705');
                let colorDiff = yellow.minus(green);
                leaf.leafFalling = leaf.color.r > 0.95;
                leaf.color = green.plus(colorDiff.times(Math.sin(0.012 * (t-leaf.reGenTime) * 180 / Math.PI)));

            } else if (leaf.leafFalling && falling !== 0 && changingColor == 0) {
                let toGround = leaf.transform.getObjectSpaceOrigin().minus(
                    V3(leaf.transform.getObjectSpaceOrigin().x, leaf.transform.getObjectSpaceOrigin().y, 0)).times(-1);
                leaf.transform.position = leaf.transform.getObjectSpaceOrigin().plus(toGround.getNormalized().times(leaf.leafSpeed * 0.2));
                if (Math.abs(toGround.z) * 0.1 < 0.5) {
                    leaf.transform.scale = 0;
                    leaf.reGrow = true;
                    leaf.leafFalling = false;
                    leaf.fallEndTime = t;
                } else
                    leaf.color.a = leaf.transform.position.z * 0.1;

            } else if (leaf.reGrow && reGening !== 0 && falling == 0) {
                if (Math.abs(leaf.transform.scale.x) > Math.abs(leaf.size) * 0.8) {
                    leaf.reGrow = false;
                    leaf.reGenTime = t;
                }
                leaf.color = Color.FromString('#00ff00');
                leaf.transform.position = leaf.branchPosition;
                leaf.transform.scale = Math.abs(leaf.size) * Math.min(0, Math.sin((t-leaf.fallEndTime) * 0.03 * 180 / Math.PI));
            }
        }
    }


    updateFloatingGem(t: number) {
        let gems = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
            return node instanceof GemNodeModel;
        }) as GemNodeModel[];
        for (let gem of gems) {
            let sa = 0.5;
            let sb = 2;
            let sc = 2;
            gem.transform.rotation = Quaternion.RotationZ(sa * t * Math.PI);
            gem.transform.position = V3(gem.transform.position.x, gem.transform.position.y, 6 + 4 * (1 + Math.sin(sb * t)));
            gem.material.setModelColor(gem.color.Spun(t));
        }
    }

    moveCamera(t:number) {
        let x = this.player.getWorldPosition().x;
        let y = this.player.getWorldPosition().y;
        let z = this.player.getWorldPosition().z;
        let v = V3(x, y - 45, z + 45);
        this.gameSceneController.camera.setPose(
            NodeTransform3D.LookAt(v, V3(x, y, z), V3(0, 0, -1))
        )
    }

    async clearScreen() {
        this.goals = [];
        this.boxes = [];
        this.gems = [];
        let nodeList = this.sceneModel.getNodeList()
        for (let i = 0; i < nodeList.length; i++){
            if (!(nodeList[i] instanceof GroundModel) && !(nodeList[i] instanceof EnemyNodeModel)) {
                if (nodeList[i] instanceof PushBoxGoalNodeModel) {
                    (nodeList[i] as PushBoxGoalNodeModel).intensity = 0;
                }
                this.sceneModel.removeNode(nodeList[i]);
            }
        }
    }

    async initPushBoxGame(startInGameMode: boolean = true) {
        const self = this;

        // add a ground plane
        await self._addGroundPlane();

        let enemy2 = new EnemyNodeModel();
        this.sceneModel.addNode(enemy2);
        enemy2.setTransform(new NodeTransform3D(V3(300, 200, 150)));
        enemy2.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());

        await this.loadPushBoxGame();
    }

    async updatePushBoxGame(startInGameMode: boolean = true) {
        await this.loadPushBoxGame();
    }

    async loadPushBoxGame() {

        let ground = this.getGroundModel();

        // populate map
        let itemList = ground.matrixToPositions();
        for (let i=0; i<itemList.length; i++){
            if (itemList[i][1] == Const.player) {
                this.player = await PushBoxPlayerNodeModel.CreateDefaultNode();
                this.sceneModel.addNode(this.player);
                this.player.color = Color.FromString('#ffff00');
                this.player.matrixIdx = itemList[i][2];
                this.player.transform.rotation = Quaternion.RotationZ(0);
                this.player.transform.position = itemList[i][0];
                this.player.transform._scale = new Vec3(1.5,1.5,1.5);
                console.log("player: " + this.player.transform.position.z)

            }
            else if (itemList[i][1] == Const.box) {
                let box = await PushBoxBoxNodeModel.CreateDefaultNode();
                this.sceneModel.addNode(box);
                box.matrixIdx = itemList[i][2];
                box.color = Color.FromString('#0000ff');
                box.transform.rotation = Quaternion.RotationZ(Math.PI);
                box.transform.scale=ground.cellSize;
                box.transform.position = itemList[i][0];
                box.transform._scale = new Vec3(0.65,0.65,0.65);
                console.log("Box: " + box.transform.position.z)
                this.boxes.push(box);

            }
            else if (itemList[i][1] == Const.wall) {
                let wall = await PushBoxWallNodeModel.CreateDefaultNode();
                this.sceneModel.addNode(wall);
                wall.color = new Color(200,200,200);
                wall.color.a = 1;
                wall.transform.position = itemList[i][0]
                wall.transform._scale = new Vec3(4.5, 4.5, 4.5)
                wall.transform._scale.z = wall.transform._scale.z * 0.9
                console.log("wall: " + wall.transform.position.z)

            } else if (itemList[i][1] == Const.gem) {
                // Add Gem procedural geometry
                let gem = await GemNodeModel.CreateDefaultNode();
                this.sceneModel.addNode(gem);
                gem.matrixIdx = itemList[i][2];
                gem.transform.position = itemList[i][0];
                gem.transform.scale = V3(0.5, 0.5, 1).times(2);
                this.gems.push(gem);

            } else if (itemList[i][1] == Const.tree) {
                // Factorial Tree Playground
                // Add Gem procedural geometry
                let treePosition = itemList[i][0]
                let tree = this.addTreeModel();
                tree.transform.position = treePosition;
                this.sceneModel.addNode(tree);
                await this.addLeafModel();
            }
        }

        // populate goal
        const goalMatrix = ground.goalMatrix;
        const locationMatrix = ground.locationMatrix;
        for (let i = 0; i < goalMatrix.length; i++) {
            for (let j = 0; j < goalMatrix[0].length; j++) {
                if (goalMatrix[i][j] == Const.goal) {
                    let goal = new PushBoxGoalNodeModel();
                    this.sceneModel.addNode(goal);
                    goal.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());
                    let goalPosition = ground.vectorToPosition(new Vec2(j, i));
                    goalPosition.z = 1;
                    goal.transform.position = goalPosition;
                    goal.transform.scale = 0.1;
                    if (locationMatrix[i][j] == Const.box) { // a box spawns directly on top
                        goal.color = new Color(0, 255, 0);
                        goal.intensity = 0.001;
                    } else {
                        goal.color = new Color(0, 0, 255);
                        goal.intensity = 0.01;
                    }
                    goal.matrixIdx = new Vec2(j, i);
                    this.goals.push(goal);
                }
            }
        }

        // activate the example third person controls...
        this.gameSceneController.setCurrentInteractionMode(PushBoxGameControls);

        // Pro tip: try pressing 'P' while in orbit mode to print out a camera pose to the console...
        // this will help you set up your camera in your scene...
        let x = this.player.getWorldPosition().x
        let y = this.player.getWorldPosition().y
        let z = this.player.getWorldPosition().z
        let v = V3(x, y-50, z+55)
        this.gameSceneController.camera.setPose(
            NodeTransform3D.LookAt(v, V3(x, y, z), V3(0, 0, -1))
        )

        // Factorial Tree Playground
        // let tree = this.addTreeModel();
        // tree.transform.position = V3(-50, 50, 0);
        // this.sceneModel.addNode(tree);
        // await this.addLeafModel();
    }

    examplePushBoxGameCallback() {
        //     // You can get the current time, and the amount of time that has passed since
        //     // the last frame was rendered...
        //     let currentGameTime = this.appClock.time;
        //     let timeSinceLastFrame = this.timeSinceLastFrame;
        //
        //     // let's get all of the gem nodes...
        let gems = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
            return node instanceof GemNodeModel;
        });

        for (let l of gems) {
            // let's get the vector from a gem to the player...
            let gem2Player = this.player.transform.position.minus(l.transform.getObjectSpaceOrigin());

            // if the player is within the gem's detection range then
            if (gem2Player.L2() < this.getGroundModel().cellSize) {
                // Chase player
                l.transform.position = l.transform.getObjectSpaceOrigin().plus(gem2Player.getNormalized().times(this.gemSpeed))

                l.transform.anchor = V3(0, 0, 0);
            }
        }

        // you can also get time since last frame with this.timeSinceLastFrame
        this.updateFloatingGem(this.appClock.time);
        this.updateLeaves(this.appClock.time);
        this.moveCamera(this.appClock.time);
        // you can also get time since last frame with this.timeSinceLastFrame
        // this.updateSpinningArms(this.appClock.time);

        // Note that you can get the bounding box of any model by calling
        // e.g., for the dragon, this.dragon.getBounds()
        // or for an enemy model enemy.getBounds()

    }

    async initSceneModel() {
        // this will run the dragon game... replace with another init example to start in orbit view.
        let startInPlayerMode: boolean = true;
        await this.initPushBoxGame(startInPlayerMode);
    }

    /**
     * Basic animation loop
     */
    onAnimationFrameCallback() {
        super.onAnimationFrameCallback()
        if (this.player) {
            this.examplePushBoxGameCallback();
        }
    }

    getGroundModel(): GroundModel {
        return this.sceneModel.filterNodes((node: ASceneNodeModel) => {
            return node instanceof GroundModel;
        }).pop() as GroundModel;
    }

}
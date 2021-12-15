import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {
    AMaterialManager,
    AObjectState,
    ASerializable,
    BezierTween,
    Color, Vec2,
    Vec3,
    VertexArray3D
} from "../../../anigraph";
import * as THREE from "three";
import {button} from "leva";
import {ATexture} from "../../../anigraph/arender/ATexture";
import {GroundMaterialModel} from "../../Materials/GroundMaterialModel";
import {Const} from "../../Const";
import levels from "./levels.json"

@ASerializable("GroundModel")
export class GroundModel extends AMeshModel{
    @AObjectState noiseAmplitude:number;
    @AObjectState textureWraps:number;

    numRow:number = 12;
    numCol:number = 12;
    cellSize:number = 10;
    level:number = 1;

    locationMatrix:number[][];
    goalMatrix:number[][];


    //Here comes the design of the map:
    //Map is a 12x12 grid represented by a matrix.
    //Each matrix element represents a square of cell (10x10) that contains an item.
    //The value stored in the matrix represents the type of the item (e.g. 0: empty).
    //Start with small map to do experiments.

    constructor(size:number=120, level:number=1) {
        super();
        this.selectable = false; // Don't want clicking on the ground to select it
        this.noiseAmplitude=10;
        this.textureWraps=10;
        this.reRoll(size);
        this.level = level;
        [this.locationMatrix, this.goalMatrix] = Const.level1()

    }

    //add levels here
    updateMatrix(level:number) {

        if (level == 1) {
            [this.locationMatrix, this.goalMatrix] = Const.level1()
        }
        if (level == 2) {
            [this.locationMatrix, this.goalMatrix] = Const.level2()
        }
        if(level == 3){
            [this.locationMatrix, this.goalMatrix] = Const.level3()
        }
        if (level == 4) {
            [this.locationMatrix, this.goalMatrix] = Const.level4()
         }
        if (level == 5) {
            [this.locationMatrix, this.goalMatrix] = Const.level5()
        }
        if (level == 6) {
            [this.locationMatrix, this.goalMatrix] = Const.level6()
        }
        if (level == 7) {
            [this.locationMatrix, this.goalMatrix] = Const.level7()
        }
        if (level == 8) {
            [this.locationMatrix, this.goalMatrix] = Const.level8()
        }
        if (level == 9) {
            [this.locationMatrix, this.goalMatrix] = Const.level9()
        }
        if (level == 10) {
            [this.locationMatrix, this.goalMatrix] = Const.level10()
        }
        if (level == 11) {
            [this.locationMatrix, this.goalMatrix] = Const.level11()
        }
        if (level == 12) {
            [this.locationMatrix, this.goalMatrix] = Const.level12()
        }
        if (level == 13) {
            [this.locationMatrix, this.goalMatrix] = Const.level13()
        }
        else return[[],[]]
    }




    /**
     * Define this to customize what gets created when you click the create default button in the GUI
     * @constructor
     */
    static async CreateDefaultNode(texture?:string|ATexture, ...args:any[]){
        await GroundMaterialModel.ShaderPromise;
        let groundNode = new GroundModel();
        groundNode.name = 'GroundPlane';
        groundNode.transform.position.z = -10;
        groundNode.setMaterial('ground');
        groundNode.color = Color.Random();
        return groundNode;
    }

    reRoll(size:number=1000, textureWraps?:number, nSamplesPerSide?:number){
        // doesn't use nSamplesPerSide yet...
        if(textureWraps !== undefined){this.textureWraps=textureWraps;}
        this.verts = VertexArray3D.SquareXYUV(size, this.textureWraps);
    }

    getModelGUIControlSpec(): { [p: string]: any } {
        const self = this;
        const specs = {
            Reroll: button(() => {
                self.reRoll();
            }),
            Noise: {
                value: self.noiseAmplitude,
                min: 0,
                max: 100,
                step: 0.2,
                onChange(v:any){
                    self.noiseAmplitude=v;
                }
            }
        }
        return {...super.getModelGUIControlSpec(),...specs};
    }

    //Can define levels here
    // initMatrix(level:number) {
    //     let locationMatrix:number[][] = [];
    //     let goalMatrix:number[][] = [];
    //     if (level == 1) {
    //         locationMatrix = [
    //              [3,3,3,0,0,0,0,0,0,0,0,3],
    //              [0,0,0,0,0,0,0,0,0,0,0,0],
    //              [0,0,0,0,0,2,0,0,0,2,0,0],
    //              [0,0,0,0,3,1,3,0,0,0,0,0],
    //              [3,0,0,0,3,0,0,3,3,0,0,0],
    //              [0,0,0,3,3,0,0,0,3,0,0,0],
    //              [0,0,3,0,0,0,0,0,3,0,0,0],
    //              [0,0,3,0,0,0,0,3,3,0,0,0],
    //              [0,0,3,0,0,0,0,0,0,3,0,0],
    //              [0,3,0,0,0,7,0,0,0,3,0,0],
    //              [0,3,0,0,3,0,3,0,3,3,0,0],
    //              [3,0,3,3,3,0,3,3,3,0,0,3]
    //          ];
    //         goalMatrix = [
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,4,4,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //             [0,0,0,0,0,0,0,0,0,0,0,0],
    //         ]
    //     }
    //     return [locationMatrix, goalMatrix];
    // }

    //Convert from object's coordinate to indices for querying matrix
    getMatrixIdx(position:Vec3){
        let idxs:Array<number> = new Array<number>(), idxRow: number, idxCol: number;
        idxRow = -(position.y-55) / this.cellSize;
        idxCol = (position.x+55) / this.cellSize;
        idxs.push(idxRow);
        idxs.push(idxCol);
        // console.log(idxs);
        return idxs;
    }

    //Gives all nonzero items of matrix as [position, type number]
    matrixToPositions() {
        // console.log(this.goalMatrix)
        let itemList: Array<any>[] = []
        for (let i=0; i<this.locationMatrix.length; i++) {
            for (let j=0; j<this.locationMatrix[0].length;j++){
                if (this.locationMatrix[i][j] !== 0) {
                    let positiony = -i*this.cellSize + 55;
                    let positionx = j*this.cellSize - 55;
                    let position = new Vec3(positionx, positiony, 0);
                    itemList.push([position, this.locationMatrix[i][j], new Vec2(j, i)])
                }
            }
        }
        return itemList
    }

    // Given a vector, calculate the world position
    vectorToPosition(vec:Vec2) {
        let newVec = new Vec3();
        newVec.y = -vec.y*this.cellSize + 55;
        newVec.x = vec.x*this.cellSize - 55;
        newVec.z = 0;
        return newVec;
    }

    // Get the 12x12 Index of the player
    // searchPlayer() {
    //     let vec = new Vec2();
    //     for (let i = 0; i < this.locationMatrix.length; i++) {
    //         for (let j = 0; j < this.locationMatrix[0].length; j++){
    //             if (this.locationMatrix[i][j] == Const.player) {
    //                 vec.y = i;
    //                 vec.x = j;
    //             }
    //         }
    //     }
    //     return vec;
    // }

    // updateMatrix(oldPosition:Vec3, newPosition:Vec3, type:string){
    //     //If no position change, return directly
    //     if (oldPosition.isEqualTo(newPosition)) return;
    //
    //     //update new position in matrix
    //     let idxs = this.getMatrixIdx(oldPosition);
    //     let idxRow = idxs[0], idxCol = idxs[1];
    //     this.locationMatrix[idxRow][idxCol] = Const.empty;
    //     // console.log("position: "+oldPosition);
    //     // console.log("New position: " + newPosition);
    //     // console.log("old position: " + idxRow+", "+idxCol+" changed to "+this.locationMatrix[idxRow][idxCol]);
    //
    //     //remove the old position in matrix
    //     idxs = this.getMatrixIdx(newPosition);
    //     idxRow = idxs[0];
    //     idxCol = idxs[1];
    //     // console.log("new position: " + idxRow+", "+idxCol);
    //     // console.log(" changed to "+this.locationMatrix[idxRow][idxCol]);
    //     this.locationMatrix[idxRow][idxCol] = this.getItemType(type);
    // }

    // initItemInMatrix(position:Vec3, type:string){
    //     let idxs = this.getMatrixIdx(position);
    //     let idxX = idxs[0], idxY = idxs[1];
    //     this.locationMatrix[idxY][idxX] = this.getItemType(type);
    //
    // }

    // getItemType(type:string):number{
    //     switch (type) {
    //         case "empty": return 0;
    //         case "player": return 1;
    //         case "box": return 2;
    //         case "wall": return 3
    //         // Add more types here
    //         case "gem": return 7;
    //         case "tree": return 8;
    //         case "rock": return 9;
    //     }
    //     return -1;
    // }

    hasReachUpBoundary(position:Vec3):boolean{
        return this.getMatrixIdx(position)[0] == this.numRow-1;
    }

    hasReachBottomBoundary(position:Vec3):boolean{
        return this.getMatrixIdx(position)[0] == 0;
    }

    hasReachLeftBoundary(position:Vec3):boolean{
        return this.getMatrixIdx(position)[1] == 0;
    }

    hasReachRightBoundary(position:Vec3):boolean{
        return this.getMatrixIdx(position)[1] == this.numCol-1;
    }

}
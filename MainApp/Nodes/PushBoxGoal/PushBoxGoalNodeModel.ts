import {APointLightModel, V3, Vec2, Vec3} from "../../../anigraph";


export class PushBoxGoalNodeModel extends APointLightModel{
    size:number=1;
    matrixIdx:Vec2;

    constructor() {
        super();
        this.matrixIdx = new Vec2(0, 0);
    }
}

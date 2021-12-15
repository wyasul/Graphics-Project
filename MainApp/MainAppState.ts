import * as THREE from "three";
import {TexturedMaterialModel} from "./Materials/TexturedMaterialModel";
import {ATexture} from "../anigraph/arender/ATexture";
import {GroundMaterialModel} from "./Materials/GroundMaterialModel";
import {StarterAppState} from "./StarterAppState/StarterAppState";
import {DragonGameAppState} from "./StarterAppState/DragonGameAppState";
import {PushBoxGameAppState} from "./StarterAppState/PushBoxGameAppState"



export class MainAppState extends PushBoxGameAppState{
// export class MainAppState extends StarterAppState{
    /**
     * Load any assets you want to use (e.g., custom textures, shaders, etc)
     * @returns {Promise<void>}
     * @constructor
     */
    async PrepAssets(){
        // you can delete or replace setting the textures and shaders below if you don't want to use them.
        let trippyTexture = await ATexture.LoadAsync('./images/trippy.jpeg');
        let marbleTexture = await ATexture.LoadAsync('./images/marble.jpg');
        let groundTexture = await ATexture.LoadAsync('./images/ground.jpg');
        let gemTexture = await ATexture.LoadAsync('./images/blue.jpg');
        let wallTexture = await ATexture.LoadAsync('./images/diamond.png');
        let chestTexture = await ATexture.LoadAsync('./images/chest.png');
        let steveTexture = await ATexture.LoadAsync('./images/steve.png');
        await this.materials.setMaterialModel('trippy', new TexturedMaterialModel(trippyTexture));
        await this.materials.setMaterialModel('marble', new TexturedMaterialModel(marbleTexture));
        await this.materials.setMaterialModel('ground', new GroundMaterialModel(groundTexture));
        await this.materials.setMaterialModel('gem', new TexturedMaterialModel(gemTexture));
        await this.materials.setMaterialModel('wall', new TexturedMaterialModel(wallTexture));
        await this.materials.setMaterialModel('chest', new TexturedMaterialModel(chestTexture));
        await this.materials.setMaterialModel('steve', new TexturedMaterialModel(steveTexture));

    }

    /**
     * We will add the custom parameters to the gui controls with leva...
     * @returns {{enemySpeed: {min: number, max: number, step: number, value: number}}}
     */
    getControlPanelStandardSpec(): {} {
        const self = this;
        return {
            ...super.getControlPanelStandardSpec(),
            // other custom app-level specs
        }
    };

    // For debugging, you can customize what happens when you select a model in the SceneGraph view (Menu->Show Scene Graph)
    handleSceneGraphSelection(m:any){
        this.selectionModel.selectModel(m);
        console.log(`Model: ${m.name}: ${m.uid}`)
        console.log(m);
        console.log(`Transform with position:${m.transform.position}\nrotation: ${m.transform.rotation} \nmatrix:\n${m.transform.getMatrix().asPrettyString()}`)
    }



    /**
     * Initialize the scene model
     * @returns {Promise<void>}
     */
    async initSceneModel() {
        // delete this and replace with your own code
        await super.initSceneModel()
        // this.initDebug();
    }

    /**
     * Basic animation loop
     */
    onAnimationFrameCallback(){
        // delete this and replace with your own code
        super.onAnimationFrameCallback()
    }
}

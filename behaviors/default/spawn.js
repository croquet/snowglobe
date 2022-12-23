class SpawnActor{
    setup(){
        this.dataloc = this._cardData.spawnDataLocation;
        this.trans = this._cardData.spawnTranslation;
        this.spawnScale = this._cardData.spawnScale;
        this.rot = this._cardData.spawnRotation;
        this.dataTrans= this._cardData.spawnDataTranslation;//||[0,0,0];
        this.dataRot = this._cardData.spawnDataRotation;//||[0,0,0];
        this.behavior = this._cardData.spawnBehaviors;
        this.type = this._cardData.spawnType;
        this.radius = this._cardData.spawnRadius;
        //this.listen("spawn","spawn")
        this.frontPos = this._cardData.frontPos;
        this.addEventListener("pointerDown", "spawn");
    }
    spawn(){
        console.log(this.trans);
        this.publish("spawn", "spawn", {
            name: "spawned_object",
            type: this.type,
            dataLocation: this.dataloc,
            dataTranslation:this.dataTrans,
            dataRotation:this.dataRot,
            translation: this.trans,
            rotation: this.rot,
            behaviorModules: this.behavior,
            layers: ["pointer"],
            cornerRadius: 0.02,
            dataScale: this.spawnScale,
            fullBright: false,
            shadow: true,
            radius:this.radius,
        });
    }
}

class TinySnowBallPawn {
    setup() {
        this.radius = this.actor._cardData.radius;
        let geometry = new Microverse.THREE.SphereGeometry(this.radius,32,32);
        let material =  new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xFFFFFF});
        let snowball = new Microverse.THREE.Mesh(geometry, material);
        snowball.position.set(0,0,0);
        this.shape.add(snowball);

    }
}


class CoalPawn {
    setup() {
        //let geometry = new Microverse.THREE.SphereGeometry(1,32,32);
        //let material =  new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xFFFFFF});
        //let snowball = new Microverse.THREE.Mesh(geometry, material);
        //snowball.position.set(0,0,0);
        //this.shape.add(snowball);
        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
        this.listen("reparent", "reparent");
        this.front_pos = this.actor._cardData.frontPos;//||12;
    }

    reparent(parent) {
        if (parent && !this.parent) {
            // make our rotation and translation relative to the new parent
            let {m4_invert, m4_multiply, m4_getTranslation, m4_getRotation} = Microverse;
            let relativeToParent = m4_multiply(this.global, m4_invert(parent.global));
            let translation = m4_getTranslation(relativeToParent);
            let rotation = m4_getRotation(relativeToParent);
            this.set({parent, translation, rotation});
        } else if (!parent && this.parent) {
            // use our global transform as our own translation and rotation
            let {m4_getTranslation, m4_getRotation} = Microverse;
            let translation = m4_getTranslation(this.global);
            let rotation = m4_getRotation(this.global);
            this.set({parent, translation, rotation});
        }
    }

    pointerMove(evt) {
        if (!this.dragInfo) {return;}

        // do a raycast to find objects behind this one
        let render = this.service("ThreeRenderManager");
        let objects = render.threeLayerUnion("pointer", "walk");
        let avatar = this.getMyAvatar();
        avatar.setRayCast(evt.xy);
        let hits = avatar.raycaster.intersectObjects(objects);

        // hits are sorted by distance, so we find the first hit that is not us or our child
        let renderObject = (obj) => {
            while (obj && !obj.wcPawn) obj = obj.parent;
            return obj;
        }
        let isMeOrMyChild = (obj) => {
            let actor = renderObject(obj)?.wcPawn.actor;
            while (actor) {
                if (actor === this.actor) {return true;}
                actor = actor.parent;
            }
            return false;
        }
        let hit = hits.find(h => !isMeOrMyChild(h.object));

        // if we hit something, move to the hit point, and rotate according to the hit normal
        let normal = hit?.face?.normal?.toArray();
        if (normal) {
            let {q_lookAt} = Microverse;
            let rotation = q_lookAt([0, 1, 0], [0, 0, 1], normal);
            let translation = hit.point.toArray();
            this.set({translation, rotation});

            // remember distance
            this.dragInfo.distance = hit.distance;

            // we reparent on pointerUp
            let other = renderObject(hit.object).wcPawn;
            this.dragInfo.parent = other.actor;

            return;
        }

        // no hit, so move along at distance along ray
        let {THREE} = Microverse;
        let translation = avatar.raycaster.ray.at(this.dragInfo.distance, new THREE.Vector3()).toArray();
        this.set({translation});
    }

    pointerDown(evt) {
        if (!evt.xyz) {return;}
        if (this.dragInfo) {return;}

        let avatar = this.getMyAvatar();

        this.dragInfo = {distance: evt.distance, parent: this.actor.parent};
        if (avatar) {
            avatar.addFirstResponder("pointerMove", {}, this);
        }
        // remove from parent (if any)
        this.say("reparent", null);
    }

    pointerUp(_evt) {
        if (!this.dragInfo) {return;}

        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.removeFirstResponder("pointerMove", {}, this);
        }

        // attach to the object I was dragged on
        if (this.dragInfo.parent) {
            this.say("reparent", this.dragInfo.parent);
        }

        this.dragInfo = null;
    }
}

class SpawnPawn{

}


class CreateActor {
    setup(){
        console.log("Creating Default Cards - 0!");
        this.cards = [];
        this.reset();
        this.subscribe("spawn", "spawn", "createNew")
        this.subscribe("storm", "reset", "reset");
    }

    createDefaults(){
        //console.log("Creating Default Cards!");
        let a = this.createCard({
                name: "snowball_large",
                type: "object",
                translation: [12, 0.4, 0],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Snowball"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [1, 1, 1],
                radius:1,
                //singleSided:false,

            });
        let b = this.createCard({
                name: "snowball_medium",
                type: "object",
                translation: [12, 1, -3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Snowball"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [1, 1, 1],
                radius:0.8,
                //singleSided:false,

            });
        let c= this.createCard({
                name: "snowball_small",
                type: "object",
                translation: [12, 1.5, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Snowball"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.5, .5, .5],
                radius:0.6,
                //singleSided:false,

            });
        let d = this.createCard({
                name: "carrot",
                type: "3d",
                dataLocation: "./assets/3D/carrot.zip",
                dataTranslation: [0, 1.2, 0],
                dataRotation: [0, 0, 1.57],
                translation: [14, 0, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0,0],//Math.PI, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.02, .02, .02],
                frontPos: 12,
                //singleSided:false,

            });
        let e = this.createCard({
                name: "coal_1",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [13.5, 0, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            });
        let f = this.createCard({
                name: "coal_2",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [10, 0, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            });
        let g = this.createCard({
                name: "coal_3",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [10, 0, 5],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            });
        let h = this.createCard({
                name: "coal_4",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [13, 0, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            });
        let i = this.createCard({
                name: "coal_5",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [12, 0, 7],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            });
        let j = this.createCard({
                name: "hat_1",
                type: "3d",
                dataLocation: "./assets/3D/top_hat.zip",
                dataTranslation: [0,0,0],
                translation: [10, 0, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.2, .2, .2],
                frontPos: 12,
                //singleSided:false,

            });
        let k = this.createCard({
                name: "hat_2",
                type: "3d",
                dataLocation: "./assets/3D/top_hat2.zip",
                dataTranslation: [0, 0.2, 0],
                translation: [10, 0, 4],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.002, .002, .002],
                frontPos: 12,
                //singleSided:false,

            });
        let l = this.createCard({
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick.zip",
                translation: [10, 0, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                //singleSided:false,

            });
        let m = this.createCard({
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick.zip",
                translation: [10, 0, -2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                //singleSided:false,

            });
        let n = this.createCard({
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick2.zip",
                translation: [10, 0, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [-Math.PI/2, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                //singleSided:false,
            });
        this.cards.push(a);
        this.cards.push(b);
        this.cards.push(c);
        this.cards.push(d);
        this.cards.push(e);
        this.cards.push(f);
        this.cards.push(g);
        this.cards.push(h);
        this.cards.push(i);
        this.cards.push(j);
        this.cards.push(k);
        this.cards.push(l);
        this.cards.push(m);
        this.cards.push(n);
    }
    createNew(data){
        let spawn = this.createCard(data);
        this.cards.push(spawn);
    }

    reset(){
        console.log("Creating Default Cards! - 1");
        this.cards.forEach((c) => c.destroy());
        this.createDefaults();
    }
}

export default {
    modules: [
        {
            name: "Spawn",
            actorBehaviors: [SpawnActor],
            pawnBehaviors: [SpawnPawn]
        },
        {
            name: "Coal",
            pawnBehaviors: [CoalPawn],
        },
        {
            name: "SmallBall",
            pawnBehaviors: [TinySnowBallPawn],
        },
        {
            name: "Create",
            actorBehaviors: [CreateActor],
            pawnBehaviors: []
        },

    ]
}
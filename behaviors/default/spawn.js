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
        this.listen("spawn","spawn")
        this.frontPos = this._cardData.frontPos;
        this.addEventListener("pointerDown", "spawn");
        this.children = [];
    }
    spawn(){
        console.log(this.trans);
        this.createCard({
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
        let avatar = this.getMyAvatar();

        this.dragInfo = {distance: evt.distance, parent: this.actor.parent};
        if (avatar) {
            avatar.addFirstResponder("pointerMove", {}, this);
        }
        // remove from parent (if any)
        this.say("reparent", null);
    }

    pointerUp(_evt) {
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

    }

    createDefaults(){

    }
    createNew(){

    }
    restart(){

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
    ]
}
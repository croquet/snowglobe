class SpawnActor{
    setup(){
        this.dataloc = this.__cardData.spawnDataLocation;
        this.trans = this.__cardData.translation;
        this.listen("spawn","spawn")
        this.frontPos = this.__cardData.frontPos;
    }
    spawn(){
        let spawn = this.createCard({
            translation: this.trans,
            scale: [1, 1, 1],
            rotation: [0, 0, 0, 1],
            layers: ["pointer"],
            name: "spawned_object",
            cornerRadius: 0.02,
            behaviorModules: ["Coal"],
            fullBright: false,
            shadow: true,
            singleSided: true,
            type: "3d",
            dataLocation: this.dataloc,
            frontPos:12,
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
        this.listen("translationSet", "translated");
        this.listen("rotationSet", "translated");
        this.front_pos = this.actor._cardData.frontPos;//||12;
    }

    translated(_data) {
        //this.scrollAreaPawn.say("updateDisplay");
    }

    pointerMove(evt) {
        if (!this.downInfo) {return;}

        // do a raycast to find objects behind this one
        let render = this.service("ThreeRenderManager");
        let objects = render.threeLayerUnion("pointer", "walk");
        let avatar = this.getMyAvatar();
        avatar.setRayCast(evt.xy);
        let hits = avatar.raycaster.intersectObjects(objects);

        // find the first hit that is not this object
        let renderObject = (obj) => {
            while (obj && !obj.wcPawn) obj = obj.parent;
            return obj;
        }
        let hit = hits.find(h => renderObject(h.object) !== this.renderObject);

        // if we hit something, move to the hit point, and rotate according to the hit normal
        let normal = hit?.face?.normal?.toArray();
        if (normal) {
            let {q_lookAt} = Microverse;
            let rotation = q_lookAt([0, 1, 0], [0, 0, 1], normal);
            let translation = hit.point.toArray();
            this.set({translation, rotation});

            // remember distance
            this.downInfo.distance = hit.distance;

            // let other = renderObject(hit.object).wcPawn;
            // console.log("hit", other.actor.name, "at", translation, "normal", normal);
            return;
        }

        // no hit, so move along at distance along ray
        let {THREE} = Microverse;
        let translation = avatar.raycaster.ray.at(this.downInfo.distance, new THREE.Vector3()).toArray();
        this.set({translation});
    }

    pointerDown(evt) {
        if (!evt.xyz) {return;}
        let avatar = this.getMyAvatar();

        this.downInfo = {translation: this.translation, downPosition: evt.xyz, distance: evt.distance};
        if (avatar) {
            avatar.addFirstResponder("pointerMove", {}, this);
        }
    }

    pointerUp(_evt) {
        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.removeFirstResponder("pointerMove", {}, this);
        }
        this.downInfo = null;
    }
}

class SpawnPawn{

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
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

    moveMyself(evt) {
        if (!evt.ray) {return;}

        let {THREE, v3_add, v3_sub} = Microverse;

        let origin = new THREE.Vector3(...evt.ray.origin);
        let direction = new THREE.Vector3(...evt.ray.direction);
        let ray = new THREE.Ray(origin, direction);

        let dragPoint = ray.intersectPlane(
            this._dragPlane,
            new Microverse.THREE.Vector3()
        );

        let down = this.downInfo.downPosition;
        let drag = dragPoint.toArray();

        let diff = v3_sub(drag, down);
        let newPos = v3_add(this.downInfo.translation, diff);

        let [x,y,z] = newPos;

        this.set({translation: [this.front_pos,y,z]});
    }

    pointerMove(evt) {
        if (!this.downInfo) {return;}

        if (!this.downInfo.child) {
            return this.moveMyself(evt);
        }

        if (!evt.xyz) {return;}
        let vec = new Microverse.THREE.Vector3(...evt.xyz);
        let pInv = this.renderObject.matrixWorld.clone().invert();
        vec = vec.applyMatrix4(pInv);

        let origDownPoint = this.downInfo.downPosition;
        let origTranslation = this.downInfo.childTranslation;

        let deltaX = vec.x - origDownPoint.x;
        let deltaY = vec.y - origDownPoint.y;

        this.downInfo.child.translateTo([origTranslation[0] + deltaX, origTranslation[1] + deltaY, origTranslation[2]]);
        // console.log(this.downInfo, pVec2);
    }

    pointerDown(evt) {
        if (!evt.xyz) {return;}
        let {THREE, q_yaw, v3_rotateY} = Microverse;

        let avatar = this.getMyAvatar();
        let yaw = q_yaw(avatar.rotation);
        let normal = v3_rotateY([0, 0, -1], yaw);

        this._dragPlane = new THREE.Plane();
        this._dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(...normal),
            new THREE.Vector3(...evt.xyz)
        );

        this.downInfo = {translation: this.translation, downPosition: evt.xyz};
        if (avatar) {
            avatar.addFirstResponder("pointerMove", {}, this);
        }
    }

    pointerUp(_evt) {
        this._dragPlane = null;
        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.removeFirstResponder("pointerMove", {}, this);
        }
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
// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

/*
    A behaviour that, when added to an object, causes it to turn to face the camera
    in each user's view.  It does this by overriding the rotation value that the
    pawn would otherwise be taking from its actor.

    By default, the object's local direction [0, 0, 1] is turned to face the camera.
    A pawn can provide a hitNormal property (or getter) to specify a different
    reference vector to use.
*/

class BillboardingPawn {
    setup() {
        this.lastUpdate = 0;
        this.lastTarget = null;
        this.lastRotation = null;
        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
        this.listen("translationSet", "translated");
        this.listen("rotationSet", "translated");
    }

    update() {
        // adapted from Widget3.update in Worldcore
        const {
            v3_isZero, v3_equals, v3_sub, v3_normalize, v3_rotate, m4_getTranslation, m4_getRotation, q_lookAt
        } = Microverse;
        const render = this.service("ThreeRenderManager");

        const cameraMatrix = render.camera.matrix;
        let v = new Microverse.THREE.Vector3([12,5,0])//.setFromMatrixPosition(cameraMatrix);
        const cameraXZ = [v.x, 0, v.z];
        const widgetXZ = m4_getTranslation(this.global);
        widgetXZ[1] = 0;
        const camRelative = v3_sub(cameraXZ, widgetXZ);
        if (v3_isZero(camRelative)) return; // never going to happen during movement.  could happen on setup.

        const target = v3_normalize(camRelative);
        if (!this.lastTarget || !v3_equals(target, this.lastTarget)) {
            this.lastTarget = target;
            let forward = this.hitNormal || [0, 0, 1];
            if (this.parent) forward = v3_rotate(forward, m4_getRotation(this.parent.global));
            const up = [0, 1, 0];
            this._rotation = q_lookAt(forward, up, target);
            this.lastRotation = [...this._rotation];
        } else this._rotation = [...this.lastRotation];
        this.onLocalChanged();
    }

    teardown() {
        console.log("Billboard teardown");
        let moduleName = this._behavior.module.externalName;
        this.removeUpdateRequest([`${moduleName}$BillboardingPawn`, "update"]);
    }


    translated(_data) {
        //this.scrollAreaPawn.say("updateDisplay");
    }

    moveMyself(evt) {
        if (!evt.ray) {return;}

        let {THREE, v3_add, v3_sub, v3_normalize} = Microverse;

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


        this.set({translation: newPos});
        let v = [12,5,3];
        let toorg = v3_sub(v, newPos);

        /*
        let theta = Math.asin(z/Math.sqrt(z**2+x**2+y**2));
        let phi = Math.asin(x/Math.sqrt(x**2+y**2));

        //let rotPos = new THREE.Vector3(0,0,1);
        /*let nx = Math.Sin(phi) * Math.Sin(theta);
        let ny = Math.Sin(phi) * Math.Cos(theta);
        let nz = Math.Cos(phi);*/
        let target = new THREE.Object3D();
        target.position.set(5, 13, 3);
        let me = new THREE.Object3D();
        me.position.set(...newPos);

        me.lookAt(new THREE.Vector3(12, 5, 3));

        let rotVec = me.rotation;

        let f = new THREE.Vector3([1,0,0]);
        let u = [0,1,0];
        let t = v3_normalize(toorg);
        let rot = Microverse.q_lookAt(f,u,t);
        rot = Microverse.q_euler(rotVec.x+Math.PI,rotVec.y,rotVec.z);
        console.log("toorg", toorg);
        console.log("t", t);
        console.log("rot", rot);
        this.set({rotation: rot});//Microverse.q_euler(Math.asin(z/Math.sqrt(z**2+y**2)),Math.asin(x/Math.sqrt(z**2+x**2)),Math.asin(x/Math.sqrt(y**2+x**2)))});//[Math.asin(z/y), Math.asin(z/x),Math.asin(x/y),0]});
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

export default {
    modules: [
        {
            name: "Carrot",
            pawnBehaviors: [BillboardingPawn],
        }
    ]
}

/* globals Microverse */

class SpawnActor{
    /*Creates a object capable of spawning other objects. as input, the object needs the data location
    of both the spawner and the spawnee as well as locaiton, rotatio, ect. data for both.
    */
    setup(){
        this.addEventListener("pointerDown", "spawn");
        this.spawn(); // spawn one on startup
    }

    spawn(){
        ///Spawn an item using parameters from the spawner
        
        //add slight variation in spawn location to prevent overlap of multiple spawned objects
        let x = Math.random() * 2 - 1;
        let y = Math.random() * 2 + 1;
        let z = Math.random() * 2 - 1;
        let translation = Microverse.v3_add(this.translation, [x, y, z]);

        //create spawn
        this.publish("spawn", "spawn", {
            name: "spawned_object",
            type: this._cardData.spawnType,
            dataLocation: this._cardData.spawnDataLocation,
            dataTranslation: this._cardData.spawnDataTranslation,
            dataRotation: this._cardData.spawnDataRotation,
            translation,
            rotation: this._cardData.spawnRotation,
            dataScale: this._cardData.spawnScale,
            behaviorModules: this._cardData.spawnBehaviors,
            layers: ["pointer"],
            cornerRadius: 0.02,
            fullBright: false,
            shadow: true,
            radius: this._cardData.spawnRadius,
        });
    }
}


class SpawnPawn{
    setup() {
        // prevent jumping to crate
        this.removeEventListener("pointerDoubleDown", "onPointerDoubleDown");
        this.addEventListener("pointerDoubleDown", "nop");
    }
}

class TinySnowBallPawn {
    /// creates a ball without any movement behaviors///
    setup() {
        this.radius = this.actor._cardData.radius;
        let geometry = new Microverse.THREE.SphereGeometry(this.radius,32,32);
        let material =  new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xFFFFFF});
        let snowball = new Microverse.THREE.Mesh(geometry, material);
        snowball.position.set(0,0,0);
        snowball.castShadow = true;
        snowball.receiveShadow = true;
        this.shape.add(snowball);

    }
}

class StickyItemActor {
    /*
    movement behavior for accessories. the obect with always be attached to another object and 
    will always face perpendicular to the surface it is attached to. usful for object that need to be 
    placed radially outward.
    */
    setup() {
        this.listen("dragStart", "dragStart");
        this.listen("dragEnd", "dragEnd");
        this.listen("dragMove", "dragMove");
    }

    dragStart({viewId}) {
        if (!this.occupier) {// see SingleUser behavior
            this.say("focus", viewId);  // grab single user focus
            this.unstick();
        }
    }

    dragMove({viewId, translation, rotation}) {
        if (viewId === this.occupier) { // see SingleUser behavior
            if (translation) this.translateTo(translation);
            if (rotation) this.rotateTo(rotation);
            this.say("focus", viewId);  // refresh single user focus
        }
    }

    dragEnd({viewId, parent}) {
        if (viewId === this.occupier) { // see SingleUser behavior
            this.stickTo(parent);
            this.say("unfocus", viewId); // release single user focus
        }
    }

    // remove from current parent into world-space
    unstick() {
        if (!this.parent) {return;}
        // use our global transform as our own translation and rotation
        let {m4_getTranslation, m4_getRotation} = Microverse;
        let translation = m4_getTranslation(this.global);
        let rotation = m4_getRotation(this.global);
        this.set({parent: null, translation, rotation});
    }

    // stick to a parent preserving our world-space translation and rotation
    stickTo(parent) {
        if (!parent || this.parent|| this.isMeOrMyChild(parent)) {return;}
        // make our rotation and translation relative to the new parent
        let {m4_invert, m4_multiply, m4_getTranslation, m4_getRotation} = Microverse;
        let relativeToParent = m4_multiply(this.global, m4_invert(parent.global));
        let translation = m4_getTranslation(relativeToParent);
        let rotation = m4_getRotation(relativeToParent);
        this.set({parent, translation, rotation});
    }

    isMeOrMyChild(actor) {
        while (actor) {
            // compare IDs because actor may be a behavior proxy
            if (actor.id === this.id) {return true;}
            actor = actor.parent;
        }
        return false;
    }
}

class StickyItemPawn {
    setup() {
        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
    }

    dragging() {
        return this.actor.occupier === this.viewId; // see SingleUser behavior
    }

    pointerMove(evt) {
        if (!this.dragging()) {return;}

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
            return this.actorCall("StickyItemActor", "isMeOrMyChild", actor);
        }
        let hit = hits.find(h => !isMeOrMyChild(h.object));

        // if we hit something, move to the hit point, and rotate according to the hit normal
        let normal = hit?.face?.normal?.toArray();
        if (normal) {
            let {q_lookAt} = Microverse;
            let rotation = q_lookAt([0, 1, 0], [0, 0, 1], normal);
            let translation = hit.point.toArray();
            this.say("dragMove", {viewId: this.viewId, translation, rotation});

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
        this.say("dragMove", {viewId: this.viewId, translation});
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
        this.say("dragStart", {viewId: this.viewId});
    }

    pointerUp(_evt) {
        if (!this.dragInfo) {return;}

        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.removeFirstResponder("pointerMove", {}, this);
        }

        // attach to the object I was dragged on
        this.say("dragEnd", {viewId: this.viewId, parent: this.dragInfo.parent});

        this.dragInfo = null;
    }
}

class CreateActor {
    /*
    creates the default cards for the snowman. includes various snowballs, sticks coal and hats.
    useful for allowing the implementation of a reset button
    */
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
                translation: [12, 0.4, 0],
                rotation: [0, 0, 0],
                behaviorModules: ["Snowball"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [1, 1, 1],
                radius:1,
                singleSided: true,

            });
        let b = this.createCard({
                name: "snowball_medium",
                type: "object",
                translation: [12, 1, -3],
                rotation: [0, 0, 0],
                behaviorModules: ["Snowball"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [1, 1, 1],
                radius:0.8,
                singleSided: true,

            });
        let c= this.createCard({
                name: "snowball_small",
                type: "object",
                translation: [12, 1.5, 3],
                rotation: [0, 0, 0],
                behaviorModules: ["Snowball"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.5, .5, .5],
                radius:0.6,
                singleSided: true,

            });
        let d = this.createCard({
                name: "carrot",
                type: "3d",
                dataLocation: "./assets/3D/carrot.zip",
                dataTranslation: [0, 0.6, 0],
                dataRotation: [0, 0, 1.57],
                translation: [14, 0.05, 3],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 12,
                singleSided: true,

            });
        let e = this.createCard({
                name: "coal_1",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [13.5, 0, 3],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                singleSided: true,

            });
        let f = this.createCard({
                name: "coal_2",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [10, 0, 2],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                singleSided: true,

            });
        let g = this.createCard({
                name: "coal_3",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [10, 0, 5],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                singleSided: true,

            });
        let h = this.createCard({
                name: "coal_4",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [13, 0, 2],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                singleSided: true,

            });
        let i = this.createCard({
                name: "coal_5",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [12, 0, 7],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                singleSided: true,

            });
        let j = this.createCard({
                name: "hat_1",
                type: "3d",
                dataLocation: "./assets/3D/top_hat.zip",
                dataTranslation: [0,0,0],
                translation: [10, 0, 2],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.2, .2, .2],
                frontPos: 12,
                singleSided: true,

            });
        let k = this.createCard({
                name: "hat_2",
                type: "3d",
                dataLocation: "./assets/3D/top_hat2.zip",
                dataTranslation: [0, 0.2, 0],
                translation: [10, 0, 4],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.002, .002, .002],
                frontPos: 12,
                singleSided: true,

            });
        let l = this.createCard({
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick.zip",
                translation: [10, 0, 3],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                singleSided: true,
            });
        let m = this.createCard({
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick.zip",
                translation: [10, 0, -2],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                singleSided: true,

            });
        let n = this.createCard({
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick2.zip",
                translation: [10, 0, 2],
                rotation: [-Math.PI/2, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                singleSided: true,
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
            name: "StickyItem",
            actorBehaviors: [StickyItemActor],
            pawnBehaviors: [StickyItemPawn],
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
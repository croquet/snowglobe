class TextActor {
    setup() {
        let actors = this.queryCards();
        this.avatars = actors.filter((a) => a.playerId);
        this.text = this._cardData.text;
        this.text2 = this._cardData.text2;
        this.currDot = 0;
        if(this.avatars.length<2){
            if(!this.stepping){
                this.stepping = true;
                this.step();
            }
            if(this.QRimg){
                this.QRimg.destroy();
            }
            this.QRimg = this.createCard({
                translation: [0, 2.5, 8.5],
                scale: [2, 2, 2],
                rotation: [0, 0, 0, 1],
                layers: ["pointer"],
                name: "QR-Holo",
                cornerRadius: 0.02,
                behaviorModules: ["QRCode"],
                fullBright: false,
                shadow: true,
                singleSided: true,
                //textureLocation: "3dbVMCMeVHmQoRX1BH8uxp6cCh6izEk_v5CbIrHYOLdIDBAQFBdeS0sCDQgBF0oRF0oHFgsVEQEQSg0LSxFLHjEQEzQrHiIRKzdVLw0DKT4NUVddHCIgI1xUVksNC0oHFgsVEQEQSgkNBxYLEgEWFwFKCAsHBQgAARIAAQIFEQgQSwo1JSMUBiAsKAIUVihJFTEuD1wWKTUFVAohHAlRFjsjAgwOMC8AJi8JPDFLAAUQBUtQIg5dHBU9NChSCjwGKVYMDRMuCyMXMB0vEhxWDz4RVRwLMgMAIgFSPhAX",
                textureType: "canvas",
                textureHeight: 280,
                textureWidth: 280,
                type: "2d",
            });
        }
    }

    step(){
        if(!this.stepping){
            return;
        }
        if(this.avatars.length<2){
            if(this.QRimg){
            this.QRimg.set({scale:[2,2,2]});}
            let currText = "";
            if(this.currDot<=this.text.length){
                currText = this.text.substring(0,this.currDot);
            }else{
                currText = this.text2.substring(0,this.currDot-this.text.length);
            }
            this.currDot+=1;
            this.currDot = this.currDot%(this.text.length+this.text2.length+1);
            this.say("step",currText);
        }else{
            this.say("step",0);
            if(this.QRimg){
            this.QRimg.set({scale: [0,0,0]});}
        }
        let actors = this.queryCards();
        this.avatars = actors.filter((a) => a.playerId);
        this.future(500).step();
    }

}

class TextPawn {
    setup() {

        //this.shape.children.forEach((c) => this.shape.remove(c));
        //this.shape.children = [];
        if (this.left_dots) {
            this.left_dots.forEach((d) => d.removeFromParent());
        }
        this.text = this.actor._cardData.text;
        this.material =  new Microverse.THREE.MeshStandardMaterial({emissive: this.actor._cardData.color || 0xFFFFFF, side: Microverse.THREE.DoubleSide});
        this.material.transparent = true;
        this.material.opacity = 0.27;
        this.currDot = 0;
        this.green = 0x40FF00;
        this.red = 0xFF7300;
        this.upTranslation = this.actor._translation;
        this.listen("step","step");
    }

    step(currText){
        //console.log('here4', currText);
        this.shape.children.forEach((c) => this.shape.remove(c));
        //console.log(this.currDot);
        if(currText == 0){
            return;
        }
        const loader = new Microverse.THREE.FontLoader();
        //let currText = this.text.substring(0,this.currDot);
        loader.load('./assets/fonts/helvetiker_bold.typeface.json',(font) => {
            // do something with the font
            let geometry = new Microverse.THREE.TextGeometry(currText+"_", {
                font: font,
                size: .2,
                height: .01,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: .01,
                bevelSize: .005,
                bevelOffset: 0,
                bevelSegments: 5
            } );
            let dot = new Microverse.THREE.Mesh(geometry, this.material);
            dot.position.set(1,1,1);
            dot.rotation.set(0,0,0)
            this.shape.add(dot);
        });
        //}
        // this.currDot+=1;
        // this.currDot = this.currDot%(this.text.length+1);
    }

    teardown() {
        if (this.bloomPass) {
            this.service("ThreeRenderManager").composer.removePass(this.bloomPass);
            this.bloomPass = null;
        }
    }

}

class QRCodePawn {
    setup() {
        this.removeEventListener("pointerDoubleDown", "onPointerDoubleDown");
        this.addEventListener("pointerDoubleDown", "nop");
        //debugger;
        let canvas = Microverse.App.makeQRCanvas({colorDark: "#000000", colorLight: "#FFFFFF", height: 256, width: 256});
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,280,280);
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 12, 12, 256, 256); // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        this.texture.needsUpdate = true
        this.shape.traverse((mesh) => {
            if (mesh.material) {
                mesh.material.transparent = true;
                mesh.material.opacity = 0.3;
            }
        });
    }
}

class SnowBallPawn {
    setup() {
        this.radius = this.actor._cardData.radius;
        let geometry = new Microverse.THREE.SphereGeometry(this.radius,32,32);
        let material =  new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xFFFFFF});
        let snowball = new Microverse.THREE.Mesh(geometry, material);
        snowball.position.set(0,0,0);
        snowball.castShadow = true;
        snowball.receiveShadow = true;
        this.shape.add(snowball);
        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
        this.listen("translationSet", "translated");
        this.listen("rotationSet", "translated");

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

        this.set({translation: [12,y,z]});
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
            name: "GlowText",
            actorBehaviors: [TextActor],
            pawnBehaviors: [TextPawn]
        },
        {
            name: "QRCode",
            pawnBehaviors: [QRCodePawn],
        },
        {
            name: "Snowball",
            pawnBehaviors: [SnowBallPawn],
        },
    ]
}
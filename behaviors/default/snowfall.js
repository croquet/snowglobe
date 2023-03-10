/*
    This file contains 3 behaviors:
        -dust
        -snowmenu
        -storm

    Dust produces small drifting motes that can also be used as simle snowflakes.

    Snowmenu creates a button on the menu which can be used to trigger 'storm'.

    Storm slowly turns the screen to white before resetting the world ot the initial positions
    and objects.
*/

class DustActor {
    setup(){
        this.listen("motes", "saveMotes")
        
    }
    saveMotes(motes){
        this.motes = motes;
    }
}
class DustPawn {
    setup() {

        //this.shape.children.forEach((c) => this.shape.remove(c));
        //this.shape.children = [];
        this.stepnum = 0;
        if (this.left_dots) {
            this.left_dots.forEach((d) => d.removeFromParent());
        }
        this.motes = this.actor.motes;
        if(this.motes){
            this.createMotes(this.motes);
        }else{
            let scope = this.actor._cardData.myScope;
            let arrLen = scope=="middle"?5:1000;
            this.motes = Array();
            this.left_dots =   [...Array(arrLen).keys()].map((i) => {
                this.motes.push([this.random()*12-6,this.random()*4+.7,this.random()*24-12]);
            });
            this.say("motes", this.motes);
            this.createMotes(this.motes);
        }
        //this.left_dots = [];
        //this.right_dots = [];
        // if (this.shape.children.length === 0) {
        //     //for i in range....

        //     let geometry = new Microverse.THREE.CircleGeometry(.1,8);
        //     let material = new Microverse.THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0xD86508});
        //     this.obj = new Microverse.THREE.Mesh(geometry, material);
        //     this.shape.add(this.obj);
        // }
        //this.listen("motes", "createMotes");

        this.upTranslation = this.actor._translation; // Storing Current and Pressed Translations (Avoids Errors)
        //this.downTranslation = [this.actor._translation[0], this.actor._translation[1], this.actor._translation[2] - 0.1];
        
    }

    createMotes(motes){
        console.log("motes pawn");
        let scope = this.actor._cardData.myScope;
        let sign = scope=="left"?-1:1;
        let arrLen = scope=="middle"?5:50;
        let angle = Math.PI*4/12;
        let here = [0,0,0]
        let dotDist = 0.3
        let geometry = new Microverse.THREE.SphereGeometry(.02,32,32);
        this.left_dots =   [...Array(arrLen).keys()].map((i) => {
            let material =  new Microverse.THREE.MeshStandardMaterial({emissive: this.actor._cardData.color || 0xFFFFFF, side: Microverse.THREE.DoubleSide});
            material.transparent = true;
            material.opacity = 0.5+this.random()*0.2;
            let dot = new Microverse.THREE.Mesh(geometry, material);
            here = motes[i];
            dot.position.set(here[0], here[1], here[2]);
            // here[0] = this.random()*6-3;
            // here[1] = this.random()*4+.7;
            // here[2] = this.random()*12-6;
            // if(i<5){
            //     here[1]+=dotDist;
            // }else{
            //     here[0]+= dotDist*Math.sin(sign*angle);
            //     here[1]+= dotDist*Math.cos(sign*angle);
            // }
            dot.rotation.set(0,0,0)
            this.shape.add(dot);
            return dot;
        });
        console.log('ok');
        if(!this.stepping){
            this.stepping = true;
            this.step();
        }

    }

    step(){
        if(!this.stepping){
            return;
        }
        //if(this.currDot == 0){
        this.left_dots.forEach((d)=>{
            let pos = d.position;
            let randOpac = ((this.now()+(pos.x*pos.y*pos.z)*1000) * 75 + 74) % (2**(16)+1);
            d.material.opacity = Math.min(0.6,Math.max(0,(randOpac/(2**(16)+1)-.5)*.1+d.material.opacity));
            //console.log(pos);
            if(pos.y<.7){
                d.position.set(pos.x,4.7,pos.z);
            }else{
                d.position.set(pos.x,pos.y-.01,pos.z);
            }
            //console.log(":)");
        });
        //}
        //console.log(this.currDot);
        // this.left_dots[this.currDot].material.emissive.set(this.green);
        // this.currDot+=1;
        // this.currDot = this.currDot%this.left_dots.length;
        this.stepnum = (this.stepnum+1)%10;
        this.future(100).step();
    }

    teardown() {
        if (this.bloomPass) {
            this.service("ThreeRenderManager").composer.removePass(this.bloomPass);
            this.bloomPass = null;
        }
    }

}


class SnowStormActor {
 ///*

 ///

}

class SnowStormPawn {
    setup(){
        this.subscribe("storm", "snowStorm","startStorm");
    }
    startStorm(){
        /*
        when time to create flakes:
        create snow flakes*/
        //turn the scene white.
        this.fadeToWhite();
        // rebuild world
        this.publish("storm", "reset");
        this.future(1000).fadeFromWhite();
    }
    fadeToWhite() {
        let snowCoverDiv = document.createElement("div");
        snowCoverDiv.id = "croquet_spinnerOverlay";
        snowCoverDiv.style.position = "fixed";
        snowCoverDiv.style.width = "100%";
        snowCoverDiv.style.height = "100%";
        snowCoverDiv.style.zIndex = 2000;
        snowCoverDiv.style.backgroundColor = "#FFFFFF";
        snowCoverDiv.style.opacity = "0";
        window.snowCoverDiv = snowCoverDiv;
        document.body.appendChild(snowCoverDiv);
        window.snowCoverDiv.style.transition = "opacity 2s";
        window.snowCoverDiv.style.opacity = 0.95;
        Microverse.sendToShell("hud", {joystick: false, fullscreen: false});
    }
    fadeFromWhite(){
        if (window.snowCoverDiv) {
            window.snowCoverDiv.style.transition = "opacity 2s";
            window.snowCoverDiv.style.opacity = 0;
        }
        window.setTimeout(() => {
            if (window.snowCoverDiv) {
                window.snowCoverDiv.remove();
                delete window.snowCoverDiv;
            }
        }, 1000);
        Microverse.sendToShell("hud", {joystick: true, fullscreen: true});
    }

    
}


class SnowStormMenuPawn {
    setup() {
        let menu = document.body.querySelector("#worldMenu");
        if (menu) {
            let menuItemDiv = document.createElement("div");
            menuItemDiv.innerHTML = `<div id="worldMenu-snow" class="menu-label menu-item">
    <span class="menu-label-text">Blizzard</span>
    <div class="menu-icon load-icon"></div>
</div>`;
            let menuItem = menuItemDiv.firstChild;
            menuItem.addEventListener("click", () => {
                 let label = menuItem.querySelector(".menu-label-text");
                 label.textContent = "Snow Storm" ;
                 this.publish("storm", "snowStorm");});
            menu.appendChild(menuItem);
            this.menuItem = menuItem;
        }
    }
    teardown() {
        let menu = document.body.querySelector("#worldMenu");
        if (menu) {
            let menuItem = menu.querySelector("#worldMenu-snow");
            if (menuItem) {
                menuItem.remove();
            }
        }
    }
    
}



export default {
    modules: [
        {
            name: "Dust",
            actorBehaviors: [DustActor],
            pawnBehaviors: [DustPawn],
        },
        {
            name: "SnowMenu",
            actorBehaviors: [],
            pawnBehaviors: [SnowStormMenuPawn],
        },
        {
            name: "Storm",
            actorBehaviors: [],
            pawnBehaviors: [SnowStormPawn],
        },


    ]
}
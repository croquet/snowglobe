// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io


export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.UserBehaviorModules = [
        "lights.js", "snowfall.js", "snowball.js", "urlLink.js", "spawn.js","spinAndBob.js"
    ];

    Constants.DefaultCards = [
        {
            card: {
                name: "start point",
                type: "object",
                translation: [17, 1.7, -2],
                rotation: [0,Math.PI/2,0],
                spawn: "default"
                //todo:this.lookTo(-0.3, 0, [0, 0, 0])
            }
        },
        {
            card: {
                name:"world model",
                type: "3d",
                fileName: "snowglobe.glb",
                dataLocation: "./assets/3D/snowglobe.glb",
                dataType: "glb",
                singleSided: true,
                shadow: true,
                // receiveShadow: true,
                layers: ["walk"],
                dataTranslation: [0, -34.6, 0],
                dataScale: [5,5,5],
                behaviorModules: ["Create", "SnowMenu", "Storm"], //Create - creates default cards to be reset
                placeholder: true,
                placeholderSize: [400, 0.1, 400],
                placeholderColor: 0x808080,
                placeholderOffset: [0, 0, 0],
            }
        },
        {
            card: {
                name: "light",
                layers: ["light"],
                type: "lighting",
                behaviorModules: ["Light"],
                fileName: "/snowy_field_4k.exr",
                dataLocation: "./assets/sky/snowy_field_4k.exr",
                dataType: "exr",
            }
        },
        {
            card: {
                name: "sign",
                translation: [10, 0, -2],
                // rotation: [0, 0, 0, 1],
                layers: ["pointer"],
                behaviorModules: ["Billboard"],
                type: "3d",
                dataLocation: "./assets/3D/wooden_sign_-_low_poly.zip",
                dataScale: [.01, .01, .01],
                //modelType: "glb",
                shadow: true,
                singleSided: true,
            }
        },
        {
            card: {
                name: "Dust",
                type: "object",
                translation: [10, 0, 0],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Dust"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [2, 2, 2],
                //singleSided:false,

            }
        },
        {
            card: {
                name: "spawner",
                type: "3d",
                dataLocation: "./assets/3D/crate.zip",
                translation: [12, 0, 10],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Spawn", "SpinAndBob"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.5, .5, .5],
                frontPos: 12,
                spawnDataLocation:"./assets/3D/top_hat.zip",
                spawnTranslation:[12,1,10],
                spawnScale:[.2, .2, .2],
                spawnRotation:[0, 0, 0],
                spawnDataRotation:[0, 0, 0],
                spawnDataTranslation:[0, 0, 0],
                spawnBehaviors: ["Snowball"],
                spawnType: "object",
                spawnRadius: .4,

            }
        },
        {
            card: {
                name: "spawner",
                type: "3d",
                dataLocation: "./assets/3D/coat_rack.zip",
                translation: [1, 3, -5],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Spawn", "SpinAndBob"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.5, .5, .5],
                frontPos: 12,
                spawnDataLocation:"./assets/3D/top_hat.zip",
                spawnTranslation:[1,6,-5],
                spawnScale:[.2, .2, .2],
                spawnRotation:[0, 0, 0],
                spawnDataRotation:[0, 0, 0],
                spawnDataTranslation:[0, 0, 0],
                spawnBehaviors: ["StickyItem", "SingleUser"],
                spawnType: "3d",
                spawnRadius: .2,

            }
        },
        {
            card: {
                name: "spawner",
                type: "3d",
                dataLocation: "./assets/3D/crate.zip",
                translation: [1, 0, 15],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Spawn", "SpinAndBob"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.8, .8, .8],
                frontPos: 12,
                spawnDataLocation:"./assets/3D/stick.zip",
                spawnTranslation:[1,1,15],
                spawnScale:[.05, .05, .05],
                spawnRotation:[Math.PI/2, 0, 0],
                spawnDataRotation:[0, 0, 0],
                spawnDataTranslation:[0, 0, 0],
                spawnBehaviors: ["StickyItem", "SingleUser"],
                spawnType: "3d",
                spawnRadius: .2,
                }
        },
        {
            card: {
                name: "spawner",
                type: "3d",
                dataLocation: "./assets/3D/crate2.zip",
                translation: [1, 0, -18],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Spawn", "SpinAndBob"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.5, .5, .5],
                frontPos: 12,
                spawnDataLocation:"./assets/3D/carrot.zip",
                spawnTranslation:[1,1,-18],
                spawnRotation:[0, 0, 0],
                spawnScale:[.01, .01, .01],
                spawnDataRotation:[0, 0, 1.57],
                spawnDataTranslation:[0, 0.6, 0],
                spawnBehaviors: ["StickyItem", "SingleUser"],
                spawnType: "3d",
                spawnRadius: .2,
            }
        },
        {
            card: {
                name: "spawner",
                type: "3d",
                dataLocation: "./assets/3D/crate.zip",
                translation: [8, 0, 12],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Spawn", "SpinAndBob"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.8, .8, .8],
                frontPos: 12,
                spawnDataLocation:"./assets/3D/coal.zip",
                spawnTranslation:[8,1,12],
                spawnScale:[.01, .01, .01],
                spawnRotation:[0, 0, 0],
                spawnDataRotation:[0, 0, 0],
                spawnDataTranslation:[0, 0, 0],
                spawnBehaviors: ["StickyItem", "SingleUser"],
                spawnType: "3d",
                spawnRadius: .2,
                }
        },
        {
            card: {
                name: "spawner",
                type: "3d",
                dataLocation: "./assets/3D/crate.zip",
                translation: [4, 0, 12],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Spawn", "SpinAndBob"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.5, .5, .5],
                frontPos: 12,
                spawnDataLocation:"./assets/3D/top_hat.zip",
                spawnTranslation:[4,1,12],
                spawnScale:[.2, .2, .2],
                spawnRotation:[0, 0, 0],
                spawnDataRotation:[0, 0, 0],
                spawnDataTranslation:[0, 0, 0],
                spawnBehaviors: ["SmallBall", "StickyItem", "SingleUser"],
                spawnType: "object",
                spawnRadius: .2,

            }
        },
    ];
}

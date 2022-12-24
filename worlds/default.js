// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.UserBehaviorModules = [
        "carrot.js","lights.js", "tutorial.js", "snowball.js", "urlLink.js", "spawn.js","spinAndBob.js"
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
                behaviorModules: ["Create", "SnowMenu", "Storm"],
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
                behaviorModules: ["TutorialGif"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [2, 2, 2],
                //singleSided:false,

            }
        },
        /*
        {
            card: {
                name: "snowball",
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

            }
        },
        {
            card: {
                name: "snowball",
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

            }
        },
        {
            card: {
                name: "snowball",
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

            }
        },
        {
            card: {
                name: "carrot",
                type: "3d",
                dataLocation: "./assets/3D/carrot.zip",
                dataTranslation: [0, 1.2, 0],
                dataRotation: [0, 0, 1.57],
                translation: [14, 0, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0,0],//Math.PI, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.02, .02, .02],
                frontPos: 12,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "coal",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [13.5, 0, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "coal",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [10, 0, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "coal",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [10, 0, 5],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "coal",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [13, 0, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "coal",
                type: "3d",
                dataLocation: "./assets/3D/coal.zip",
                translation: [12, 0, 7],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.01, .01, .01],
                frontPos: 11.6,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "hat",
                type: "3d",
                dataLocation: "./assets/3D/top_hat.zip",
                dataTranslation: [0,0,0],
                translation: [10, 0, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.2, .2, .2],
                frontPos: 12,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "hat",
                type: "3d",
                dataLocation: "./assets/3D/top_hat2.zip",
                dataTranslation: [0, 0.2, 0],
                translation: [10, 0, 4],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.002, .002, .002],
                frontPos: 12,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick.zip",
                translation: [10, 0, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick.zip",
                translation: [10, 0, -2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                //singleSided:false,

            }
        },
        {
            card: {
                name: "stick",
                type: "3d",
                dataLocation: "./assets/3D/stick2.zip",
                translation: [10, 0, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [-Math.PI/2, 0, 0],
                behaviorModules: ["StickyItem", "SingleUser"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                //singleSided:false,

            }
        }, */
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
                spawnBehaviors: ["StickyItem"],
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
                spawnBehaviors: ["StickyItem"],
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
                spawnBehaviors: ["StickyItem"],
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
                spawnBehaviors: ["StickyItem"],
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
                spawnBehaviors: ["SmallBall", "StickyItem"],
                spawnType: "object",
                spawnRadius: .2,

            }
        },
    ];
}

// Copyright 2022 by Croquet Corporation, Inc. All Rights Reserved.
// https://croquet.io
// info@croquet.io

export function init(Constants) {
    Constants.AvatarNames = [
        "newwhite", "madhatter", "marchhare", "queenofhearts", "cheshirecat", "alice"
    ];

    Constants.UserBehaviorDirectory = "behaviors/default";
    Constants.UserBehaviorModules = [
        "carrot.js","lights.js", "tutorial.js", "snowball.js", "urlLink.js", "spawn.js"
    ];

    Constants.DefaultCards = [
        {
            card: {
                name: "start point",
                type: "object",
                translation: [17,4.5,-2],
                rotation: [0,Math.PI/2,0],
                spawn: "default"
                //todo:this.lookTo(-0.3, 0, [0, 0, 0])
            }
        },
        {
            card: {
                name:"world model",
                type: "3d",
                fileName: "/memories_globe.zip",
                dataLocation: "./assets/3D/memories_globe.zip",
                singleSided: false,
                shadow: true,
                layers: ["walk"],
                translation:[0, -31.7, 0],
                dataScale:[5,5,5],

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
                translation: [10, 3, -2],
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
                translation: [10, 5, 0],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["TutorialGif"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [2, 2, 2],
                //singleSided:false,

            }
        },
        {
            card: {
                name: "snowball",
                type: "object",
                translation: [12, 3, 0],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
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
                translation: [12, 4, -3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
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
                translation: [12, 4.5, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
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
                translation: [14, 3, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0,0],//Math.PI, 0],
                behaviorModules: ["Coal"],
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
                translation: [13.5, 3, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [10, 3, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [10, 3, 5],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [13, 3, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [12, 3, 7],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [10, 3, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [10, 3, 4],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [0, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [10, 3, 3],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [10, 3, -2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [Math.PI/2, 0, 0],
                behaviorModules: ["Coal"],
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
                translation: [10, 3, 2],//-1], // [7.770442246960653, 1.7540892281749288, 13.950883253194933],
                rotation: [-Math.PI/2, 0, 0],
                behaviorModules: ["Coal"],
                shadow: true,
                myScope: "left",
                level: 1,
                dataScale: [.05, .05, .05],
                frontPos: 12,
                //singleSided:false,

            }
        },
    ];
}

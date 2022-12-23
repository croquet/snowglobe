// Spin and bob
// Copyright 2022 Croquet Corporation
// Croquet Microverse


class SpinAndBobActor {
    setup() {
        this.speed = 0.01; // * (1 + Math.random());
        this.bob = 0;
        this.tick();
    }

    teardown() {
        this.ticker = 0; // stop ticking
    }

    tick(ticker = 0) {
        if (ticker === 0) this.ticker = (this.ticker || 0) + 1; // new ticker
        else if (ticker !== this.ticker) return; // old ticker

        this.rotateBy([0, this.speed, 0]);
        this.bob += this.speed * 4;
        this.translateBy([0, Math.sin(this.bob) * 0.005, 0]);

        this.future(20).tick(this.ticker);
    }
}

export default {
    modules: [
        {
            name: "SpinAndBob",
            actorBehaviors: [SpinAndBobActor],
        }
    ]
}

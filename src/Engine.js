require('./Collision');

var Engine = {};

module.exports = Engine;

(function () {

    Engine.create = function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.scale = 60;
        this.cameraPos = Vec2.create(3, 3);
        this.dt = 1 / 60;
        this.width = 10 * this.scale;
        this.height = 10 * this.scale;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.gameObjects = [];
        this.newBodyId = 0;
        return Object.assign({}, this)
    };

    Engine.start = function () {
        self = this;
        window.setInterval(function () {
            self.update.call(self)
        }, 1000 * self.dt);
    };

    Engine.clear = function () {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000000";
    };

    Engine.update = function () {
        this.clear();
        for (let obj of this.gameObjects) {
            if(obj.mInv !== 0) {
                obj.applyAcceleration(0, -9.81, 0, engine.dt);
            }
        }
        this.impulseSolver();
        for (let obj of this.gameObjects) {
            obj.update(this.dt);
        }
        this.draw();
    };

    Engine.draw = function () {
        this.ctx.save();
        this.ctx.translate(this.cameraPos.x * this.scale, this.cameraPos.y * this.scale);
        for (let obj of this.gameObjects) {
            obj.draw(this.ctx, this.scale);
        }
        this.ctx.restore()
    };

    Engine.addBody = function (body) {
        body.bodyId = this.newBodyId;
        this.newBodyId += 1;
        this.gameObjects.push(body);
    };

    Engine.impulseSolver = function () {
        for (let body1 of this.gameObjects) {
            for (let body2 of this.gameObjects) {
                if (body2.bodyId >= body1.bodyId) {
                    continue;
                }
                let mtv = Collision.calculateSAT(body1, body2);
                if (mtv) {
                    let normal = mtv.normal.copy().normal().scale(mtv.length * 100);
                    let b1normal = normal.copy().scale(body1.m);
                    body1.applyForce(b1normal.x, b1normal.y, body1.pos.x, body1.pos.y, this.dt);
                    let b2normal = normal.copy().scale(body2.m);
                    body2.applyForce(b2normal.x, b2normal.y, body2.pos.x, body2.pos.y, this.dt);
                }
            }
        }
    };
}());
var Engine = {};

module.exports = Engine;

(function () {

    Engine.create = function () {
        this.canvas = document.getElementById('canvas');
        this.ctx = canvas.getContext('2d');
        this.scale = 60;

        this.width = 10 * this.scale;
        this.height = 10 * this.scale;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.gameObjects = [];
        return Object.assign({}, this)
    };

    Engine.start = function () {
        self = this;
        window.setInterval(function () {
            self.update.call(self)
        }, 16);
    };

    Engine.clear = function () {
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = "#000000";
    };

    Engine.update = function () {
        this.clear();
        let obj;
        for (obj of this.gameObjects) {
            obj.applyForce(0, -9.81 * obj.m, obj.pos.x, obj.pos.y, 16 / 1000);
        }
        for (obj of this.gameObjects) {
            obj.update(16 / 1000);
        }
        for (obj of this.gameObjects) {
            obj.draw(this.ctx, this.scale);
        }
    };

    Engine.addBody = function (body) {
        this.gameObjects.push(body);
    };
}());
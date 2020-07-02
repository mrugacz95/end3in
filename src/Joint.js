require('./vector');

var Joint = {};

module.exports = Joint;

(function () {
    Joint.create = function (body1, body2, position) {
        this.body1 = body1;
        this.body2 = body2;
        this.local1Anchor = position.sub(body1.pos).rotate(body1.rot);
        this.local2Anchor = position.sub(body2.pos).rotate(body2.rot);
        return Object.assign({}, this)
    }
}());
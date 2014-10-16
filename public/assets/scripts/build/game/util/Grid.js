var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'core/base'], function(require, exports, Base) {
    

    /**
    * Grid class. Preloads Grids and offers functions to play/stop/etc
    * @class Grid
    * @exends Base.Loggable
    */
    var Grid = (function (_super) {
        __extends(Grid, _super);
        function Grid(Game, size, step) {
            _super.call(this);
            this.Game = Game;
            this.size = size;
            this.step = step;
            this.$body = $(document.body);
            this.log('Grid : Constructor');
            this.init();
        }
        Grid.prototype.init = function () {
            var self = this;
            self.geometry = new THREE.Geometry();
            self.material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors, fog: true, opacity: 0.8, transparent: true });

            self.color1 = new THREE.Color(0x444444);
            self.color2 = new THREE.Color(0x888888);

            self.mesh = new THREE.Object3D();

            for (var i = -self.size; i <= self.size; i += self.step) {
                var color = i === 0 ? self.color1 : self.color2;
                var tempLine = new THREE.Geometry();
                tempLine.vertices.push(new THREE.Vector3(-self.size, 0, i), new THREE.Vector3(self.size, 0, i));
                tempLine.colors.push(color, color);

                var tempLine2 = new THREE.Geometry();
                tempLine2.vertices.push(new THREE.Vector3(i, 0, -self.size), new THREE.Vector3(i, 0, self.size));
                tempLine2.colors.push(color, color);

                self.mesh.add(new THREE.Line(tempLine, self.material), new THREE.Line(tempLine2, self.material));
            }

            self.Game.addToScene(self.mesh);
        };
        return Grid;
    })(Base.Loggable);
    return Grid;
});

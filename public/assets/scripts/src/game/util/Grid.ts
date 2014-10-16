/// reference path="../../reference/three.d.ts" />
import Base = require('core/base');
import Game = require('game');
import Audio = require('game/util/Audio');

declare var THREE:any;
declare var THREEx:any;

export = Grid;
/**
 * Grid class. Preloads Grids and offers functions to play/stop/etc
 * @class Grid
 * @exends Base.Loggable
 */
class Grid extends Base.Loggable {
    private $body:JQuery = $(document.body);
    private $root:JQuery;

    private color1:any;
    private color2:any;
    private geometry:any;
    private material:any;
    private mesh:any;

    constructor(private Game:Game, private size:number, private step:number) {
        super();
        this.log('Grid : Constructor');
        this.init();
    }

    private init():void {
        var self:Grid = this;
        self.geometry = new THREE.Geometry();
        self.material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors, fog: true, opacity: 0.8, transparent: true } );

        self.color1 = new THREE.Color( 0x444444 );
        self.color2 = new THREE.Color( 0x888888 );

        self.mesh = new THREE.Object3D();

        for ( var i = - self.size; i <= self.size; i += self.step ) {
            var color = i === 0 ? self.color1 : self.color2;
            var tempLine = new THREE.Geometry();
            tempLine.vertices.push(new THREE.Vector3( - self.size, 0, i ), new THREE.Vector3( self.size, 0, i ));
            tempLine.colors.push(color, color);

            var tempLine2 = new THREE.Geometry();
            tempLine2.vertices.push(new THREE.Vector3( i, 0, - self.size ), new THREE.Vector3( i, 0, self.size ));
            tempLine2.colors.push(color, color);

            self.mesh.add(
                new THREE.Line(tempLine, self.material),
                new THREE.Line(tempLine2, self.material)
            );
        }

        self.Game.addToScene(self.mesh);
    }
}

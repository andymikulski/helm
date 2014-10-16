/// reference path="reference/three.d.ts" />
import Base = require('core/base');
import Game = require('game');
import Audio = require('game/util/Audio');
import Grid = require('game/util/Grid');

declare var THREE:any;
declare var THREEx:any;

export = BGController;
/**
 * BGController class. Used to manipulate the starfield/skybox in the background
 * @class BGController
 * @exends Base.Loggable
 */
class BGController extends Base.Loggable {
    private starMesh:any;
    private bgMusic:Audio.Music;


    constructor(private Game:Game) {
        super();
        this.log('BGController : Constructor');
        this.init();
    }

    public init():void {
        this.log('BGController : Init');
        this.drawStars();
        this.createLight();
        this.createGameGrid();
        this.makeSweetBeautifulMusic();
    }

    private makeSweetBeautifulMusic():void {
        this.bgMusic = new Audio.Music('assets/sounds/lose.ogg', true);
    }

    private drawStars():void {
        this.log('BGController : drawStars');
        this.starMesh = this.createStars();
        this.Game.addToScene(this.starMesh);

        this.Game.addUpdate(this.updateStars, this);
    }

    private updateStars(delta:number, elapsed:number):void {
        this.starMesh.rotation.x += delta/200;
    }

    private createLight():void {
        this.log('BGController : createLight');
        this.Game.addToScene(new THREE.AmbientLight( 0xfefefe ));
    }

    public createStars():any {
        this.log('BGController : createStars');
        var geometry = new THREE.SphereGeometry(10000, 60, 40);
        var uniforms = {
          texture: { type: 't', value: THREE.ImageUtils.loadTexture('assets/images/galaxy_starfield.png') }
        };

        var material = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            vertexShader:   document.getElementById('sky-vertex').textContent,
            fragmentShader: document.getElementById('sky-fragment').textContent
        });

        var skyBox = new THREE.Mesh(geometry, material);
        skyBox.scale.set(-1, 1, 1);
        skyBox.rotation.order = 'XZY';
        skyBox.renderDepth = 1000.0;
        skyBox.rotation.x += 90;
        return skyBox;
    }

    public createGameGrid(dir?:string):void {
        this.log('BGController : createGameGrid');
        var size:number = 1000,
            step:number = 50,
            grid1:any = new Grid(this.Game, size, step);
            // grid1:any = new THREE.grid1( size, step );

        // grid1.setColors(0xff0000, 0xff0000);

        // we'll throw the grid into a container so it doesn't get read by intersects
        var gridContainer = new THREE.Object3D();
        gridContainer.add(grid1.mesh);
        this.Game.addToScene( gridContainer );
    }
}

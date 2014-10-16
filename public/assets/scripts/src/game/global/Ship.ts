/// reference path="../../reference/three.d.ts" />
import Base = require('core/base');
import Game = require('game');
import Audio = require('game/util/Audio');

declare var THREE:any;
declare var THREEx:any;
declare var Physijs:any;

export = Ship;
/**
 * Ship class. Preloads Ships and offers functions to play/stop/etc
 * @class Ship
 * @exends Base.Loggable
 */
class Ship extends Base.Loggable {
    public mesh:any;
    private $body:JQuery = $(document.body);

    constructor(private Game:Game) {
        super();
        this.log('Ship : Constructor');
        this.init();
    }

    private init():void {
        var self:Ship = this;
        self.createShip();
        self.bindKeys();
    }

    private createShip():void {
        var self:Ship = this,
            size:number = 500;
        self.mesh = new Physijs.BoxMesh(
                            new THREE.BoxGeometry(size, size, size),
                        Physijs.createMaterial(
                            new THREE.MeshLambertMaterial({color: 0xffffff, fog: false}),
                            1, // friction
                            1 // restitution
                        ),
                        10
                    );


        var light = new THREE.PointLight(0xFF0000);
        self.mesh.add(light);
        light.intensity = 1;
        light.position.set(0, 0, 0);

        self.mesh.position.set(-500, 0,0);
        self.mesh.__dirtyPosition = true;
        self.mesh.castShadow = self.mesh.receiveShadow = false;
    }

    private bindKeys():void {
        this.$body.on('keydown', (e:any)=>{
            switch(e.which){
                case 87:
                    this.push('up');
                    break;
                case 83:
                    this.push('down');
                    break;
                case 65:
                    this.push('left');
                    break;
                case 68:
                    this.push('right');
                    break;
            }
        });
    }

    public getMesh():any {
        return this.mesh;
    }

    private push(dir:string):void {
        var self:Ship = this,
            strength:number = 10000;

        switch(dir){
            case 'up':
                self.mesh.applyImpulse(new THREE.Vector3(-strength, 0, 0), new THREE.Vector3(0,0,0));
                break;
            case 'down':
                self.mesh.applyImpulse(new THREE.Vector3(strength, 0, 0), new THREE.Vector3(0,0,0));
                break;
            case 'right':
                self.mesh.applyImpulse(new THREE.Vector3(0, 0, -strength), new THREE.Vector3(0,0,0));
                break;
            case 'left':
                self.mesh.applyImpulse(new THREE.Vector3(0, 0, strength), new THREE.Vector3(0,0,0));
                break;
        }
        // self.mesh.setLinearFactor(new THREE.Vector3(1,1,1));
        // self.mesh.applyImpulse(new THREE.Vector3(500, 0, 0), new THREE.Vector3(0,0,0));
    }

}

// reference path="reference/three.d.ts" />
import Base = require('core/base');
import BGController = require('game/global/BGController');
import MainMenu = require('game/global/MainMenu');
import Ship = require('game/global/Ship');
import Audio = require('game/util/Audio');

declare var Stats:any;
declare var THREE:any;
declare var THREEx:any;
declare var Physijs:any;
declare var Detector:any;

export = Game;
/**
 * Game class. Builds global controllers etc and starts the game.
 * @class Game
 * @exends Base.SiteObject
 */
class Game extends Base.SiteObject {
    private $container:JQuery;
	public $ui:JQuery;
    private $gameDisplay:JQuery;
	private gameDisplay:any;
    private Scene:any;
    private Camera:any;
    private Renderer:any;
    private Controls:any;
    private StatsDisplay:any;
    private Keyboard:any;
    private Clock:any;
    private BGController:BGController;

    private playerShip:Ship;

    private MainMenu:MainMenu;

    private projector:any;
    private INTERSECTED:any;
    private FOLLOWING:any;

    private SCREEN_WIDTH:number;
    private SCREEN_HEIGHT:number;

    private shouldLog:boolean = false;

    public MOUSE:any = {'x': -1, 'y': -1};

    public updateQueue:Array<any> = [];
    private updateKeys:any = {};
    public renderQueue:Array<any> = [];
    private renderKeys:any = {};

    constructor(private isMobile:boolean = false) {
        super($(document.body));
        this.log('Game : Constructor' + (this.isMobile ? ' : Mobile' : ' : Desktop'));
    }

    public init() {
        var self:Game = this;
        self.log('Game : Init');

        self.createGameElements();

        self.bindGlobalKeyboardEvents();
        self.makeMainMenu();
    }

    private bindMouseEvents():void {
        var self:Game = this;
        self.$gameDisplay.on('mousemove', (e)=>{
            self.MOUSE.x = ( e.clientX / window.innerWidth ) * 2 - 1;
            self.MOUSE.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
        });

        // self.$gameDisplay.on('click', (e)=>{
        //     if(self.INTERSECTED){
        //         self.disableTrackball();

        //         self.FOLLOWING = self.INTERSECTED;
        //         self.addUpdate(self.cameraFollow, self, 'Camera:Follow');
        //     }else{
        //         self.removeUpdate('Camera:Follow');
        //         self.enableTrackball();
        //         self.FOLLOWING = null;
        //     }
        // });
    }

    private cameraFollow():void {
        var self:Game = this,
            relativeCameraOffset = new THREE.Vector3(0,1000,0),
            cameraOffset = relativeCameraOffset.applyMatrix4( self.FOLLOWING.matrixWorld ),
            camera = self.Camera;

        camera.position.x = cameraOffset.x;
        camera.position.y = cameraOffset.y;
        camera.position.z = cameraOffset.z;
        // camera.lookAt( self.FOLLOWING.position );
    }

    private animate():void {
        window.requestAnimationFrame( ()=>this.animate() );


        var delta = this.Clock.getDelta(),
            elapsed = this.Clock.getElapsedTime();

        this.update(delta, elapsed);
        this.render(this.Scene, this.Camera);
    }

    private update(delta:number, elapsed:number):void {

        this.updateQueue.forEach((onUpdateFunc) => {
            onUpdateFunc&&onUpdateFunc(delta, elapsed);
        });
    }

    private render(scene:any, camera:any):void {
        this.renderQueue.forEach((onRenderFct) => {
            onRenderFct&&onRenderFct(scene, camera);
        });
    }

    private createGameElements():void {
        var self:Game = this;
        self.$container = $(self.$body.find('[data-template="Game"]').html());
        self.$root.prepend(self.$container);
        self.$ui = self.$container.find('.game-ui');
    }

    private makeMainMenu():void {
        var self:Game = this;
        self.MainMenu = new MainMenu(this);
        self.MainMenu.show();
    }

    private bindGlobalKeyboardEvents():void {
        this.$body.on('keyup', (e:any)=>{
            var keyCode:number = e.which;
            switch(e.which){
                case 77: // m
                    if(Audio.isMuted()){
                        Audio.unmute();
                    }else{
                        Audio.mute();
                    }
                    break;
            }
        });
    }

    public startGame() {
        var self:Game = this;

        self.Keyboard = new THREEx.KeyboardState();
        self.Clock = new THREE.Clock();

        self.makeScene();
        self.makeCamera();
        self.makeRenderer();
        self.bindEvents();
        self.bindMouseEvents();
        self.BGController = new BGController(self);
        self.bindIntersections();

        self.makePlanets();
        self.makeShip();

        self.makeStats();

        self.addRender(self.Renderer.render, self.Renderer);
        self.animate();
    }

    private makeShip():void {
        var self:Game = this;
        self.playerShip = new Ship(self);
        self.addToScene(self.playerShip.getMesh());

        // self.Camera.position.set( self.playerShip.getMesh().position );
        // self.Camera.position.y += 500;
        // self.Camera.lookAt(self.playerShip.getMesh());

        self.FOLLOWING = self.playerShip.getMesh();
        self.addUpdate(self.cameraFollow, self, 'Camera:Follow');
    }

    private makePlanets():void {
        var self:Game = this;

        // var planetContainer:any = new THREE.Object3D();
        for(var i:number = 0; i < 20; i++){
            self.addToScene((function(){
                var mesh2 = new Physijs.SphereMesh(
                        new THREE.SphereGeometry((Math.random()*15)+10, 32, 32),
                        Physijs.createMaterial(
                            new THREE.MeshLambertMaterial({color: 0xffffff, fog: false}),
                            0, // friction
                            0 // restitution
                        ),
                        10
                    );

                    // mesh2.position.set(0,0,0);
                    mesh2.position.set(Math.random()*900*(Math.random() > 0.5 ? -1 : 1), 0 /*(Math.random()*50)+20*/, Math.random()*100*(Math.random() > 0.5 ? -1 : 1) );
                    mesh2.castShadow = mesh2.receiveShadow = true;
                    mesh2.fog = false;


                    var outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.BackSide, fog: false, opacity: 0.4, transparent: true } );
                    var outlineMesh2 = new THREE.Mesh( mesh2.geometry , outlineMaterial2 );
                    mesh2.add( outlineMesh2 );
                    outlineMesh2.position.set(0,0,0);
                    outlineMesh2.scale.multiplyScalar(1.3);
                    outlineMesh2.visible = false;

                    mesh2.outlineEffect = outlineMesh2;

                    if(i % 2 === 0){
                        var light2 = new THREE.PointLight(0xffffff);
                        mesh2.add(light2);
                        light2.intensity = Math.random()/3;
                        light2.position.set(0, 0, 0);
                    }

                    return mesh2;
            })());
        }

        self.addToScene((function(){
                var mesh2 = new Physijs.SphereMesh(new THREE.SphereGeometry((Math.random()*15)+10, 32, 32), new THREE.MeshLambertMaterial({color: 0xffffff, fog: false}));
                    mesh2.position.set(0,0,0);
                    mesh2.castShadow = false;
                    mesh2.fog = false;

                    var outlineMaterial2 = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.BackSide, fog: false, opacity: 0.4, transparent: true } );
                    var outlineMesh2 = new THREE.Mesh( mesh2.geometry , outlineMaterial2 );
                    mesh2.add( outlineMesh2 );
                    outlineMesh2.position.set(0,0,0);
                    outlineMesh2.scale.multiplyScalar(1.3);
                    outlineMesh2.visible = false;
                    mesh2.outlineEffect = outlineMesh2;

                    return mesh2;
            })());
    }

    private makeScene():any {
        var self:Game = this;

        self.Scene = new Physijs.Scene();
        self.Scene.setGravity(new THREE.Vector3( 0, 0, 0 ));

        // self.Scene = new THREE.Scene();

        self.Scene.fog = new THREE.FogExp2( 0x000000, 0.00200 );

        self.addRender(()=>{
            self.Scene.simulate();
        }, self);

        return self.Scene;
    }

    public addToScene(...args:Array<any>):boolean {
        var self:Game = this;
        self.log('Game : addToScene', args);
        for(var i = 0; i < args.length; i++){
            self.Scene.add(args[i]);
        }
        return true;
    }


    public makeCamera():void {
        var self:Game = this;
        // CAMERA
        self.SCREEN_WIDTH = window.innerWidth;
        self.SCREEN_HEIGHT = window.innerHeight;

        var VIEW_ANGLE = 45,
          ASPECT = self.SCREEN_WIDTH / self.SCREEN_HEIGHT,
          NEAR = 0.1,
          FAR = 20000;
        self.Camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        self.addToScene(self.Camera);
        self.Camera.position.set(0, 500, 0);
    }

    public makeRenderer():void {
        var self:Game = this;
        // RENDERER
        if (Detector && Detector.webgl) {
          self.Renderer = new THREE.WebGLRenderer({
            antialias: true
          });
        }else{
          self.Renderer = new THREE.CanvasRenderer();
        }
        self.Renderer.setSize(self.SCREEN_WIDTH, self.SCREEN_HEIGHT);
        self.Renderer.shadowMapEnabled = true;

        self.$gameDisplay = self.$container.find('.game-display');
        self.gameDisplay = self.$gameDisplay[0];
        self.gameDisplay.appendChild(self.Renderer.domElement);

        // bind resize event
        THREEx.WindowResize(self.Renderer, self.Camera);
    }

    public bindEvents():void {
        var self:Game = this;
        // EVENTS
        THREEx.FullScreen.bindKey({
          charCode: 'f'.charCodeAt(0)
        });
        // CONTROLS
        self.Controls = new THREE.TrackballControls(self.Camera, self.Renderer.domElement);
        var controls = self.Controls;
        controls.minDistance = 100;
        controls.maxDistance = 2000;
        controls.zoomSpeed = 2.25;
        controls.panSpeed = 0.6;
        controls.rotateSpeed = 0.025;

        // controls.dynamicDampingFactor = 0.3;

        // controls.

        // controls.noRotate = true;
        // controls.noZoom = true;
        // controls.noPan = true;
        controls.noRoll = true;


        self.enableTrackball();

    }

    public enableTrackball():void {
        return this.disableTrackball();
        // var self:Game = this;
        // self.Controls.enabled = true;
        // self.addUpdate(self.Controls.update, self.Controls, 'Global:Controls');
    }

    public disableTrackball():void {
        var self:Game = this;
        self.Controls.enabled = false;
        self.removeUpdate('Global:Controls');
    }

    private bindIntersections():void {
        this.projector = new THREE.Projector();

        this.addUpdate(this.findIntersections, this);
    }

    private findIntersections():void {
        var self:Game = this;
        // create a Ray with origin at the mouse position
        //   and direction into the scene (camera direction)
        var vector = new THREE.Vector3( self.MOUSE.x, self.MOUSE.y, 1 );
        self.projector.unprojectVector( vector, self.Camera );
        var ray = new THREE.Raycaster( self.Camera.position, vector.sub( self.Camera.position ).normalize() );

        // create an array containing all objects in the scene with which the ray intersects
        var intersects = ray.intersectObjects( self.Scene.children );

        // INTERSECTED = the object in the scene currently closest to the camera
        //      and intersected by the Ray projected from the mouse position

        // if there is one (or more) intersections
        if ( intersects.length > 0 )
        {
            // if the closest object intersected is not the currently stored intersection object
            if ( intersects[ 0 ].object !== self.INTERSECTED )
            {
                // restore previous intersection object (if it exists) to its original color
                if ( self.INTERSECTED && self.INTERSECTED.hasOwnProperty('outlineEffect') ) {
                    self.INTERSECTED.outlineEffect.visible = false;
                }
                self.INTERSECTED = intersects[ 0 ].object;

                if ( self.INTERSECTED && self.INTERSECTED.hasOwnProperty('outlineEffect') ) {
                    self.INTERSECTED.outlineEffect.visible = true;
                }
            }
        }
        else // there are no intersections
        {
            // restore previous intersection object (if it exists) to its original color
            if ( self.INTERSECTED && self.INTERSECTED.hasOwnProperty('outlineEffect') ) {
                self.INTERSECTED.outlineEffect.visible = false;//.material.color.setHex( self.INTERSECTED.currentHex );
            }
            // remove previous intersection object reference
            //     by setting current intersection object to "nothing"
            self.INTERSECTED = null;
        }
    }


    public makeStats():void {
        var self:Game = this;

        self.StatsDisplay = new Stats();
        self.StatsDisplay.domElement.style.position = 'fixed';
        self.StatsDisplay.domElement.style.bottom = '0px';
        self.StatsDisplay.domElement.style.zIndex = 100;
        self.$gameDisplay.append(self.StatsDisplay.domElement);

        self.addUpdate(self.StatsDisplay.update, self.StatsDisplay);
    }


    public addUpdate(fnc:any, context:any, name?:string):number {
        if(name){
            if(this.updateKeys.hasOwnProperty(name)){
                return -1;
            }
        }

        this.updateQueue.push(
            (function(fnc:any, context:any) {
                return function(delta:number, elapsed:number){
                    fnc.call(context, delta, elapsed);
                };
            })(fnc, context)
        );

        if(name){
            this.updateKeys[name] = this.updateQueue.length-1;
        }

        return this.updateQueue.length-1;
    }

    public removeUpdate(index:string):void;
    public removeUpdate(index:number):void;
    public removeUpdate(index):void {
        var toRemove:number;
        if(typeof index === 'string'){
            toRemove = this.updateKeys[index];
            delete this.updateKeys[index];
        }else{
            toRemove = index;
        }

        this.updateQueue[toRemove] = null;//.splice(toRemove, 1);
    }

    public addRender(fnc:any, context:any, name?:string):number {
        if(name){
            if(this.renderKeys.hasOwnProperty(name)){
                return -1;
            }
        }

        this.renderQueue.push(
            (function(fnc:any, context:any) {
                return function(delta:number, elapsed:number){
                    fnc.call(context, delta, elapsed);
                };
            })(fnc, context)
        );

        if(name){
            this.renderKeys[name] = this.renderQueue.length-1;
        }

        return this.renderQueue.length-1;
    }

    public removeRender(index:string):void;
    public removeRender(index:number):void;
    public removeRender(index):void {
        var toRemove:number;
        if(typeof index === 'string'){
            toRemove = this.renderKeys[index];
            delete this.renderKeys[index];
        }else{
            toRemove = index;
        }

        this.renderQueue[toRemove] = null;//.splice(toRemove, 1);
    }
}

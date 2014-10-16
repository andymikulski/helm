// reference path="reference/three.d.ts" />

import Base = require('core/base');

declare var THREE:any;
declare var THREEx:any;
declare var Detector:any;
declare var Stats:any;
declare var ParticleEngine:any;
export = App;
/**
 * Application class. Starts the app.
 * Inits global objects (like Factory/WindowController),
 * as well as applies certain UA tags to html element if necessary.
 * @class App
 * @exends Base.SiteObject
 */
class App extends Base.SiteObject {
    container: any;
    scene: any;
    camera: any;
    renderer: any;
    controls: any;
    stats: any;
    keyboard: any;
    clock: any;
    mesh: any;
    mesh2: any;
    light: any;
    engine: any;
    DOF:any;

    SCREEN_WIDTH:number;
    SCREEN_HEIGHT:number;

    constructor() {
        super($(document.body));
        this.log('App : Constructor');
    }

    public init() {
        this.log('App : Init');

        this.keyboard = new THREEx.KeyboardState();
        this.clock = new THREE.Clock();

        // SCENE
        this.scene = new THREE.Scene();

        this.makeCamera();
        this.makeRenderer();
        this.bindEvents();
        this.makeStats();
        this.buildScene();
        // this.startParticles();
        // this.makeDOF();

        this.animate();
    }

    public makeDOF():void {
        this.DOF = new THREEx.DepthOfField(this.renderer);
        this.DOF.uniforms['focus'].value   = 0.90;
        this.DOF.uniforms['aperture'].value = 0.006;
        this.DOF.uniforms['maxblur'].value  = 0.002;
    }

    public makeCamera():void {
        // CAMERA
        this.SCREEN_WIDTH = window.innerWidth;
        this.SCREEN_HEIGHT = window.innerHeight;

        var VIEW_ANGLE = 45,
          ASPECT = this.SCREEN_WIDTH / this.SCREEN_HEIGHT,
          NEAR = 0.1,
          FAR = 20000;
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.scene.add(this.camera);
        this.camera.position.set(0, 150, 400);
        this.camera.lookAt(this.scene.position);
    }

    public makeRenderer():void {
        // RENDERER
        if (Detector && Detector.webgl) {
          this.renderer = new THREE.WebGLRenderer({
            antialias: true
          });
        }else{
          this.renderer = new THREE.CanvasRenderer();
        }
        this.renderer.setSize(this.SCREEN_WIDTH, this.SCREEN_HEIGHT);
        this.renderer.shadowMapEnabled = true;

        this.container = this.$root[0];//document.getElementById('ThreeJS');
        this.container.appendChild(this.renderer.domElement);

        // bind resize event
        THREEx.WindowResize(this.renderer, this.camera);
    }

    public bindEvents():void {
        // EVENTS
        THREEx.FullScreen.bindKey({
          charCode: 'm'.charCodeAt(0)
        });
        // CONTROLS
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    }

    public makeStats():void {
        // STATS
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.bottom = '0px';
        this.stats.domElement.style.zIndex = 100;
        this.container.appendChild(this.stats.domElement);
    }

    public loadModels():void {
        var dae;

        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load( 'assets/models/monster.dae', ( collada ) => {
            dae = collada.scene;
            dae.traverse( function (child ) {

                if ( child instanceof THREE.SkinnedMesh ) {

                    var animation = new THREE.Animation( child, child.geometry.animation );
                    animation.play();

                }

            } );
            dae.scale.x = dae.scale.y = dae.scale.z = 0.002;
            dae.updateMatrix();


        } );
    }

    public startParticles():void {
        this.engine = new ParticleEngine(this.scene);
        this.engine.setValues({
            positionStyle    : 1,
            positionBase     : new THREE.Vector3( 0, 200, 0 ),
            positionSpread   : new THREE.Vector3( 600, 400, 600 ),

            velocityStyle    : 1,
            velocityBase     : new THREE.Vector3( 0, 0, 0 ),
            velocitySpread   : new THREE.Vector3( 0.5, 0.5, 0.5 ),

            angleBase               : 0,
            angleSpread             : 720,
            angleVelocityBase       : 0,
            angleVelocitySpread     : 4,

            particleTexture : THREE.ImageUtils.loadTexture( 'assets/images/floor-square.jpg' ),

            sizeBase    : 10.0,
            sizeSpread  : 2.0,
            colorBase   : new THREE.Vector3(0.15, 1.0, 0.9), // H,S,L
            colorSpread : new THREE.Vector3(0.00, 0.0, 0.2),
            opacityBase : 1,

            particlesPerSecond : 20000,
            particleDeathAge   : 60.0,
            emitterDeathAge    : 0.1
        });
        this.engine.initialize();
    }

    public buildScene():void {
        // LIGHT
        var light2 = new THREE.PointLight(0xffffff);

        // var light = new THREE.SpotLight(0xffff00);
        // light.position.set(-60,150,-30);
        // light.shadowCameraVisible = false;
        // light.shadowDarkness = 0.5;
        light2.intensity = 0.1;

        light2.position.set(0, 250, 0);
        // light2.castShadow = true;
        this.scene.add(light2);



        this.light = new THREE.SpotLight(0xffffff);
        this.light.position.set(-60,250,-30);
        this.light.shadowCameraVisible = false;
        this.light.shadowCameraNear = 0.1;
        this.light.shadowDarkness = 0.9;
        this.light.intensity = 1;
        this.light.castShadow = true;
        this.light.shadowCameraFov = 45;


        this.light.shadowMapWidth = 2048;
        this.light.shadowMapHeight = 2048;

        this.scene.add(this.light);


        // FLOOR
        var floorTexture = new THREE.ImageUtils.loadTexture('assets/images/floor-square.jpg');
        var floorBump = new THREE.ImageUtils.loadTexture('assets/images/floor-bump-square.jpg');

        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(4, 4);
        floorTexture.needsUpdate = true;


        floorBump.wrapS = floorBump.wrapT = THREE.RepeatWrapping;
        floorBump.repeat.set(4, 4);
        floorBump.needsUpdate = true;


        // var floorMaterial = new THREE.MeshLambertMaterial({
        //   map: floorTexture,
        //   side: THREE.DoubleSide
        // });


        var floorMaterial = new THREE.MeshPhongMaterial({
            color      :  new THREE.Color('rgb(255,255,255)'),
            emissive   :  new THREE.Color('rgb(0,0,0)'),
            specular   :  new THREE.Color('rgb(255,255,255)'),
            shininess  :  30,
            bumpMap    :  floorBump,
            map        :  floorTexture,
            bumpScale  :  1.5,
            side       :  THREE.DoubleSide
        });



        var floorGeometry = new THREE.PlaneGeometry(2048, 2048, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);


        // SKYBOX
        var skyBoxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
        var skyBoxMaterial = new THREE.MeshBasicMaterial({
          color: 0x010101,
          side: THREE.BackSide
        });
        var skyBox = new THREE.Mesh(skyBoxGeometry, skyBoxMaterial);
        this.scene.add(skyBox);

        ////////////
        // CUSTOM //
        ////////////

        var geometry = new THREE.BoxGeometry(50, 50, 50);
        var material = new THREE.MeshLambertMaterial({
          color: 0xF10000
        });

        // use LineBasicMaterial if no dashes are desired
        var dashMaterial = new THREE.LineDashedMaterial( { color: 0x000000, dashSize: 2, gapSize: 3 } );

        this.mesh = new THREE.Line( this.geo2line(geometry), dashMaterial, THREE.LinePieces );
        // this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(0, 40, 0);
        this.mesh.castShadow = true;




        this.scene.add(this.mesh);


        this.mesh2 = new THREE.Mesh(new THREE.SphereGeometry(25, 32, 32), material);
        this.mesh2.position.set(100, 40, 100);
        this.mesh2.castShadow = true;
        this.scene.add(this.mesh2);


        var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.BackSide } );
        var outlineMesh1 = new THREE.Mesh( new THREE.SphereGeometry(25, 32, 32), outlineMaterial1 );
        outlineMesh1.position = this.mesh2.position;
        outlineMesh1.scale.multiplyScalar(1.05);
        this.mesh2.add( outlineMesh1 );
    }

    public geo2line( geo ) // credit to WestLangley!
    {
        var geometry = new THREE.Geometry();
        var vertices = geometry.vertices;

        var a, b, c, d;

        for ( var i = 0; i < geo.faces.length; i++ )
        {
            var face = geo.faces[ i ];
            if ( face instanceof THREE.Face3 )
            {
                a = geo.vertices[ face.a ].clone();
                b = geo.vertices[ face.b ].clone();
                c = geo.vertices[ face.c ].clone();
                vertices.push( a,b, b,c, c,a );
            }
            else if ( face instanceof THREE.Face4 )
            {
                a = geo.vertices[ face.a ].clone();
                b = geo.vertices[ face.b ].clone();
                c = geo.vertices[ face.c ].clone();
                d = geo.vertices[ face.d ].clone();
                vertices.push( a,b, b,c, c,d, d,a );
            }
        }

        geometry.computeLineDistances();
        return geometry;
    }

    public animate():void
    {
        window.requestAnimationFrame( ()=>this.animate() );
        this.render();
        this.update();
    }

    public update():void
    {
        var delta = this.clock.getDelta(),
            elapsed = this.clock.getElapsedTime();

        this.mesh.rotation.y += delta;
        this.mesh.position.y = 35 + (Math.sin( elapsed*2.5 ) * 5);

        this.mesh2.rotation.y += delta/2;
        this.mesh2.position.y = 35 + (Math.sin( elapsed*2 ) * 5);

        this.light.position.x =  -60 + (Math.sin(elapsed)*200);
        this.light.position.z =  -30 + (Math.cos(elapsed)*200);



        // -60,250,-30);


        this.controls.update();
        this.stats.update();
    }

    public render():void
    {
        this.renderer.render( this.scene, this.camera );
        // this.DOF.render(this.scene, this.camera);
    }

}

var renderer = new THREE.WebGLRenderer({
    // antialias	: true,
    alpha: true
});
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
// renderer.setPixelRatio( 2 );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild(renderer.domElement);

// init scene and camera
var scene = new THREE.Scene();
var camera = new THREE.Camera();
scene.add(camera);

var markerGroup = new THREE.Group();
scene.add(markerGroup);

var source = new THREEAR.Source({ renderer, camera });

THREEAR.initialize({ source: source }).then((controller) => {
    var loader = new THREE.OBJLoader();

    // load a resource
    loader.load(
        // resource URL
        './models/test.obj',
        // called when resource is loaded
        function (object) {
            markerGroup.add(object);

        },
    );
    
    // add a torus knot		
    var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16);
    var material = new THREE.MeshNormalMaterial();
    var torus = new THREE.Mesh(geometry, material);
    torus.position.y = 0.5
    markerGroup.add(torus);


    var patternMarker = new THREEAR.PatternMarker({
        patternUrl: './data/patt.hiro',
        markerObject: markerGroup
    });

    controller.trackMarker(patternMarker);

    // run the rendering loop
    var lastTimeMsec = 0;
    requestAnimationFrame(function animate(nowMsec) {
        // keep looping
        requestAnimationFrame(animate);
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        // call each update function
        controller.update(source.domElement);
        // cube.rotation.x += deltaMsec/10000 * Math.PI
        torus.rotation.y += deltaMsec / 1000 * Math.PI
        torus.rotation.z += deltaMsec / 1000 * Math.PI
        renderer.render(scene, camera);
    });

});
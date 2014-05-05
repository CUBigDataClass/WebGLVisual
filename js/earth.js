//Dasha'sthing
	



(function () {
	function adddata(){
	var data ;
	data = new XMLHttpRequest();

	results = []
	result=[]
	data.open('get', 'beergeo'+j+'.txt', true); 
	data.onreadystatechange= boom;
	data.send(null);
	
	function boom() {
	if(data.readyState==4) {
	data2=data.responseText;
	
	var strings = data2.split("\n");
	var coords = []
	var words = []
	for ( var i = 0; i < strings.length; ++i ){
		if (strings[i].charAt(0)=='a') {
			coords.push(strings[i])
		}
		else{
			words.push(strings[i])
		}
	}

	for( var i = 0; i < coords.length; ++i ) {
		results[i]=new Array(3);
		var tokens = coords[i].split(',');

		results[i][0]=tokens[1];
		results[i][1] =tokens[2];
		results[i][2]=tokens[3];
	}
    
    for( var i = 0; i < words.length; ++i ) {
		result[i]=new Array(3);
		var tokens = words[i].split(',');

		result[i][0]=tokens[1];
		result[i][1] =tokens[2];
		result[i][2]=tokens[3]
		if (result[i][1] == "beer"){
			color1="0x79CDCD";
		}else{color1="FF0000";}
		if(result[i][2]!=undefined){
			document.getElementById("tweettxt").innerHTML+=result[i][2].fontcolor(color1)+"</br>";
		}
	}
    }
    
    var points = addPoints(results);
  	}
	
	j=j+1;

	}
	
	var j = 4;
	setInterval(adddata,1000);
	var webglEl = document.getElementById('webgl');

	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(webglEl);
		return;
	}

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 0.5,
		segments = 32,
		rotation = 6;  

	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
	camera.position.z = 1.5;


	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);

	scene.add(new THREE.AmbientLight(0x333333));

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(5,3,5);
	scene.add(light);

    var sphere = createSphere(radius, segments);
	sphere.rotation.y = rotation; 
	scene.add(sphere);



    var clouds = createClouds(radius, segments);
	clouds.rotation.y = rotation;
	scene.add(clouds);


	var stars = createStars(90, 64);
	scene.add(stars);
	var lat = 30.35568154;
	var longi= -81.59736019;
	var phi = (93 - lat) * Math.PI / 180;
	var theta = (16 - longi) * Math.PI / 180;




	var controls = new THREE.TrackballControls(camera);

	webglEl.appendChild(renderer.domElement);

	render();
	window.addEventListener('resize', onWindowResize, false);

	function render() {
		controls.update();

		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	function createSphere(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments),
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
				bumpMap:     THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
				bumpScale:   0.005,
				specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
				specular:    new THREE.Color('grey')								
			})
		);
	}

	function addPoints(points) {

		var group = new THREE.Object3D();
		for (i = 0; i < points.length; i ++) {
			var borw = points[i][2];
			var lat = points[i][0];
			var longi= points[i][1];
			var phi = (90 - lat) * Math.PI / 180;
			var theta = (16 - longi) * Math.PI / 180;
			addPoint(phi,theta, borw, group);   
		}
		scene.add(group)

	}
	function addPoint(phi, theta, color, group) {
		if (color =='w'){
				clr = 0xFF0000;
			}else {clr = 0x79CDCD}
		point = new THREE.Mesh(
			new THREE.SphereGeometry(.002),
			new THREE.MeshBasicMaterial({
			color: clr,
			transparent: true,
		})
		);
		point.position.x = .501*Math.sin(phi) * Math.cos(theta);
	    point.position.y = .501*Math.cos(phi);
	    point.position.z = .501*Math.sin(phi) * Math.sin(theta);
	    group.add(point);

	}


	function createClouds(radius, segments) {
		return new THREE.Mesh(
			new THREE.SphereGeometry(radius + 0.003, segments, segments),			
			new THREE.MeshPhongMaterial({
				map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
				transparent: true
			})
		);		
	}

	function createPoint(lat, longi) {
		

		return new THREE.Mesh(
				new THREE.SphereGeometry(.01),


				new THREE.MeshBasicMaterial({
				color: 0xFF0000,
				transparent: true,
			})
			);
	}

	function createStars(radius, segments) {

		return new THREE.Mesh(
			new THREE.SphereGeometry(radius, segments, segments), 
			new THREE.MeshBasicMaterial({
				map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
				side: THREE.BackSide
			})
		);
	}

	  function onWindowResize( event ) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

}());
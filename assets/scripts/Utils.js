// file Utils

function computeDist(x1, y1, x2, y2){
	var res = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
	return res;
}

function getCoordComponent(c1, c2){
	var res = Math.abs(c2-c1);
	return res;
}

function getAngle(x1, y1, x2, y2){
	var edge = computeDist(x1, y1, x2, y2);
	//var xComp = getCoordComponent(x1, x2);
	var yComp = getCoordComponent(y1, y2);

	var res = Math.asin(yComp / edge)/0.0174533;
	//var res = Math.asin(sinDeg);

	return res;
}

//MATERIALS GENERATORS

function generateMaterialMF( uniforms, diffuse, specular, normal){
	diffuse.minFilter = THREE.LinearMipMapLinearFilter; 
	diffuse.anisotropy = renderer.getMaxAnisotropy();
	specular.minFilter = THREE.LinearMipMapLinearFilter; 
	specular.anisotropy = renderer.getMaxAnisotropy();
	normal.minFilter = THREE.LinearMipMapLinearFilter; 
	normal.anisotropy = renderer.getMaxAnisotropy();
	var shader = microFacetShader;
	//var vs = document.getElementById("vertex").textContent;
	//var fs = document.getElementById("fragmentDSN").textContent;
	var material = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader });

	return material;
}

function generateMaterialL(uniforms, diffuse, normal){
	diffuse.minFilter = THREE.LinearMipMapLinearFilter; 
	diffuse.anisotropy = renderer.getMaxAnisotropy();
	normal.minFilter = THREE.LinearMipMapLinearFilter; 
	normal.anisotropy = renderer.getMaxAnisotropy();

	var shader = lambertianShader;
	var material = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: shader.vertexShader, fragmentShader: shader.fragmentShader });

	return material;
}

function playFatality() {

	var fatal_texr = THREE.ImageUtils.loadTexture( "assets/textures/fatality.png" );
	var fatal_geom = new THREE.PlaneBufferGeometry(10, 5, 1, 1);
	var fatal_mat = new THREE.MeshBasicMaterial({ map: fatal_texr, transparent: true });
	fatal_mesh = new THREE.Mesh(fatal_geom, fatal_mat);

	fatal_mesh.rotation.x = -90 * Math.PI / 180; 				
	scene.add(fatal_mesh);


		
	tween_pos = 	{ x: monster_death.position.x, y: monster_death.position.y + 10, z: monster_death.position.y + 2 };
	tween_tar = 	{ x: monster_death.position.x, y: monster_death.position.y + 1.5, z: monster_death.position.y + 2 };
	tween = new TWEEN.Tween(tween_pos).to(tween_tar, 3000);

	tween.onUpdate( function(){
		fatal_mesh.position.x = tween_pos.x;
		fatal_mesh.position.y = tween_pos.y;
	} );	
	tween.easing(TWEEN.Easing.Bounce.Out);
								

	tweenActive = true;	// attiva per il render loop

					

}

// Caricamento dei files .dae
function loadNPC(){

	// Load moving monster
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( 'assets/animations/monster.dae', function ( collada ) {

		monster_alive = collada.scene;	

		monster_alive.traverse( function ( child ) {

			if ( child instanceof THREE.SkinnedMesh ) {						
				child.material.map = THREE.ImageUtils.loadTexture( "assets/textures/monster.jpg" );
				var animation = new THREE.Animation( child, child.geometry.animation );
				animation.play();
			}
		} );

		monster_alive.scale.x = monster_alive.scale.y = monster_alive.scale.z = 0.002;
		monster_alive.updateMatrix();
		monster_alive.rotation.y = Math.PI;
		monster_alive.position.x = effectController.target;
		monster_alive.position.y = -0.25;
		target = monster_alive;
		scene.add(monster_alive);
							
	} );

	// Load dying monster
	var loader2 =  new THREE.ColladaLoader();
	loader2.options.convertUpAxis = true;
	loader2.load( 'assets/animations/monsterdeath.dae', function ( collada ) {

		monster_death = collada.scene;

		monster_death.traverse( function ( child ) {

			if ( child instanceof THREE.SkinnedMesh ) {						

				child.material.map = THREE.ImageUtils.loadTexture( "assets/textures/monster.jpg" );
				deathAnimation = new THREE.Animation( child, child.geometry.animation );
				deathAnimation.loop = false;						

			}
		} );

		monster_death.scale.x = monster_death.scale.y = monster_death.scale.z = 0.002;
		monster_death.position.y = -0.25;
		monster_death.updateMatrix();
		monster_death.visible = false;
		scene.add(monster_death);			

	} );

	// Load attacking monster
	var loader3 =  new THREE.ColladaLoader();
	loader3.options.convertUpAxis = true;
	loader3.load( 'assets/animations/monsterattack.dae', function ( collada ) {

		monster_attack = collada.scene;

		monster_attack.traverse( function ( child ) {

			if ( child instanceof THREE.SkinnedMesh ) {						

				child.material.map = THREE.ImageUtils.loadTexture( "assets/textures/monster.jpg" );
				attackAnimation = new THREE.Animation( child, child.geometry.animation );
				attackAnimation.loop = true;						

			}
		} );

		monster_attack.scale.x = monster_attack.scale.y = monster_attack.scale.z = 0.002;
		monster_attack.position.y = -0.25;
		monster_attack.updateMatrix();
		monster_attack.visible = false;
		scene.add(monster_attack);			

	} );

}

function loadColumns(loader, column_uniforms, column_diff, column_spec, column_norm) {

	var column_material = generateMaterialMF( column_uniforms, column_diff, column_spec, column_norm);
	var col2, col3;

	loader.load( 'assets/models/Column.obj', function ( object ) {
		object.traverse(function (child) {
		    if (child instanceof THREE.Mesh) {
			    child.material = column_material;
		    }
		});

		var scale = 0.003;
		//object.scale.set(scale, scale, scale);
		object.position.set(2.0, -0.45, -2.0);
		scene.add(object);

		col2 = object.clone();
		col2.position.set(4.0, -0.45, -2.0);
		scene.add(col2);

		col3 = object.clone();
		col3.position.set(6.0, -0.45, -2.0);
		scene.add(col3);
	} );

}

function loadStatues() {
	arrStat = [];

	if(statue1){
		for(var i=1; i<=statueCounter; i++) {
			var statue = statue1.clone();
			statue.position.set(i*2.0, 0.6, -2.0);
			statue.quaternion.set(q.x, q.y, q.z, q.w);
			arrStat.push(statue);
			scene.add(statue);
		}
	}
		

}

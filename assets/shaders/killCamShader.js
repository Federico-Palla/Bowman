//===========================
//KILLCAM SHADER
//Shader a kill cam effect using a combination of saturation and noise via post-processing tecniques 

killShader = {

			
uniforms: {
						"tDiffuse": { type: "t", value: null },
						"amount": { type: "f", value: 0.0 },
						"index": { type: "f", value: 0.0 },
						"time":       { type: "f", value: 0.0 },
						"nIntensity": { type: "f", value: 0.5 },
						"sIntensity": { type: "f", value: 1.5 },
						"sCount":     { type: "f", value: 4096 },
						"color": {type: "v3", value: new THREE.Vector3(0.8, 0.0, 0.0)}
					},
					
					vertexShader: [
						"varying vec2 vUv;",
						"void main() {",
							"vUv = uv;",
							"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
						"}"
					].join("\n"),

					fragmentShader: [
						"uniform sampler2D tDiffuse;",
						"varying vec2 vUv;",
						"uniform float amount;",
						"uniform float index;",
						"uniform float time;",
						"uniform float sIntensity;",
						"uniform float nIntensity;",
						"uniform float sCount;",
						"uniform vec3 color;",

						"float rand(vec2 co){",
		    				"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
						"}",
						"void main() {",
							// Noise generator: use time
							"float dx = rand( vUv + time );",//noise
							//la doppia somma serve a mantenere il colore originale in quanto la maschera delrumore sbiadisce il colore originale
							"vec3 original_color = texture2D(tDiffuse, vUv).rgb * clamp( 0.1 + dx, 0.0, 1.0 ) ;",
							"vec2 sc = vec2(mod(vUv.x * sCount, 1.0), mod( vUv.x * sCount, 1.0 ) );",
							"original_color += texture2D(tDiffuse, vUv).rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",

					// interpolate between source and result by intensity
					"original_color =texture2D(tDiffuse, vUv).rgb + clamp( nIntensity, 0.0,1.0 ) * ( original_color - texture2D(tDiffuse, vUv).rgb );",

					// convert to grayscale if desired


							"vec3 luminance_converter = vec3(0.2126, 0.7152, 0.0722);",
							"float luminance = dot(original_color, luminance_converter);",
							"vec3 saturation = mix(mix(original_color, vec3(luminance),amount), mix(original_color, vec3(luminance)*color,amount), index);",
							"gl_FragColor = vec4(saturation  , 1.0);",
						"}"
					].join("\n")
		};
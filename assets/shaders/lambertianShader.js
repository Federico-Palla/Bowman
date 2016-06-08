lambertianShader = {
	vertexShader : [
		"uniform vec3 LightPosition;",
		"uniform vec3 LightPosition2;",
		"uniform vec3 LightPosition3;",
		"uniform vec3 LightPosition4;",

		"varying vec3 lightVector;",
		"varying vec3 lightVector2;",
		"varying vec3 lightVector3;",
		"varying vec3 lightVector4;",

		"varying vec2 uVv;",
		"varying vec3 transformedNormal;",
		"varying vec3 pointPosition;",


		"void main() {",
			"transformedNormal = normalMatrix * normal;",
			"vec3 pointPosition = (modelViewMatrix * vec4( position, 1.0 )).xyz;",

			"vec4 lPosition = viewMatrix * vec4( LightPosition, 1.0 );",
			"vec4 lPosition2 = viewMatrix * vec4( LightPosition2, 1.0 );",
			"vec4 lPosition3 = viewMatrix * vec4( LightPosition3, 1.0 );",
			"vec4 lPosition4 = viewMatrix * vec4( LightPosition4, 1.0 );",
			//"lightVector = vec3(0.0, 1.0, 1.0);",
			"lightVector = normalize(lPosition.xyz);",
			"lightVector2 = lPosition2.xyz - pointPosition;",
			"lightVector3 = lPosition3.xyz - pointPosition;",
			"lightVector4 = lPosition4.xyz - pointPosition;",

			"uVv = uv;",
			"gl_Position = projectionMatrix * vec4(pointPosition,1.0);",
		"}"
	].join("\n"),
	fragmentShader : [
			"uniform vec3 lightPower;",
			"uniform vec3 lightPower2;",
			"uniform vec3 lightPower3;",
			"uniform vec3 lightPower4;",

			"varying vec3 lightVector;",
			"varying vec3 lightVector2;",
			"varying vec3 lightVector3;",
			"varying vec3 lightVector4;",

			"varying vec3 transformedNormal;",
			"varying vec2 uVv;",
			"varying vec3 pointPosition;",

			"uniform sampler2D diffuseMap;",
			"uniform sampler2D normalMap;",
			"uniform vec2 normalScale;",
			"uniform vec3 ambient;",

			//temp
			
			"uniform vec3 lightColor2;",
			"uniform vec3 lightColor3;",
			//pemt

			"#extension GL_OES_standard_derivatives : enable",

			"#define PI 3.14159265",

			"vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {",

				"vec3 q0 = dFdx( eye_pos.xyz );",
				"vec3 q1 = dFdy( eye_pos.xyz );",
				"vec2 st0 = dFdx( uVv.st );",
				"vec2 st1 = dFdy( uVv.st );",

				"vec3 S = normalize(  q0 * st1.t - q1 * st0.t );",
				"vec3 T = normalize( -q0 * st1.s + q1 * st0.s );",
				"vec3 N = normalize( surf_norm );",

				"vec3 mapN = texture2D( normalMap, uVv ).xyz * 2.0 - 1.0;",
				"mapN.xy = normalScale * mapN.xy;",
				"mat3 tsn = mat3( S, T, N );",
				"return normalize( tsn * mapN );",

			"}",

			"void main(){",

					"vec3  n      		 	= normalize( transformedNormal ); ",
					"vec3 normal 			= perturbNormal2Arb(pointPosition, n);", 
					"vec3  l         		= normalize(  lightVector ); ",
					"vec3 l2 				= normalize( lightVector2 );",
					"vec3 l3 				= normalize( lightVector3 );",
					"vec3 l4 				= normalize( lightVector4 );",

					"float  NdotL 			= max(0.000001, dot( n, l )); ",
					"float  NdotL2			= max(0.000001, dot( n, l2 ));",
					"float  NdotL3			= max(0.000001, dot( n, l3 ));",
					"float  NdotL4			= max(0.000001, dot( n, l4 ));",

					//albedo (colore del texel) / PI
					"vec3 albedo = texture2D(diffuseMap,uVv).rgb;",			//per il colore della luce basta moltiplicarlo
					"vec3 rho =  albedo.rgb / PI;",

					"vec3 albedo2 = texture2D(diffuseMap,uVv).rgb * lightColor2.rgb;",
					"vec3 rho2 =  albedo2.rgb / PI;",

					"vec3 albedo3 = texture2D(diffuseMap,uVv).rgb * lightColor3.rgb;",
					"vec3 rho3 =  albedo3.rgb / PI;",

					"vec3 beta = lightPower / ( 4.0  * PI * pow( length(lightVector),2.0) );",
					//"vec3 beta = lightPower * 0.005;",
					"vec3 beta2 = lightPower2 / ( 4.0  * PI * pow( length(lightVector2),2.0) );",
					"vec3 beta3 = lightPower3 / ( 4.0  * PI * pow( length(lightVector3),2.0) );",

					"vec3 beta4;",
					"if(NdotL4 > cos(cos(PI/12.0))){",
						"beta4 = 1.0 * lightPower4 / ( 4.0  * PI * pow( length(lightVector4),2.0) );",
					"} else {",
						"if(NdotL4 <= cos(cos(PI/6.0))){",
							"beta4 = 0.0 * lightPower4 / ( 4.0  * PI * pow( length(lightVector4),2.0) );",
						"} else {",
							"vec3 beta4 = pow( ( ( NdotL4 - cos(PI/6.0) ) /( cos(PI/12.0)-cos(PI/6.0 ) )),15.0) * lightPower4 / ( 4.0  * PI * pow( length(lightVector4),2.0) );",
						"}",
					"}",
					
					"vec3 outgoingRadiance = beta * NdotL * rho + ",
					"beta2 * NdotL2 * rho2 + ",
					"beta3 * NdotL3 * rho3 + ",
					"beta4 * NdotL4 * rho  + ambient * albedo;",
					"gl_FragColor = vec4(outgoingRadiance, 1.0);",
				"}",

	].join("\n"),
}
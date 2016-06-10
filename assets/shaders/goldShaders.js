goldShaders = {
	vertexShader : [
		"uniform vec3 LightPosition;",
		"uniform vec3 LightPosition2;",
		"uniform vec3 LightPosition3;",
		"uniform vec3 LightPosition4;",

		"varying vec3 lightVector;",
		"varying vec3 lightVector2;",
		"varying vec3 lightVector3;",
		"varying vec3 lightVector4;",

		"varying vec3 transformedNormal;",
		"varying vec3 pointPosition;",


		"void main() {",
			"transformedNormal = normalMatrix * normal;",
			"vec3 pointPosition = (modelViewMatrix * vec4( position, 1.0 )).xyz;",

			"vec4 lPosition = viewMatrix * vec4( LightPosition, 1.0 );",
			"lightVector = normalize(lPosition.xyz);",

			"vec4 lPosition2 = viewMatrix * vec4( LightPosition2, 1.0 );",
			"lightVector2 = lPosition2.xyz - pointPosition;",

			"vec4 lPosition3 = viewMatrix * vec4( LightPosition3, 1.0 );",
			"lightVector3 = lPosition3.xyz - pointPosition;",

			"vec4 lPosition4 = viewMatrix * vec4( LightPosition4, 1.0 );",
			"lightVector4 = lPosition4.xyz - pointPosition;",

			"gl_Position = projectionMatrix * vec4(pointPosition,1.0);",
		"}",
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

			"uniform vec3 lightColor2;",
			"uniform vec3 lightColor3;",

			"uniform vec3 c_spec;",
			"uniform float alpha;",
			"uniform float s;",

			"varying vec3 transformedNormal;",
			"varying vec3 pointPosition;",



			"uniform vec3 ambient;",

			//"#extension GL_OES_standard_derivatives : enable",

			"#define PI 3.14159265",

			// geometry term
			"float G(float LdotH) {",
				"return 1.0/pow(LdotH,2.0);",
			"}",

			// compute Fresnel reflection term with Schlick approximation
			"vec3 F(float LdotH) {",
				"return c_spec + (vec3(1.0) - c_spec)*pow(1.0-LdotH, 5.0);",
			"}",

			// compute the normal distribution function, based on Trowbridge-Reitz
			"float D(float NdotH) {",
				"float A = pow(alpha,2.0);",
				"float B = PI * pow(pow(NdotH,2.0)*(A-1.0) + 1.0, 2.0);",
				"return A/B;",
			"}",

			

			"void main(){",

					"vec3  n      		 	= normalize( transformedNormal ); ",
					"vec3  v 				= normalize( -pointPosition ); ",

					"vec3  l         		= normalize(  lightVector ); ",
					"vec3  h 				= normalize( v+l );",
					"float  NdotH 			= max(0.000001, dot( n, h )); ",
					"float  VdotH 			= max(0.000001, dot( v, h )); ",
					"float  NdotV 			= max(0.000001, dot( n, v )); ",
					"float  NdotL 			= max(0.000001, dot( n, l )); ",

					"vec3 l2 				= normalize( lightVector2 );",
					"vec3 h2 				= normalize( v+l2 );",
					"float  NdotH2 			= max(0.000001, dot( n, h2 )); ",
					"float  VdotH2 			= max(0.000001, dot( v, h2 )); ",
					"float  NdotV2 			= max(0.000001, dot( n, v )); ",
					"float  NdotL2 			= max(0.000001, dot( n, l2 )); ",

					"vec3 l3 				= normalize( lightVector3 );",
					"vec3 h3 				= normalize( v+l3 );",
					"float  NdotH3 			= max(0.000001, dot( n, h3 )); ",
					"float  VdotH3 			= max(0.000001, dot( v, h3 )); ",
					"float  NdotV3 			= max(0.000001, dot( n, v )); ",
					"float  NdotL3 			= max(0.000001, dot( n, l3 )); ",

					"vec3 l4 				= normalize( lightVector4 );",
					"vec3 h4 				= normalize( v+l4 );",
					"float  NdotH4 			= max(0.000001, dot( n, h4 )); ",
					"float  VdotH4 			= max(0.000001, dot( v, h4 )); ",
					"float  NdotV4 			= max(0.000001, dot( n, v )); ",
					"float  NdotL4 			= max(0.000001, dot( n, l4 )); ",
					
					"vec3 c_diff = vec3(1.0, 0.79, 0.29);",

					"vec3 beta = lightPower / ( 4.0  * PI * pow( length(lightVector),2.0) );",
					"vec3 beta2 = lightPower2 / ( 4.0  * PI * pow( length(lightVector2),2.0) );",
					"vec3 beta3 = lightPower3 / ( 4.0  * PI * pow( length(lightVector3),2.0) );",
					
					"vec3 Specular = F(VdotH) * G(VdotH) * D(NdotH) / 4.0;",
					"vec3 Specular2 = F(VdotH2) * G(VdotH2) * D(NdotH2) / 4.0;",
					"vec3 Specular3 = F(VdotH3) * G(VdotH3) * D(NdotH3) / 4.0;",
					"vec3 Specular4 = F(VdotH4) * G(VdotH4) * D(NdotH4) / 4.0;",

					//SPOTLIGHT beta					
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

						"gl_FragColor = vec4((beta * NdotL * Specular + ", 
									"beta2 * NdotL2 * Specular2 + ",
									"beta3 * NdotL3 * Specular3 + ",
									"beta4 * NdotL4 * Specular4 + ",
									"ambient)",
									"* vec3(0.7, 0.7, 0.7), 1.0);",
				"}",

	].join("\n"),
}
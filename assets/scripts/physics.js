//Foglio js contenente le funzioni per il calcolo delle traiettorie e gittata

var x = 0;
var y = 0;

function computeXShot(x0, theta, v0, t){
	var v0x = v0 * Math.cos(theta * 0.0174533);
	var x = x0 + v0x * t;
	return x;
}

function computeYShot(y0, theta, v0, t){
	var v0y = v0 * Math.sin(theta * 0.0174533);
	y = y0 + v0y * t - (9.81 * Math.pow(t, 2))/2;
	return y;
}

function computeVelInit(mass, lb, tension){
	// 1 lb = 0,453592 kg
	var newton = lb * 0.453592 * 9.81;
	var v0 = Math.sqrt((tension * newton) / mass);

	return v0;
}

function getMaxY(v0, theta){
	var v0y = v0 * Math.sin(theta * 0.0174533);
	var yMax = y0 + Math.pow(v0y, 2)/(2*9.81);
	return yMax;
}

 function flightTime(v0, theta){
 	var v0y = v0 * Math.sin(theta * 0.0174533);
 	var time = 2*v0y / 9.81
 	return time;
 }


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
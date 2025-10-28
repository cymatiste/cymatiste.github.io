function connectedComponentLabelling(onCanvas){
	var labels = [];
	var data = [];
	var edges = [];
	var ctx = onCanvas.getContext("2d");
	var width = onCanvas.width;
	var height = onCanvas.height;
	var djs = new DisjointSet(height*width);
	//console.log(djs+" count is "+djs.getCount());
	imageData = ctx.getImageData(0, 0, width, height);
	
	// initialize every pixel as either a background pixel (0) or foreground pixel (1)
   	for (var y = 0; y < height; y++) {
		data[y] = [];
		labels[y] = [];
		edges[y] = [];
		for (var x = 0; x < width; x++) {
			var index = (x + y * width) * 4;
			var r = imageData.data[index+0];
			//var g = imageData.data[index+1];
			//var b = imageData.data[index+2];
			//var a = imageData.data[index+3];
			
			if(r > 50){
			//if(r*g*b > 125000){
				// then it's not black, and hence not 'background' 
				// (background in this case is the black lines, which are negative space)
				data[y][x] = 1;
			} else {
				data[y][x] = 0;
			}
			labels[y][x] = 0;
		}
	}
	
	// First pass
	for (var y = 0; y != height; y++) {
		for (var x = 0; x != width; x++) {
			var pi = (x + y * width);
			if (data[y][x] != 0){
				var numNeighbours = 0;
				// the pixel above
				if(y > 0 && data[y-1][x] == data[y][x]){
					numNeighbours++;
				}
				// the pixel left
				if(x > 0 && data[y][x-1] == data[y][x]){
					numNeighbours++;
				}
				// the pixel below
				if(y < height-1 && data[y+1][x] == data[y][x]){
					var ni = ((x) + (y+1) * width);
					numNeighbours++;
					djs.Union(pi,ni);
				}
				// the pixel right
				if(x < width-1 && data[y][x+1] == data[y][x]){
					var ni = ((x+1) + (y) * width);
					numNeighbours++;
					djs.Union(pi,ni);
				}
				labels[y][x] = djs.Find(pi);				
				edges[y][x] = (numNeighbours < 4);
			}
		}
	}
	//Second pass
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			var pi = (x + y * width);
			if(data[y][x] > 0){
				labels[y][x] = djs.Find(pi);		
			}
		}
	}
	return {labels:labels,edges:edges};
}
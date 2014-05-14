function desaturate() {
	pixels = context.getImageData(0,0,400,400);

	for (i=0; i<pixels.data.length; i+=4) {
		lum = 0.21*pixels.data[i] + 0.72*pixels.data[i+1] + 0.07*pixels.data[i+2];
		pixels.data[i] = pixels.data[i+1] = pixels.data[i+2] = lum
	}

	context.putImageData(pixels, 0,0);
};


function threshold() {
	pixels = context.getImageData(0,0,400,400);

	for (i=0; i<pixels.data.length; i+=4) {
		lum = 0.21*pixels.data[i] + 0.72*pixels.data[i+1] + 0.07*pixels.data[i+2];
		if (lum > 100)
			pixels.data[i] = pixels.data[i+1] = pixels.data[i+2] = 255;
		else
			pixels.data[i] = pixels.data[i+1] = pixels.data[i+2] = 0;
	}

	context.putImageData(pixels, 0,0);
};


function sharpen() {
	pixels = context.getImageData(0,0,400,400);
	matrix = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
	img = conv(pixels, matrix);
	context.putImageData(img, 0, 0);
};


function imblur() {
	pixels = context.getImageData(0,0,400,400);
	matrix = [[1/9, 1/9, 1/9], [1/9, 1/9, 1/9], [1/9, 1/9, 1/9]];
	img = conv(pixels, matrix);
	context.putImageData(img, 0,0);
};


function laplace() {
	desaturate();
	matrix = [[0.5, 1, 0.5], [1, -6, 1], [0.5, 1, 0.5]];
	pixels = context.getImageData(0,0,400,400);
	img = conv(pixels, matrix);
	context.putImageData(img, 0,0);
};


function sobel() {
	desaturate();
	pixels = context.getImageData(0,0,400,400);
	matrix = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
	img1 = conv(pixels, matrix);
	matrix = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
	img2 = conv(img1, matrix);
	context.putImageData(img2, 0,0);
}



function conv(pixels, matrix) {
	output = context.createImageData(400,400);

	for (i=0; i<400; i+=1) {
		for (j=0; j<400; j+=1) {
			offset = (i*400+j)*4;
			
			rs = 0; gs = 0; bs =0;
			for (wi=0; wi<3; wi+=1) {
				for (wj=0; wj<3; wj+=1) {
					index = ((i+wi-1)*400+(j+wj-1))*4;
					if (index != undefined) {
						rs += pixels.data[index] * matrix[wi][wj];
						gs += pixels.data[index+1] * matrix[wi][wj];
						bs += pixels.data[index+2] * matrix[wi][wj];
					}
				}
			}

			output.data[offset] = rs;
			output.data[offset+1] = gs;
			output.data[offset+2] = bs;
			output.data[offset+3] = 255;

		}
	}
	return output
};
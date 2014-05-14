var canvas;
var context;
var video;
var interval;
var filter;
var savestream;
var save = 0;

function video_init() {
	filter = null;
	canvas = document.getElementById('videoCanvas');
	context = canvas.getContext('2d');

	if (hasGetUserMedia()) {
	 	navigator.getUserMedia  = navigator.getUserMedia ||
	                          navigator.webkitGetUserMedia ||
	                          navigator.mozGetUserMedia ||
	                          navigator.msGetUserMedia;

		var video = document.querySelector('video');

		var errorCallback = function(e) {
			console.log('Wont work', e);
		};


		var constraints = {
			video: {
				mandatory: {
					maxWidth: 400,
					maxHeight: 300
				}
			}
		};

		if (navigator.getUserMedia) {
			navigator.getUserMedia(constraints, function(stream) {
			video.src = window.URL.createObjectURL(stream);
			}, errorCallback);
		} else {
			alert("it wont work!"); // fallback.
		}
	} else {
		alert('getUserMedia() is not supported in your browser');
	};

	speed = 1;
	interval = setInterval(rec, speed);

	function rec() {
		context.drawImage(video, 0,0, 400, 300);
		if (filter)
			filter();
	}
}


function hasGetUserMedia() {
	return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia || navigator.msGetUserMedia);
}


function vreset() {
	filter = null;
}


function vdesaturate() {
	filter = function() {
		desaturate();
	}
}


function vthreshold() {
	filter = function() {
		threshold();
	}
}


function vsharpen() {
	filter = function() {
		sharpen();
	}
}


function vblur() {
	filter = function() {
		imblur();
	}
}


function vsobel() {
	filter = function() {
		sobel();
	}
}


function vlaplace() {
	filter = function() {
		laplace();
	}
}


function save_video() {
	save = 1;
	framenum = 1;
	imname = Math.random().toString(36).substring(7);
	savestream = setInterval(vid_save, 100);
};


function vid_save() {
	end = false
	if (save==0) {
		end = true;
		clearInterval(savestream);
		alert("Pleas Wait While the Video Saves")
	}
	
	imgurl = canvas.toDataURL('image/jpeg');
	$.ajax({
		type: "POST",
		url: "/save_video",
		data: { 
     		image: imgurl,
     		vid: imname,
     		frame: framenum,
     		last: end
		},
		async: true
	});
	
	framenum += 1;
};


function stop_save() {
	//$('#start_rec').disabled = false;
	//$('#stop_rec').disabled = true;
	save = 0;
};
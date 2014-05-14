var image;
var canvas;
var context;


function imageInit() {
	canvas = document.getElementById('imageCanvas');
	context = canvas.getContext('2d');
	image = document.getElementById('original');

	context.drawImage(image,0,0);
};


$(document).ready(function() {

	$('.image-thumb').hover(function() {
		$(this).children('.screen').show();
	}, function() {
		$(this).children('.screen').hide();
	});


	$('#filter-list').hover(function() {
		$('#filter-list ul').show();
	}, function() {
		$('#filter-list ul').hide();
	});

});

function reset() {
	context.drawImage(image, 0,0);
};


function imgsave() {
	imgurl = canvas.toDataURL('image/jpeg');
	id = $('#image').attr('image-id');

	$.ajax({
		type: "POST",
		url: "/save_image/" + id,
		data: { 
     		imgBase64: imgurl
		},
		async: false
	});
};
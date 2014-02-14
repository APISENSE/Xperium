$(function() {
	$( "#map-anchor" ).resizable({
		handles: 's' // only bottom resize
	});

	// Range slider
    $("#slider").dateRangeSlider({
    	arrows: false,
    	step: {
			days: 1
		},
		bounds:{
		    min: new Date(2013, 11, 1),
		    max: new Date()
		  },
		defaultValues: {
			min: new Date(2013, 11, 28),
			max: new Date()
		},
		range: {
    		min: {days: 1},
    	}

    });
});
$(function() {
	$( "#map-anchor" ).resizable({
		handles: 's' // only bottom resize
	});
});

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString()
       , mm = (this.getMonth()+1).toString() // getMonth() is zero-based
       , dd  = this.getDate().toString();
    
    return yyyy +"-"+ (mm[1]?mm:"0"+mm[0]) +"-"+ (dd[1]?dd:"0"+dd[0]);     
};
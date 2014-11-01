/* Global report viewer singleton */
var rwEngine = new (function(){
	"use strict;"
	
	var reports = [];
	
	/* Pre-fetch */
	var templates = {};
	$.get( "components/report-body.html", function(d){ templates.report=d } );
	
	/* Report class */
	var Report = function( type, div )
	{
		/* Connect report template to our div */
		var sel = $( div ).find( ".navbar-brand" );
		
		if( type == "demo" )
			sel.html( "Demo Report" );
		else if( type == "griffin" )
			sel.html( "Griffin Report" );
		else
			sel.html( type + " Report" );
	};
	
	this.addReport = function( type )
	{
		if( !reports.length )
		{
			var selector = $( "#rw-main-empty" );
			selector.css( "visibility", "hidden" );
			selector.css( "position", "absolute" );
		}
		
		var elmt = $( templates.report );
		var div = $( "#rw-main" ).append( elmt );
		
		var newReport = new Report( type, elmt );
		reports.push( newReport );
	};
});

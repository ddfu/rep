/* Global report viewer singleton */
var rwEngine = new (function(){
	"use strict;"
	
	var reports = [];
	
	/* Pre-fetch */
	var templates = {};
	$.get( "components/report-body.html", 		function(d){ templates.report=d  } );
	$.get( "components/report-pivoter.html", 	function(d){ templates.pivoter=d } );
	
	var reportDefns = {};
	$.get( "report-defns.txt", function(d){ reportDefns=JSON.parse(d) } );
	
	/* Report class */
	var Report = function( type, div )
	{
		/* Connect report template to our div */
		var sel = div.find( ".rw-report-name" );
		
		if( type == "demo" )
			sel.html( "Demo Report" );
		else if( type == "griffin" )
			sel.html( "Griffin Report" );
		else
			sel.html( type + " Report" );
			
		/* Provide access to div */
		this.div = div;
		
		/* Put the trailing report in its own row */
		this.resize = function()
		{
			var pos = -1;
			
			for( var i = 0; i < reports.length; ++i )
				if( reports[ i ] == this )
					pos = i;
					
			if( pos % 2 == 0 && pos == reports.length - 1 )
				div.attr( "class", "col-sm-12 col-md-12 col-lg-12" );
			else
				div.attr( "class", "col-sm-6 col-md-6 col-lg-6" );
		}
		
		/* Pivoter instance */
		var pivoter = new ReportPivoter();
		
		/* First-time draw of report (post-configuration) */
		var draw = function()
		{
			div.find( ".rw-report-progress" ).remove();
			div.find( ".rw-report-body" ).html( templates.pivoter );
			pivoter.installSlick( div.find( ".rw-report-slick" ) );
		};
		
		/* Download data for report */
		var data = {};
		var columns = [];
			
		var load = function()
		{
			div.find( ".rw-report-configure" ).remove();
			div.find( ".rw-report-progress" ).html( "<div>Loading data...</div><div class=\"progress\">\
			  <div class=\"progress-bar progress-bar-striped active\" role=\"progressbar\" style=\"width: 0%\">\
			  </div>\
			</div>" );
			
			var done = 0;
			var progress = div.find( ".progress-bar" ).first();
			
			/* Fetch data files for all columns and hardcoded report currently */
			columns = reportDefns[ type ].reports[ "default" ].columns;
			
			for( var col in columns )
			{
				$.get( col.data, function( d ){
					data[ col.name ] = d;
					done++;
					progress.css( "width", Math.floor( done / columns.length * 100 ) + "%" );
					if( done == columns.length )
						draw();
				} );
			}
			
			if( !columns.length )
				draw();
		};
		
		this.load = load;
		
		/* Recursive setup menu generation - although not recursive yet... */
		var menu = reportDefns[ type ].menu;
		var menuRootDiv = div.find( ".rw-report-configure" ).first();
		var menuState = []; // unused
		
		var drawMenuInner = function( div, menu, state )
		{
			div.append( $( "<h4>Configure</h4>" ) );
			
			for( var e = 0; e < menu.length; ++e )
			{
				switch( menu[e].type )
				{
				case "dropdown":
					div.append( $( "<span>" + menu[e].name + ": </span> " ) );
					var select = document.createElement( "select" );
					
					for( var k in menu[e].choices )
						$( select ).append( $( "<option>"+menu[e].choices[k]+"</option>" ) );
						
					div.append( select );
					div.append( $( "<br />" ) );
					break;
					
				case "check":
					div.append( $( "<input/>", { type: "checkbox", name: menu[e].name, checked: 1 } ) );
					div.append( $( "<span/>", { text: " " + menu[e].name } ) );
					div.append( $( "<br />" ) );
					break;
					
				case "text":
					div.append( $( "<input/>", { type: "text", value: "test" } ) );
					div.append( $( "<br />" ) );
					break;
					
				case "label":
					div.append( $( "<span/>", { text: menu[e].text } ) );
					div.append( $( "<br />" ) );
					break;
				}
			}
			
			div.append( $( "<br/>" ) );
			div.append( $( "<button/>", { type: "button", class: "btn btn-primary", text: "Generate",
										  click: load } ) );
		};
		
		this.drawMenu = function()
		{
			drawMenuInner( menuRootDiv, menu );	
		};
		
		this.drawMenu();
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
		
		for( var i = 0; i < reports.length; ++i )
			reports[ i ].resize();
	};
});

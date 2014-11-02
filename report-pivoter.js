/* Data read and pivoting */
ReportPivoter = function()
{
	this.gridCounter = 0;
	
	this.installSlick = function( where )
	{
		var data = [
			[ "ok", "yeah" ],
			[ "ok", "yeah" ],
			[ "ok", "yeah" ],
			[ "ok", "yeah" ],
		];
		
		var columns = [
			{id: "contact-card", name: "Contacts", width: 500, cssClass: "contact-card-cell"}
		];
		
		var options = {
			rowHeight: 140,
			editable: false,
			enableAddRow: false,
			enableCellNavigation: false,
			enableColumnReorder: false
		};
  
  		where.attr( "id", "rw-slick-id-" + this.gridCounter++ );
  		
  		$( where ).slickgrid(
  		{
			columns: columns,
			data: data,
			slickGridOptions: 
			{
				enableCellNavigation: true,
				enableColumnReorder: true,
				forceFitColumns: true,
				rowHeight: 35
			},
    	});
	}
}

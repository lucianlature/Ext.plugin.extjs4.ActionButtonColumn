Ext.ux.grid.column.ActionButtonColumn
=====================================

#### Render button(s) inside the grid cells.

A simple grid column plugin to render buttons inside a grid cell.

### Usage

	
	Ext.define('Your.grid',{
	    
	    extend: 'Ext.grid.Panel',
	    requires: ['Ext.ux.grid.column.ActionButtonColumn'],
	    alias : 'widget.yourgrid',
	
	    title : 'No title',
	    store: 'yourstore',
	    
	    viewConfig: {
	        blockRefresh: true,
	        stripeRows: true
	    },
	
	    columns: [
	        {header: 'Name',  dataIndex: 'name',  flex: 1},
	        {header: 'Firstname', dataIndex: 'firstname', flex: 1},
	        {
	            xtype:'actionbuttoncolumn', 
	            width: 200,
	            header: 'Actions',
	            items: [{
	                text: 'Confirm alarm',
	                handler: function(grid, rowIndex, colIndex) {
	                    var rec = grid.getStore().getAt(rowIndex);
	                    alert("Confirm " + rec.get('firstname'));
	                }
	            },{
	                text: 'Report error',
	                handler: function(grid, rowIndex, colIndex) {
	                    // console.info(grid);
						var rec = grid.getStore().getAt(rowIndex);
	                    alert("Report " + rec.get('firstname'));
	                }                
	            },{
	                text: 'Schedule Meeting',
	                eventName: 'scheduleMeeting'
	            }]
	        }
	    ]
	});



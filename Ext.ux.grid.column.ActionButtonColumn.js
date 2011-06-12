/**
 * @class Ext.ux.grid.column.ActionButtonColumn
 * @extends Ext.grid.column.Column
 * @version 0.2
 * @author Lucian Lature (lucian.lature@gmail.com)
 
 * <p>A Grid header type which renders a button, or a series of buttons in a grid cell, and offers a scoped click
 * handler for each button.</p>
 *
 * {@img Ext.ux.grid.column.ActionButtonColumn/Ext.ux.grid.column.ActionButtonColumn.png Ext.ux.grid.column.ActionButtonColumn grid column}
 *  
 * ## Code
 *     Ext.create('Ext.data.Store', {
 *         storeId:'employeeStore',
 *         fields:['firstname', 'lastname', 'senority', 'dep', 'hired'],
 *         data:[
 *             {firstname:"Michael", lastname:"Scott", hideEdit: true, iconFire: 'fire2'},
 *             {firstname:"Dwight", lastname:"Schrute"},
 *             {firstname:"Jim", lastname:"Halpert", hideFire: true, iconEdit: 'edit2'},
 *             {firstname:"Kevin", lastname:"Malone"},
 *             {firstname:"Angela", lastname:"Martin"}                        
 *         ]
 *     });
 *     
 *     Ext.create('Ext.grid.Panel', {
 *         title: 'Action Button Column Demo',
 *         store: Ext.data.StoreManager.lookup('employeeStore'),
 *         columns: [
 *             {text: 'First Name',  dataIndex:'firstname'},
 *             {text: 'Last Name',  dataIndex:'lastname'},
 *             {
 *                 xtype:'actionbuttoncolumn', 
 *                 width:200,
 *                 header: 'Actions',
 *                 items: [{
 *                     text: 'Edit',
 *                     iconIndex: 'iconFire',
 *                     handler: function(grid, rowIndex, colIndex) {
 *                         var rec = grid.getStore().getAt(rowIndex);
 *                         alert("Edit " + rec.get('firstname'));
 *                     }
 *                 },{
 *                     text: 'Fire',
 *                     hideIndex: 'hideEdit',
 *                     handler: function(grid, rowIndex, colIndex) {
 *                         var rec = grid.getStore().getAt(rowIndex);
 *                         alert("Fire " + rec.get('firstname'));
 *                     }                
 *                 }]
 *             }
 *         ],
 *         width: 450,
 *         renderTo: Ext.getBody()
 *     });
 * <p>The action button column can be at any index in the columns array, and a grid can have any number of
 * action columns. </p>
 * @xtype actionbuttoncolumn
 */
Ext.define('Ext.ux.grid.column.ActionButtonColumn', {
    
	extend: 'Ext.grid.column.Column',
    alias: ['widget.actionbuttoncolumn'],
    alternateClassName: 'Ext.grid.ActionButtonColumn',

    /**
     * @cfg {Function} handler A function called when the button is clicked.
     * The handler is passed the following parameters:<div class="mdetail-params"><ul>
     * <li><code>view</code> : TableView<div class="sub-desc">The owning TableView.</div></li>
     * <li><code>rowIndex</code> : Number<div class="sub-desc">The row index clicked on.</div></li>
     * <li><code>colIndex</code> : Number<div class="sub-desc">The column index clicked on.</div></li>
     * </ul></div>
     */
    
    /**
     * @cfg {Array} items An Array which may contain multiple button definitions, each element of which may contain:
     * <div class="mdetail-params"><ul>
     * <li><code>text</code> : String<div class="sub-desc">The button text to be used as innerHTML (html tags are accepted).</div></li>
     * <li><code>iconIndex</code> : String<div class="sub-desc">Optional, however either iconIndex or iconCls must be configured. Field name of the field of the grid store record that contains css class of the button to show. If configured, shown icons can vary depending of the value of this field.</div></li>
     * <li><code>hideIndex</code> : String<div class="sub-desc">Optional. Field name of the field of the grid store record that contains hide flag (falsie [null, '', 0, false, undefined] to show, anything else to hide).</div></li>
     * <li><code>handler</code> : Function<div class="sub-desc">A function called when the button is clicked.</div></li>
     * </ul></div>
     */
    header: '&#160;',
    
    sortable: false,

    constructor: function(config) {
        
        var me = this,
            cfg = Ext.apply({}, config),
            items = cfg.items || [me],
            l = items.length,
            i,
            item;

        // This is a Container. Delete the items config to be reinstated after construction.
        delete cfg.items;
        me.callParent([cfg]);

        // Items is an array property of ActionButtonColumns
        me.items = items;

		// Renderer closure iterates through items creating a button element for each and tagging with an identifying 
        me.renderer = function(v, meta, rec, rowIndex, colIndex, store, view) {
			
			//  Allow a configured renderer to create initial value (And set the other values in the "metadata" argument!)
            v = Ext.isFunction(cfg.renderer) ? cfg.renderer.apply(this, arguments)||'' : '';
            
            meta.tdCls += ' ' + Ext.baseCSSPrefix + 'action-col-cell';
            
            for (i = 0; i < l; i++) {
                
                item = items[i];
				
                var nid = Ext.id();
                var cls = Ext.baseCSSPrefix + 'action-col-button ' + Ext.baseCSSPrefix + 'action-col-button-' + String(i);
				var iconCls = item.iconIndex ? rec.data[item.iconIndex] : (item.iconCls ? item.iconCls : '');
				var fun = Ext.bind(item.handler, me, [view, rowIndex, colIndex]);
				var hide = rec.data[item.hideIndex];
                Ext.Function.defer(me.createGridButton, 100, me, [item.text, nid, rec, cls, fun, hide, iconCls]);
                
                v += '<div id="' + nid + '">&#160;</div>';
            }
            return v;
        };
    },
    
    createGridButton: function(value, id, record, cls, fn, hide, iconCls) {
        new Ext.Button({
            text: value,
            cls: cls,
            iconCls: iconCls,
			hidden: hide,
			handler: fn
        }).render(Ext.getBody(), id);
        Ext.get(id).remove();
    },

    destroy: function() {
        delete this.items;
        delete this.renderer;
        return this.callParent(arguments);
    },

    cascade: function(fn, scope) {
        fn.call(scope||this, this);
    },

    // Private override because this cannot function as a Container, and it has an items property which is an Array, NOT a MixedCollection.
    getRefItems: function() {
        return [];
    }
});
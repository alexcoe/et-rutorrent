plugin.loadLang();

if(plugin.enabled && plugin.canChangeOptions())
{
	plugin.loadMainCSS();
	plugin.addAndShowSettings = theWebUI.addAndShowSettings;
	theWebUI.addAndShowSettings = function( arg )
	{
	        if(plugin.enabled)
	        {
			$$('enable_label').checked = ( theWebUI.autotools.EnableLabel == 1 );
			$$('label_template').value = theWebUI.autotools.LabelTemplate;
			linked( $$('enable_label'), 0, ['label_template'] );
			$$('enable_move').checked  = ( theWebUI.autotools.EnableMove  == 1 );
			$$('path_to_finished').value = theWebUI.autotools.PathToFinished;
			linked( $$('enable_move'), 0, ['path_to_finished', 'automove_browse_btn'] );
			$$('enable_watch').checked  = ( theWebUI.autotools.EnableWatch  == 1 );
			$$('path_to_watch').value = theWebUI.autotools.PathToWatch;
			linked( $$('enable_watch'), 0, ['path_to_watch', 'autowatch_browse_btn', 'watch_start'] );
			$$('watch_start').checked  = ( theWebUI.autotools.WatchStart  == 1 );
			if(plugin.DirBrowser1)
				plugin.DirBrowser1.hide();
			if(plugin.DirBrowser2)
				plugin.DirBrowser2.hide();
		}
		plugin.addAndShowSettings.call(theWebUI,arg);
	}

	theWebUI.autotoolsWasChanged = function()
	{
		if( $$('enable_label').checked != ( theWebUI.autotools.EnableLabel == 1 ) )
			return true;
		if( $$('label_template').value != theWebUI.autotools.LabelTemplate )
			return true;
		if( $$('enable_move').checked  != ( theWebUI.autotools.EnableMove  == 1 ) )
			return true;
		if( $$('path_to_finished').value != theWebUI.autotools.PathToFinished )
			return true;
		if( $$('enable_watch').checked  != ( theWebUI.autotools.EnableWatch  == 1 ) )
			return true;
		if( $$('path_to_watch').value != theWebUI.autotools.PathToWatch )
			return true;
		if( $$('watch_start').checked != ( theWebUI.autotools.WatchStart == 1 ) )
			return true;
		return false;
	}

	plugin.setSettings = theWebUI.setSettings;
	theWebUI.setSettings = function()
	{
		plugin.setSettings.call(this);
		if( plugin.enabled && this.autotoolsWasChanged() )
			this.request( "?action=setautotools" );
	}

	rTorrentStub.prototype.setautotools = function()
	{
		this.content = "enable_label=" + ( $$('enable_label').checked ? '1' : '0' ) +
			"&label_template=" + $$('label_template').value +
			"&enable_move=" + ( $$('enable_move').checked  ? '1' : '0' ) +
			"&path_to_finished=" + $$('path_to_finished').value +
			"&enable_watch=" + ( $$('enable_watch').checked  ? '1' : '0' ) +
			"&path_to_watch=" + $$('path_to_watch').value +
			"&watch_start=" + ( $$('watch_start').checked  ? '1' : '0' );
		this.contentType = "application/x-www-form-urlencoded";
		this.mountPoint = "plugins/autotools/action.php";
		this.dataType = "script";
	}
}

plugin.onLangLoaded = function()
{
	if(this.enabled && this.canChangeOptions())
	{
		this.attachPageToOptions( $("<div>").attr("id","st_autotools").html(
		"<fieldset>"+
			"<legend>"+ theUILang.autotools +"</legend>"+
			"<table>"+
			"<tr>"+
				"<td>"+
					"<input type='checkbox' id='enable_label' checked='false' "+
					"onchange='linked(this, 0, [\"label_template\"]);' />"+
						"<label for='enable_label'>"+ theUILang.autotoolsEnableLabel +"</label>"+
				"</td>"+
				"<td class='alr'>"+
					"<input type='text' id='label_template' class='TextboxNormal' maxlength='100' />"+
				"</td>"+
			"</tr>"+
			"<tr />"+
			"<tr>"+
				"<td>"+
					"<input type='checkbox' id='enable_move' checked='false' "+
					"onchange='linked(this, 0, [\"path_to_finished\", \"automove_browse_btn\"]);' />"+
						"<label for='enable_move'>"+ theUILang.autotoolsEnableMove +"</label>"+
				"</td>"+
			"</tr>"+
			"<tr>"+
				"<td id='ctrls_level2'>"+
					"<label id='lbl_path_to_finished' for='path_to_finished' class='disabled' disabled='true'>"+
					theUILang.autotoolsPathToFinished +":</label>"+
				"</td>"+
			"</tr>"+
			"<tr>"+
				"<td class='alr'>"+
					"<input type='text' id='path_to_finished' class='TextboxLarge' maxlength='100' />"+
					"<input type='button' id='automove_browse_btn' class='Button' value='...' />"+
				"</td>"+
			"</tr>"+
			"<tr />"+
			"<tr>"+
				"<td>"+
					"<input type='checkbox' id='enable_watch' checked='false' "+
					"onchange='linked(this, 0, [\"path_to_watch\", \"autowatch_browse_btn\",\"watch_start\"]);' />"+
						"<label for='enable_watch'>"+ theUILang.autotoolsEnableWatch +"</label>"+
				"</td>"+
			"</tr>"+
			"<tr>"+
				"<td id='ctrls_level2'>"+
					"<label id='lbl_path_to_watch' for='path_to_watch' class='disabled' disabled='true'>"+
					theUILang.autotoolsPathToWatch +":</label>"+
				"</td>"+
			"</tr>"+
			"<tr>"+
				"<td class='alr'>"+
					"<input type='text' id='path_to_watch' class='TextboxLarge' maxlength='100' />"+
					"<input type='button' id='autowatch_browse_btn' class='Button' value='...' />"+
				"</td>"+
			"</tr>"+
			"<tr>"+
				"<td id='ctrls_level2'>"+
					"<input type='checkbox' id='watch_start' checked='false' disabled='true'/>"+
					"<label id='lbl_watch_start' for='watch_start' class='disabled'>"+ theUILang.autotoolsWatchStart +"</label>"+
				"</td>"+
			"</tr>"+
			"</table>"+
		"</fieldset>")[0], theUILang.autotools );
		if(thePlugins.isInstalled("_getdir"))
		{
			this.DirBrowser1 = new theWebUI.rDirBrowser( 'st_autotools', 'path_to_finished', 'automove_browse_btn', 'automove_browse_frame' );
			this.DirBrowser2 = new theWebUI.rDirBrowser( 'st_autotools', 'path_to_watch', 'autowatch_browse_btn', 'autowatch_browse_frame' );
		}
		else
		{
			$('#automove_browse_btn').remove();
			$('#autowatch_browse_btn').remove();
		}
	}
}

plugin.onRemove = function()
{
	this.removePageFromOptions( "st_autotools" );
}
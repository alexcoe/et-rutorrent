/*
 *      Misc objects.
 *
 *	$Id: common.js 1513 2010-11-13 14:48:47Z novik65 $
 */

function $$(id)
{
	return((typeof id == 'string') ? document.getElementById(id) : id);
}

function $type(obj)
{
	return( (obj == undefined) ? false : (obj.constructor == Array) ? "array" : typeof obj );
}

function browserDetect()
{
	var ua = navigator.userAgent.toLowerCase();
	this.isGecko = (ua.indexOf("gecko") !=- 1 && ua.indexOf("safari") ==- 1);
	this.isAppleWebKit = (ua.indexOf("applewebkit") !=- 1);
	this.isKonqueror = (ua.indexOf("konqueror") !=- 1);
	this.isSafari = (ua.indexOf("safari") !=- 1);
	this.isOpera = (ua.indexOf("opera") !=- 1);
	this.isIE = (ua.indexOf("msie") !=- 1 && !this.isOpera && (ua.indexOf("webtv") ==- 1));
	this.isMozilla = (this.isGecko && ua.indexOf("gecko/") + 14 == ua.length);
	this.isFirefox = (ua.indexOf("firefox/") !=- 1);
	this.isChrome = (ua.indexOf("chrome/") !=- 1);
	this.isMidori = (ua.indexOf("midori/") !=- 1);
	this.versionMinor = parseFloat(navigator.appVersion);
	if(this.isGecko && !this.isMozilla && !this.isKonqueror)
		this.versionMinor = parseFloat(ua.substring(ua.indexOf("/", ua.indexOf("gecko/") + 6) + 1));
	else
	if(this.isMozilla)
		this.versionMinor = parseFloat(ua.substring(ua.indexOf("rv:") + 3));
	else
	if(this.isIE && this.versionMinor >= 4)
		this.versionMinor = parseFloat(ua.substring(ua.indexOf("msie ") + 5));
	else
	if(this.isKonqueror)
		this.versionMinor = parseFloat(ua.substring(ua.indexOf("konqueror/") + 10));
	else
	if(this.isSafari)
		this.versionMinor = parseFloat(ua.substring(ua.lastIndexOf("safari/") + 7));
	else
	if(this.isOpera)
		this.versionMinor = parseFloat(ua.substring(ua.indexOf("opera") + 6));
	if(this.isIE && document.documentMode)
		this.versionMajor = document.documentMode;
	else
		this.versionMajor = parseInt(this.versionMinor);

	this.mode = document.compatMode ? document.compatMode : "BackCompat";
	this.isIE7x = (this.isIE && this.versionMajor == 7);
	this.isIE7up = (this.isIE && this.versionMajor >= 7);
	this.isIE8up = (this.isIE && this.versionMajor >= 8);
	this.isFirefox3x = (this.isFirefox && this.versionMajor == 3);

	var h = document.getElementsByTagName("html")[0];
	var c = h.className;
	if(this.isIE)
		h.className = "ie" + " ie" + this.versionMajor + " " + c;
	else
	if(this.isOpera)
		h.className = ("opera " + c);
	else
	if(this.isKonqueror)
		h.className = ("konqueror " + c);
	else
	if(this.isChrome)
		h.className = ("webkit chrome " + c);
	else
	if(this.isAppleWebKit)
		h.className = ("webkit safari " + c);
	else
	if(this.isGecko)
		h.className = ("gecko " + c);
}
var browser = new browserDetect();

$(document).ready(function() 
{
	var i = document.createElement('p');
	i.style.width = '100%';
        i.style.height = '200px';
        var o = document.createElement('div');
	o.style.position = 'absolute';
	o.style.top = '0px';
	o.style.left = '0px';
	o.style.visibility = 'hidden';
	o.style.width = '200px';
	o.style.height = '150px';
	o.style.overflow = 'hidden';
	o.appendChild(i);
	document.body.appendChild(o);
	var w1 = i.offsetWidth;
	var h1 = i.offsetHeight;
	o.style.overflow = 'scroll';
	var w2 = i.offsetWidth;
	var h2 = i.offsetHeight;
	if (w1 == w2) w2 = o.clientWidth;
	if (h1 == h2) h2 = o.clientWidth;
	document.body.removeChild(o);
	window.scrollbarWidth = w1-w2;
	window.scrollbarHeight = h1-h2;
});

if(browser.isKonqueror)
{
	$.fn.inheritedval = $.fn.val;
	$.fn.val = function( value )
	{
		if( this.length && $.nodeName( this[0], "textarea" ) && (value !== undefined))
		{
			var tarea = this[0];
			if(tarea.lastChild)
				tarea.removeChild(tarea.lastChild);
			tarea.appendChild(document.createTextNode(value)); 
			return(this);
		}
		else
			return($.fn.inheritedval.call(this,value));
	};
	$.fn.show = function(speed,callback)
	{
		return(this.each(function()
		{
			this.style.display = "block";
		}));
	};
	$.fn.hide = function(speed,callback)
	{
		return(this.each(function()
		{
			this.style.display = "none";
		}).end());
	};
}

$.event.inheritedfix = $.event.fix;
$.event.fix = function(e)
{
	e = $.event.inheritedfix(e);
	e.fromTextCtrl = (e.target && e.target.tagName && (/^input|textarea|a$/i).test(e.target.tagName));
	return(e);
}
$.fn.extend({
	mouseclick: function( handler )
	{
		var aSpecialCase = (browser.isOpera && !("oncontextmenu"in document.createElement("foo")));
	        return( this.each( function()
	        {
	        	if($type(handler)=="function")
	        	{
				if(aSpecialCase)
				{
			        	$(this).mousedown(function(e)
					{
						if(e.button==2)
						{
							if(e.target)
							{
								var c = $(this).data("btn");
								if(c)
									c.remove();
								c = $("<input type=button>").css(
								{
									"z-index": 10000, position: "absolute",
									top: (e.clientY - 2), left: (e.clientX - 2),
									width: 5, height: 5,
									opacity: 0.01
								});
								$(document.body).append(c);
								$(this).data("btn",c);
							}
						}
						return(handler.apply(this,arguments));
					});
					$(this).mouseup(function(e)
					{
						var c = $(this).data("btn");
						if(c)
						{
							c.remove();
							$(this).data("btn",null);
							if((e.button==2) &&! (/^input|textarea|a$/i).test(e.target.tagName))
								return(false);
						}
					});
				}
				else
					$(this).mousedown( handler );
			}
			else
			{
				$(this).unbind( "mousedown" );
				if(aSpecialCase)
					$(this).unbind( "mouseup" );
			}
		}));            	
	}
});

function addslashes(str)
{
	return (str+'').replace(/([\\"'])/g, "\\$1").replace(/\u0000/g, "\\0");
}

function iv(val) 
{
	var v = (val==null) ? 0 : parseInt(val + "");
	return(isNaN(v) ? 0 : v);
}

function ir(val) 
{
	var v = (val==null) ? 0 : parseFloat(val + "");
	return(isNaN(v) ? 0 : v);
}

function linked(obj, _33, lst) 
{
	var tn = obj.tagName.toLowerCase();
	if((tn == "input") && (obj.type == "checkbox")) 
		var d = _33 ? obj.checked : !obj.checked;
	else 
		if(tn == "select") 
		{
			var v = obj.options[obj.selectedIndex].value;
			var d = (v == _33) ? true : false;
		}
	for(var i = 0; i < lst.length; i++) 
	{
		var o = $$(lst[i]);
		if(o) 
		{
			o.disabled = d;
			o = $$("lbl_" + lst[i]);
			if(o) 
				o.className = (d) ? "disabled" : "";
		}
   	}
}

function escapeHTML(str)
{
	return( $("<div>").text(str).html() );
}

function askYesNo( title, content, funcYesName )
{
	$("#yesnoDlg-header").html(title);
	$("#yesnoDlg-content").html(content);
	$("#yesnoOK").unbind('click');
	$("#yesnoOK").click( function() { eval(funcYesName); theDialogManager.hide("yesnoDlg"); return(false); });
	theDialogManager.show("yesnoDlg");
}

function cloneObject( srcObj )
{
	if( srcObj == null ) return(srcObj);
	var newObject;
	switch( typeof(srcObj) )
	{
		case "object":
		{
			newObject = new srcObj.constructor();
			for( var property in srcObj )
				if( srcObj.hasOwnProperty(property) || typeof( srcObj[property] ) === 'object' )
					newObject[property]= cloneObject( srcObj[property] );
			break;
       		}
		default:
		{
			newObject = srcObj;
			break;
		}
	}
	return newObject;
}

function propsCount(obj)
{
	var count = "__count__";
	var hasOwnProp = Object.prototype.hasOwnProperty;
	if(typeof obj[count] === "number" && !hasOwnProp.call(obj, count))
		return obj[count];
	count = 0;
	for (var prop in obj)
		if(hasOwnProp.call(obj, prop))
			++count;
	return(count);
}

var theURLs =
{
	XMLRPCMountPoint 	: "/RPC2",
	AddTorrentURL 		: "php/addtorrent.php",
	SetSettingsURL		: "php/setsettings.php",
	GetSettingsURL		: "php/getsettings.php",
	GetPluginsURL		: "php/getplugins.php",
	GetDonePluginsURL	: "php/doneplugins.php",
	RIPEURL			: "http://www.db.ripe.net/whois?alt_database=ALL&form_type=advanced&searchtext="
};

var theOptionsSwitcher =
{
	current: "st_gl",

	run: function(id)
	{
	        $('#'+theOptionsSwitcher.current).hide();
		$("#mnu_" + theOptionsSwitcher.current).toggleClass("focus");
		theOptionsSwitcher.current = id;
	        $('#'+theOptionsSwitcher.current).show();
		$("#mnu_" + theOptionsSwitcher.current).toggleClass("focus");
	}
};

var theConverter = 
{
	round: function(num, p)
	{
		var v = Math.floor(num * Math.pow(10, p)) / Math.pow(10, p);
		var s = v + "";
		var d = s.indexOf(".");
		var n = 0;
		if(d >- 1)
		{
			var ind = s.length - d;
			p++;
			if(ind < p)
				n = p - ind;
		}
		else
		{
			if(p > 0)
			{
				n = p;
				s = s + ".";
			}
		}
		for(var i = 0; i < n; i++)
			s += "0";
		return(s);
	},
	time: function(tm,noRound)
	{
		if((noRound==null) && (tm >= 2419200))
			return "\u221e";
		var val = tm % (604800 * 52);
		var w = iv(val / 604800);
		val = val % 604800;
		var d = iv(val / 86400);
		val = val % 86400;
		var h = iv(val / 3600);
		val = val % 3600;
		var m = iv(val / 60);
		val = iv(val % 60);
		var v = 0;
		var ret = "";
		if(w > 0)
		{	
			ret = w + theUILang.time_w;
			v++;
		}
		if(d > 0)
		{
			ret += d + theUILang.time_d;
			v++;
		}
		if((h > 0) && (v < 2))
		{
			ret += h + theUILang.time_h;
	      		v++;
		}
		if((m > 0) && (v < 2))
		{	
			ret += m + theUILang.time_m;
			v++;
		}
		if(v < 2)
			ret += val + theUILang.time_s;
		return( ret.substring(0,ret.length-1) );
	},
	bytes: function(bt, p)
	{
		p = (p == null) ? 1 : p;
		var a = new Array(theUILang.bytes, theUILang.KB, theUILang.MB, theUILang.GB, theUILang.TB, theUILang.PB);
		var ndx = 0;
		if(bt == 0)
			ndx = 1;
		else
		{
			if(bt < 1024)
			{
				bt /= 1024;
				ndx = 1;
			}
			else
			{
				while(bt >= 1024)
				{
        	    			bt /= 1024;
            				ndx++;
            			}
	         	}
		}
		return(this.round(bt, p) + " " + a[ndx]);
	},
	speed: function(bt)
	{
		return((bt>0) ? this.bytes(bt)+ "/" + theUILang.s : "");
	},
	date: function(dt,timeOnly)
	{
	        if(dt>3600*24*365)
	        {
			var today = new Date();
			today.setTime(dt*1000);
			var month = today.getMonth()+1;
			month = (month < 10) ? ("0" + month) : month;
			var day = today.getDate();
			day = (day < 10) ? ("0" + day) : day;
			var h = today.getHours();
			var m = today.getMinutes();
			var s = today.getSeconds();
			h = (h < 10) ? ("0" + h) : h;
			m = (m < 10) ? ("0" + m) : m;
			s = (s < 10) ? ("0" + s) : s;
			return(timeOnly ? h+":"+m+":"+s : day+"."+month+"."+today.getFullYear()+" "+h+":"+m+":"+s);
		}
		return('');
	}
};

var theFormatter = 
{
	torrents: function(table,arr)
	{
		for(var i in arr)
		{
			if(arr[i]==null)
				arr[i] = '';
			else
   			switch(iv(i))
			{
				case 3: 
					arr[i] = (arr[i] / 10) + "%";
					break;
				case 2:
				case 4: 
				case 5: 
				case 15: 
					arr[i] = theConverter.bytes(arr[i], 2);
					break;
				case 6: 
					arr[i] = (arr[i] ==- 1) ? "\u221e" : theConverter.round(arr[i] / 1000, 3);
					break;
				case 7: 
				case 8: 
					arr[i] = theConverter.speed(arr[i]);
					break;
				case 9: 
					arr[i] = (arr[i] <=- 1) ? "\u221e" : theConverter.time(arr[i]);
					break;
				case 13: 
					arr[i] = theFormatter.tPriority(arr[i]);
					break;
				case 14: 
					arr[i] = theConverter.date(iv(arr[i])+theWebUI.deltaTime/1000);
					break;
			}
		}
		return(arr);
	},
	tPriority: function(no) 
	{
		var ret = "";
		switch(iv(no))
		{
			case 0:
				ret = theUILang.Dont_download;
				break;
			case 1: 
				ret = theUILang.Low_priority;
				break;
			case 2:
				ret = theUILang.Normal_priority;
				break;
			case 3:
				ret = theUILang.High_priority;
				break;
		}
		return(ret);
	},
	fPriority: function(no)
	{
		var ret = "";
		switch(iv(no))
		{
			case -1:
				ret = "?";
				break;
			case 0:
				ret = theUILang.Dont_download;
				break;
			case 1:
				ret = theUILang.Normal_priority;
				break;
			case 2:
				ret = theUILang.High_priority;
				break;
		}
		return(ret);
	},
	yesNo: function(no)
	{
		var ret = "";
		switch(iv(no))
		{
			case 0:
				ret = "no";
				break;
			case 1:
				ret = "yes";
				break;
		}
		return(ret);
	},
	trackerType: function(no)
	{
		var ret = "";
		switch(iv(no))
		{
			case 1:
				ret = "http";
				break;
			case 2:
				ret = "udp";
				break;
			case 3:
				ret = "dht";
				break;
		}
		return(ret);
	},
	pluginStatus: function(no)
	{
		var ret = "";
		switch(iv(no))
		{
			case 0:
				ret = theUILang.plgDisabled;
				break;
			case 1:
				ret = theUILang.plgLoaded;
				break;
		}
		return(ret);
	},
	peers: function(table,arr)
	{
		for(var i in arr)
		{
			if(arr[i]==null)
				arr[i] = '';
			else
   			switch(table.getIdByCol(i)) 
   			{
      				case 'done' : 
      					arr[i] = arr[i]+"%";
	      				break;
				case 'downloaded' :
				case 'uploaded' :
      					arr[i] = theConverter.bytes(arr[i]);
      					break;
	      			case 'dl' : 
      				case 'ul' : 
					arr[i] = theConverter.speed(arr[i]);
      					break;
	      		}
	   	}
		return(arr);
	},
	trackers: function(table,arr)
	{
		for(var i in arr)
		{
			if(arr[i]==null)
				arr[i] = '';
			else
		        switch(table.getIdByCol(i))
   			{
      				case 'type' : 
      					arr[i] = theFormatter.trackerType(arr[i]);
	      				break;
      				case 'enabled' : 
      					arr[i] = theFormatter.yesNo(arr[i]);
      					break;
	      		}
		}
		return(arr);
	},
	plugins: function(table,arr)
	{
		for(var i in arr)
		{
			if(arr[i]==null)
				arr[i] = '';
			else
		        switch(table.getIdByCol(i))
   			{
      				case 'status' : 
      					arr[i] = theFormatter.pluginStatus(arr[i]);
	      				break;
      				case 'version' : 
      					arr[i] = new Number(arr[i]).toFixed(2);
	      				break;
	      		}
		}
		return(arr);
	},
	files: function(table,arr)
	{
		for(var i in arr)
		{
			if(arr[i]==null)
				arr[i] = '';
			else
   			switch(table.getIdByCol(i))
   			{
      				case 'size' : 
      				case 'done' : 
      					arr[i] = theConverter.bytes(arr[i], 2);
      					break;
	      			case 'percent' : 
      					arr[i] = arr[i] + "%";
      					break;
	      			case 'priority' : 
      					arr[i] = theFormatter.fPriority(arr[i]);
      					break;
	      		}
	   	}
		return(arr);
	}
};
                    
var theSearchEngines = 
{
	sites:
	[
		{ name: 'Mininova', 		url: 'http://www.mininova.org/search/?utorrent&search=' },
		{ name: 'HQTtracker.ru', 	url: 'http://hqtracker.ru/browse.php?cat=0&search_in=1&search=' },
		{ name: 'The Pirate Bay', 	url: 'http://thepiratebay.org/search.php?q=' },
		{ name: 'INTERFILM', 		url: 'http://interfilm.nu/movie/?do=search&str=' },
		{ name: 'IsoHunt', 		url: 'http://isohunt.com/torrents.php?ext=&op=and&ihq=' },
		{ name: 'VideoTracker.ru', 	url: 'http://videotracker.ru/browse.php?cat=0&search_in=1&search=' },
		{ name: '', 			url: '' },
		{ name: 'Google', 		url: 'http://google.com/search?q=' }
	],
	current: 0,

	run: function()
	{
	        if(theSearchEngines.current>=0)
			window.open(theSearchEngines.sites[theSearchEngines.current].url + $("#query").val(), "_blank");
		else
			theWebUI.setTeg($("#query").val());
	},
	set: function( no, noSave )
	{
		theSearchEngines.current = no;
		if(!noSave)
			theWebUI.save();
	},
	show: function()
	{
		theContextMenu.clear();
		$.each(this.sites,function(ndx,val)
		{
			if(val.name=="")
				theContextMenu.add([CMENU_SEP]);
			else
			if(theSearchEngines.current==ndx)
				theContextMenu.add([CMENU_SEL, val.name, "theSearchEngines.set("+ndx+")"]);
			else
				theContextMenu.add([val.name, "theSearchEngines.set("+ndx+")"]);
		});
		theContextMenu.add([CMENU_SEP]);
		if(theSearchEngines.current==-1)
			theContextMenu.add([CMENU_SEL, theUILang.innerSearch, "theSearchEngines.set(-1)"]);
		else
			theContextMenu.add([theUILang.innerSearch, "theSearchEngines.set(-1)"]);
		var offs = $("#search").offset();
		theContextMenu.show(offs.left-5,offs.top+5+$("#search").height());
        }
};

var Timer = function()
{
	this.initial = 0;
	this.interval = 0;
};

Timer.prototype.start = function()
{
	this.initial = (new Date()).getTime();
};

Timer.prototype.stop = function()
{
	this.interval = (new Date()).getTime() - this.initial;
};

var theTabs = 
{
	tabs: 
	{
   		gcont : theUILang.General, 
   		FileList : theUILang.Files, 
   		TrackerList : theUILang.Trackers, 
   		PeerList : theUILang.Peers,
   		Speed : theUILang.Speed,
   		PluginList : theUILang.Plugins,
   		lcont : theUILang.Logger
   	}, 

   	init: function() 
   	{
		if(browser.isKonqueror && (browser.versionMajor<4))
		{
			delete this.tabs["Speed"];
			$("#Speed").remove();
		}
   		var s = "";
   		for(var n in this.tabs) 
      			s += "<li id=\"tab_" + n + "\"><a href=\"javascript://void();\" onmousedown=\"theTabs.show('" + n + "'); return(false);\" onfocus=\"this.blur();\">" + this.tabs[n] + "</a></li>";
		$("#tabbar").html(s);
		$("#tab_lcont").append( $("<input type='button'>").attr("id","clear_log").addClass('Button').val(theUILang.ClearButton).hide().click( function()
		{
			$("#lcont").empty();
		}).focus( function()
		{
			this.blur();
		}));
   		this.show("gcont");
   	}, 
	onShow : function(id)
	{
	},
   	show : function(id) 
	{
   		var p = null, l = null;
   		for(var n in this.tabs) 
   		{
      			if((l = $("#tab_" + n)).length && (p = $('#'+n)).length) 
      			{
         			if(n == id) 
         			{
            				p.show();
            				var prefix = null;
            				switch(n)
            				{
            					case "FileList":
							prefix = "fls";
							break;
               					case "TrackerList":
							prefix = "trk";
							break;
               					case "PeerList":
               						theWebUI.setActiveView(id);
							theWebUI.updatePeers();
							prefix = "prs";
							break;
						case "PluginList":
							prefix = "plg";
							break;
               					case "Speed":
               						theWebUI.setActiveView(id);
               						theWebUI.speedGraph.resize(); 
               						break;
						default:
							this.onShow(n);
               				}
               				if(prefix)
               				        theWebUI.getTable(prefix).refreshRows();
               				theWebUI.setActiveView(id);
            				l.addClass("selected").css("z-index",1);
	            			if(n=="lcont")
		            			$("#clear_log").show();
            			}
         			else 
         			{
            				p.hide();
            				l.removeClass("selected").css("z-index",0);
	            			if(n=="lcont")
		            			$("#clear_log").hide();
            			}
         		}
      		}
   	}
};

function log(text,noTime,divClass) 
{
	var tm = '';
	if(!noTime)
		tm = "[" + theConverter.date(new Date().getTime()/1000) + "]";
	if(!divClass)
		divClass = 'std';
	var obj = $("#lcont");
	if(obj.length)
	{
		obj.append( $("<div>").addClass(divClass).text(tm + " " + text).show() );
		obj[0].scrollTop = obj[0].scrollHeight;
		theTabs.show("lcont");
	}
}

function logHTML(text,divClass) 
{
	var obj = $("#lcont");
	if(!divClass)
		divClass = 'std';
	if(obj.length)
	{
		obj.append( $("<div>").addClass(divClass).html(text).show() );
		obj[0].scrollTop = obj[0].scrollHeight;
		theTabs.show("lcont");
	}
}

function rDirectory()
{
	this.dirs = new Array();
	this.dirs[""] = new Array();
	this.current = "";
}

rDirectory.prototype.addFile = function(aData,no)
{
	var name = aData.name;
	var fileAdded = false;
	while(name.length)
	{
		var file = splitName(name);
		if(!this.dirs[file.path])
		{
			this.dirs[file.path] = {};
			var up = splitName(file.path).path;
			this.dirs[file.path]["_d_"+up] = { data: { name: "..", size: null, done: null, percent: null, priority: -2 }, icon: "Icon_Dir", link: up };
		}
		if(!fileAdded)
		{
			var sId = "_f_"+no;
			var data = cloneObject( aData );
			data.name = file.name;
		        if(this.dirs[file.path][sId])
				this.dirs[file.path][sId].data = data;
			else
				this.dirs[file.path][sId] = { "data": data, icon: "Icon_File", link: null };
			fileAdded = true;
		}
		else
		{
			var sId = "_d_"+name;
			if(!this.dirs[file.path][sId])
				this.dirs[file.path][sId] = { data: { name: file.name, size: 0, done: 0, percent: 0.0, priority: -1 }, icon: "Icon_Dir", link: name };
		}
		name = file.path;
	} 

	function splitName(name)
	{
		var ret = { "path": "", "name": name };
		var loc = name.lastIndexOf('/');
		if(loc>=0)
		{
			ret.path = name.substr(0,loc);
			ret.name = name.substr(loc+1);
		}
		return(ret);
	}
}

rDirectory.prototype.updateDirs = function(name)
{
	var dir = this.dirs[name];
	var allStat = { size: 0, done: 0, priority: -2 };
	var stat;
	for(var i in dir) 
	{
		if(dir[i].data.name!="..")
		{
			if(dir[i].link!=null)
			{
				stat = this.updateDirs(dir[i].link)
				dir[i].data.size = stat.size;
				dir[i].data.done = stat.done;
				dir[i].data.percent = ((dir[i].data.size > 0) ? theConverter.round((dir[i].data.done/dir[i].data.size)*100,1): "100.0");
				dir[i].data.priority = stat.priority;
			}
			else
				stat = dir[i].data;
			allStat.size+=stat.size;
			allStat.done+=stat.done;
			if(allStat.priority==-2)
				allStat.priority = stat.priority;
			else
				if(allStat.priority!=stat.priority) 
					allStat.priority = -1;
		}
	}
	return(allStat);
}

rDirectory.prototype.getEntryPriority = function(k)
{
	var entry = this.dirs[this.current][k];
	return((entry.data.name=="..") ? null : entry.data.priority);
}

rDirectory.prototype.isDirectory = function(k)
{
	var entry = this.dirs[this.current][k];
	return(entry.link!=null);
}

rDirectory.prototype.getFilesIds = function(arr,current,k,prt)
{
	var entry = this.dirs[current][k];
	if(entry.data.name!="..")
	{
		if(entry.link!=null)
		{
	        	for(var i in this.dirs[entry.link])
				this.getFilesIds(arr,entry.link,i,prt);
		}
		else
			if(entry.data.priority!=prt)
				arr.push(k.substr(3));
	}
}

rDirectory.prototype.getDirectory = function()
{
	this.updateDirs(this.current);
	return(this.dirs[this.current]);
}

rDirectory.prototype.setDirectory = function(name)
{
	this.current = name;
}

var theBTClientVersion = 
{
	azLikeClients4:   
	{
		"AR" : "Ares", "AT" : "Artemis", "AV" : "Avicora",
		"BG" : "BTGetit", "BM" : "BitMagnet", "BP" : "BitTorrent Pro (Azureus + Spyware)",
		"BX" : "BittorrentX", "bk" : "BitKitten (libtorrent)", "BS" : "BTSlave",
		"BW" : "BitWombat", "BX" : "BittorrentX", "EB" : "EBit",
		"DE" : "Deluge", "DP" : "Propogate Data Client", "FC" : "FileCroc",
		"FT" : "FoxTorrent/RedSwoosh", "GR" : "GetRight", "HN" : "Hydranode",
		"LC" : "LeechCraft", "LH" : "LH-ABC", "NX" : "Net Transport",
		"MO" : "MonoTorrent", "MR" : "Miro", "MT" : "Moonlight",
		"OT" : "OmegaTorrent", "PD" : "Pando", "QD" : "QQDownload",
		"RS" : "Rufus", "RT" : "Retriever", "RZ" : "RezTorrent",
		"SD" : "Xunlei", "SS" : "SwarmScope", "SZ" : "Shareaza",
		"S~" : "Shareaza beta", "st" : "SharkTorrent", "TN" : "Torrent .NET",
		"TS" : "TorrentStorm", "UL" : "uLeecher!", "VG" : "Vagaa",
		"WY" : "Wyzo", "XL" : "Xunlei",
		"XT" : "XanTorrent", "ZT" : "Zip Torrent", 
		'GS' : "GSTorrent", 'KG' : "KGet", 'ST' : "SymTorrent", 
		'BE' : "BitTorrent SDK"
	 },
	azLikeClients3:
	{
	        "AG" : "Ares", "A~" : "Ares", "ES" : "Electric Sheep",
        	"HL" : "Halite", "LT" : "libtorrent (Rasterbar)", "lt" : "libTorrent (Rakshasa)",
	        "MP" : "MooPolice", "TT" : "TuoTu", "qB" : "qBittorrent"
	},
	azLikeClients2x2:
	{
	        "AX" : "BitPump", "BC" : "BitComet", "CD" : "Enhanced CTorrent"
	},
	azLikeClientsSpec:
	{
		'UM' : "uTorrent for Mac", 'UT' : "uTorrent", 'TR' : "Transmission",
		'AZ' : "Azureus", 'KT' : "KTorrent", "BF" : "BitFlu",
	        'LW' : "LimeWire", "BB" : "BitBuddy", "BR" : "BitRocket",
		"CT" : "CTorrent", 'XX' : "Xtorrent", 'LP' : "Lphant"
	},
	shLikeClients:
	{
		'O' : "Osprey ", 'Q' : "BTQueue", 
        	'A' : "ABC", 'R' : "Tribler", 'S' : "Shad0w",
	        'T': "BitTornado", 'U': "UPnP NAT Bit Torrent"
	},
	get: function( origStr )
	{

		function shChar( ch )
		{
			var codes = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-";
			var loc = codes.indexOf(ch);
			if(loc<0) loc = 0;
			return(String(loc));
		}

		function getMnemonicEnd( ch )
		{
			switch( ch )
		    	{
       				case 'b': case 'B': return " (Beta)";
				case 'd': return " (Debug)";
				case 'x': case 'X': case 'Z': return " (Dev)";
			}
			return("");
		}

		var ret = null;
		var str = unescape(origStr);
		if(str.match(/^-[A-Z~][A-Z~][A-Z0-9][A-Z0-9]..-/i))
		{
	        	var sign = str.substr(1,2);
			var cli = this.azLikeClientsSpec[sign];
			if(cli)
			{
			        switch(sign)
			        {
					case 'BF':
					case 'LW':
						ret = cli;
						break;
					case 'UT':
					case 'UM':
						ret = cli+" "+str.charAt(3)+"."+str.charAt(4)+"."+str.charAt(5)+getMnemonicEnd(str.charAt(6));
						break;
					case 'TR':
						if(str.substr(3,2)=='00')
						{
							if(str.charAt(5)=='0')
								ret = cli+" 0."+str.charAt(6);
							else
								ret = cli+" 0."+parseInt(str.substr(5,2),10);
						}
						else
						{
							var type = str.substr(6,1);
							ret = cli+" "+parseInt(str.substr(3,1),10)+"."+parseInt(str.substr(4,2),10)+(((type=='Z') || (type=='X')) ? '+' : '');
						}
						break;
					case 'KT':
						var ch = str.charAt(5);
               			                if( ch == 'D' )
							ret = cli+" "+shChar(str.charAt(3))+"."+shChar(str.charAt(4))+" Dev "+shChar(str.charAt(6));
				        	else
					        if( ch == 'R' )
						        ret = cli+" "+shChar(str.charAt(3))+"."+shChar(str.charAt(4))+" RC "+shChar(str.charAt(6));
						else
						ret = cli+" "+shChar(str.charAt(3))+"."+shChar(str.charAt(4))+"."+shChar(str.charAt(5));
						break;
					case 'AZ':
						if(str.charAt(3) > '3' || ( str.charAt(3) == '3' && str.charAt(4) >= '1' ))
							cli = "Vuze";
						ret = cli+" "+shChar(str.charAt(3))+"."+shChar(str.charAt(4))+"."+shChar(str.charAt(5))+"."+shChar(str.charAt(6));
						break;
					case 'BB':
						ret = cli+" "+str.charAt(3)+"."+str.charAt(4)+str.charAt(5)+str.charAt(6);
						break;
					case 'BR':
						ret = cli+" "+str.charAt(3)+"."+str.charAt(4)+" ("+str.charAt(5)+str.charAt(6)+")";
						break;
					case 'CT':
						ret = cli+" "+shChar(str.charAt(3))+"."+shChar(str.charAt(4))+"."+parseInt(str.substr(5,2),10);
						break;
					case 'XX':
						ret = cli+" "+shChar(str.charAt(3))+"."+shChar(str.charAt(4))+" ("+parseInt(str.substr(5,2),10)+")";
						break;
					case 'LP':
                                                ret = cli+" "+parseInt(str.substr(3,1),10)+"."+parseInt(str.substr(5,2),10);
						break;
					default:
						var ch = str.charAt(6);
						ret = cli+" "+str.charAt(3)+"."+parseInt(str.substr(4,2),10);
						if((ch=='Z') || (ch=='X')) 
							ret+='+';
						break;
				}
			}
			else
			{
				cli = this.azLikeClients4[sign];
				if(cli)
					ret = cli+" "+shChar(str.charAt(3))+"."+shChar(str.charAt(4))+"."+shChar(str.charAt(5))+"."+shChar(str.charAt(6));
				else
				{
					cli = this.azLikeClients3[sign];
					if(cli)
						ret = cli+" "+shChar(str.charAt(3))+"."+shChar(str.charAt(4))+"."+shChar(str.charAt(5));
					else
					{
						cli = this.azLikeClients2x2[sign];
						if(cli)
							ret = cli+" "+parseInt(str.substr(3,2),10)+"."+parseInt(str.substr(5,2),10);
					}
				}
			}
		}
		if(!ret)
		{
			if(str.match(/^[MQ]\d-\d[\-\d][\-\d][\-\d]-/))
			{
				ret = (str.charAt(0)=='Q') ? "Queen Bee " : "BitTorrent ";
				if(str.charAt(4) == '-')
					ret += (str.charAt(1)+"."+str.charAt(3)+"."+str.charAt(5));
				else
					ret += (str.charAt(1)+"."+str.charAt(3)+str.charAt(4)+"."+str.charAt(6));
			}
		        else
			if(str.match(/^-BOW/))
			{
				if( str.substr(4,4)=="A0B" ) 
	    				ret = "Bits on Wheels 1.0.5";
				else
				if( str.substr(4,4)=="A0C" ) 
		    			ret = "Bits on Wheels 1.0.6";
				else
					ret = "Bits on Wheels "+str.charAt(4)+"."+str.charAt(5)+"."+str.charAt(6);
			}
			else
			if(str.match(/^AZ2500BT/))
				ret = "BitTyrant (Azureus Mod)";
			else
			if(str.match(/^-FG\d\d\d\d/))
				ret = "FlashGet "+parseInt(str.substr(3,2),10)+"."+parseInt(str.substr(5,2),10);
			else
			if(str.match(/^-SP\d\d\d/))
				ret = "BitSpirit "+str.charAt(3)+"."+str.charAt(4)+"."+str.charAt(5);
			else
			if(str.match(/^346-/))
				ret = "TorrenTopia";
			else
			if(str.match(/^-G3/))
				ret = "G3 Torrent";
			else
			if(str.match(/^LIME/))
				ret = "Limewire";
			else
			if(str.match(/^martini/))
				ret = "Martini Man";
			else
			if(str.match(/^Pando/))
				ret = "Pando";
			else
			if(str.match(/^a0[02]---0/))
				ret = "Swarmy";
			else
			if(str.match(/^10-------/))
				ret = "JVtorrent";
			else
			if(str.match(/^eX/))
				ret = "eXeem";
			else
			if(str.match(/^-aria2-/))
				ret = "aria2";
			else
			if(str.match(/^S3-.-.-./))
				ret = "Amazon S3 "+str.charAt(3)+"."+str.charAt(5)+"."+str.charAt(7);
			else
			if(str.match(/^OP/))
				ret = "Opera (build "+str.substr(2,4)+")";
			else
			if(str.match(/^-ML/))
				ret = "MLDonkey "+str.substr(3,5);
			else
			if(str.match(/^AP/))
				ret = "AllPeers "+str.substr(2,4);
			else
			if(str.match(/^DNA\d\d\d\d\d\d/))
				ret = "BitTorrent DNA "+parseInt(str.substr(3,2),10)+"."+parseInt(str.substr(5,2),10)+"."+parseInt(str.substr(7,2),10);
			else
			if(str.match(/^Plus/))
				ret = "Plus! v2 "+str.charAt(4)+"."+str.charAt(5)+str.charAt(6);
			else
			if(str.match(/^XBT\d\d\d/))
				ret = "XBT Client "+str.charAt(3)+"."+str.charAt(4)+"."+str.charAt(5)+getMnemonicEnd(str.charAt(6));
			else
			if(str.match(/^Mbrst/))
				ret = "burst! "+str.charAt(5)+"."+str.charAt(7)+"."+str.charAt(9);
			else
			if(str.match(/^btpd/))
				ret = "BT Protocol Daemon "+str.charAt(5)+str.charAt(6)+str.charAt(7);
			else
			if(str.match(/^BLZ/))
				ret = "Blizzard Downloader "+(str.charCodeAt(3)+1)+"."+str.charCodeAt(4);
			else
			if(str.match(/.*UDP0$/))
				ret = "BitSpirit";
			else
			if(str.match(/^QVOD/))
				ret = "QVOD "+str.charAt(4)+"."+str.charAt(5)+"."+str.charAt(6)+"."+str.charAt(7);
			else
			if(str.match(/^-NE/))
				ret = "BT Next Evolution "+str.charAt(3)+"."+str.charAt(4)+"."+str.charAt(5)+"."+str.charAt(6);
			else
			if(str.match(/^-WT-/))
				ret = "BitLet "+str.charAt(4)+"."+str.charAt(5)+"."+str.charAt(6)+"."+str.charAt(7);
			else
			{
				var mod = null;
				if(str.match(/^exbc/))
					mod = '';
				else
				if(str.match(/^FUTB/))
					mod = '(Solidox Mod) ';
				else
				if(str.match(/^xUTB/))
					mod = '(Mod 2) ';
				if(mod!=null)
				{
					var isBitlord = (str.substr(6,4)=="LORD");
					var name = isBitlord ? "BitLord " : "BitComet ";
					var major = str.charCodeAt(4);
					var minor = str.charCodeAt(5);
					var sep = ".";
					if(!(isBitlord && major>0) && (minor<10))
						sep+="0";
					ret = name+mod+major+sep+minor;
				}
			}
		}
		if(!ret)
		{
			if(str.match(/^[A-Z]([A-Z0-9\-\.]{1,5})/i))
			{
				var cli = this.shLikeClients[str.charAt(0)];
				if(cli)
					ret = cli+" "+shChar(str.charAt(1))+"."+shChar(str.charAt(2))+"."+shChar(str.charAt(3));
			}
		}
		return(ret ? ret : "Unknown ("+origStr+")");
	}
};

function getCSSRule( selectorText )
{
	function getRulesArray(i)
	{
		var crossrule = null;
		try {
		if(document.styleSheets[i].cssRules)
			crossrule=document.styleSheets[i].cssRules;
		else 
			if(document.styleSheets[i].rules)
				crossrule=document.styleSheets[i].rules;
		} catch(e) {}
		return(crossrule);
	}

	selectorText = selectorText.toLowerCase()
	var ret = null;
	for( var j=document.styleSheets.length-1; j>=0; j-- )
	{
		var rules = getRulesArray(j);
		for( var i=0; rules && i<rules.length; i++ )
		{
			if(rules[i].selectorText && rules[i].selectorText.toLowerCase()==selectorText)
			{
				ret = rules[i];
				break;
			}			
		}
	}
	return(ret);
}

function RGBackground( selector )
{
        this.channels = [0,0,0];
        if(selector)
        {
		var cs;
                var rule = getCSSRule(selector);
		if(rule)
			var cs = rule.style.backgroundColor;
		else
			cs = selector;	
		if(cs.charAt(0) == '#')
       			cs = cs.substr(1);
		cs = cs.replace(/ /g,'').toLowerCase();
		var colorDefs =
		[
       			{
				re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
       				process: function(bits)
	        		{
					return([iv(bits[1]),iv(bits[2]),iv(bits[3])]);
				}
			},
			{
				re: /^(\w{2})(\w{2})(\w{2})$/,
				process: function(bits)
				{
		        	        return([parseInt(bits[1], 16),parseInt(bits[2], 16),parseInt(bits[3], 16)]);
				}
			},
			{
				re: /^(\w{1})(\w{1})(\w{1})$/,
				process: function (bits)
				{
					return([parseInt(bits[1] + bits[1], 16),parseInt(bits[2] + bits[2], 16),parseInt(bits[3] + bits[3], 16)]);
				}
			}
		];
		for(var i = 0; i < colorDefs.length; i++)
		{
			var bits = colorDefs[i].re.exec(cs);
			if(bits)
			{
				this.channels = colorDefs[i].process(bits);
				break;
			}
		}
	}
	return(this);
}

RGBackground.prototype.getColor = function()
{
	var r = this.channels[0].toString(16);
        var g = this.channels[1].toString(16);
        var b = this.channels[2].toString(16);
        if(r.length == 1) r = '0' + r;
        if(g.length == 1) g = '0' + g;
        if(b.length == 1) b = '0' + b;
        return('#' + r + g + b);
	return(this);
}

RGBackground.prototype.setGradient = function(beginColor,endColor,percent)
{
	this.channels[0] = beginColor.channels[0] + iv(percent * (endColor.channels[0] - beginColor.channels[0]) / 100);
	this.channels[1] = beginColor.channels[1] + iv(percent * (endColor.channels[1] - beginColor.channels[1]) / 100);
	this.channels[2] = beginColor.channels[2] + iv(percent * (endColor.channels[2] - beginColor.channels[2]) / 100);
	return(this);
}

function getCRC( str, crc )
{
	var crc16Tab = new Array(
		0x0000,0x1021,0x2042,0x3063,0x4084,0x50A5,0x60C6,0x70E7,0x8108,0x9129,0xA14A,0xB16B,0xC18C,
		0xD1AD,0xE1CE,0xF1EF,0x1231,0x0210,0x3273,0x2252,0x52B5,0x4294,0x72F7,0x62D6,0x9339,0x8318,
		0xB37B,0xA35A,0xD3BD,0xC39C,0xF3FF,0xE3DE,0x2462,0x3443,0x0420,0x1401,0x64E6,0x74C7,0x44A4,
		0x5485,0xA56A,0xB54B,0x8528,0x9509,0xE5EE,0xF5CF,0xC5AC,0xD58D,0x3653,0x2672,0x1611,0x0630,
		0x76D7,0x66F6,0x5695,0x46B4,0xB75B,0xA77A,0x9719,0x8738,0xF7DF,0xE7FE,0xD79D,0xC7BC,0x48C4,
		0x58E5,0x6886,0x78A7,0x0840,0x1861,0x2802,0x3823,0xC9CC,0xD9ED,0xE98E,0xF9AF,0x8948,0x9969,
		0xA90A,0xB92B,0x5AF5,0x4AD4,0x7AB7,0x6A96,0x1A71,0x0A50,0x3A33,0x2A12,0xDBFD,0xCBDC,0xFBBF,
		0xEB9E,0x9B79,0x8B58,0xBB3B,0xAB1A,0x6CA6,0x7C87,0x4CE4,0x5CC5,0x2C22,0x3C03,0x0C60,0x1C41,
		0xEDAE,0xFD8F,0xCDEC,0xDDCD,0xAD2A,0xBD0B,0x8D68,0x9D49,0x7E97,0x6EB6,0x5ED5,0x4EF4,0x3E13,
		0x2E32,0x1E51,0x0E70,0xFF9F,0xEFBE,0xDFDD,0xCFFC,0xBF1B,0xAF3A,0x9F59,0x8F78,0x9188,0x81A9,
		0xB1CA,0xA1EB,0xD10C,0xC12D,0xF14E,0xE16F,0x1080,0x00A1,0x30C2,0x20E3,0x5004,0x4025,0x7046,
		0x6067,0x83B9,0x9398,0xA3FB,0xB3DA,0xC33D,0xD31C,0xE37F,0xF35E,0x02B1,0x1290,0x22F3,0x32D2,
		0x4235,0x5214,0x6277,0x7256,0xB5EA,0xA5CB,0x95A8,0x8589,0xF56E,0xE54F,0xD52C,0xC50D,0x34E2,
		0x24C3,0x14A0,0x0481,0x7466,0x6447,0x5424,0x4405,0xA7DB,0xB7FA,0x8799,0x97B8,0xE75F,0xF77E,
		0xC71D,0xD73C,0x26D3,0x36F2,0x0691,0x16B0,0x6657,0x7676,0x4615,0x5634,0xD94C,0xC96D,0xF90E,
		0xE92F,0x99C8,0x89E9,0xB98A,0xA9AB,0x5844,0x4865,0x7806,0x6827,0x18C0,0x08E1,0x3882,0x28A3,
		0xCB7D,0xDB5C,0xEB3F,0xFB1E,0x8BF9,0x9BD8,0xABBB,0xBB9A,0x4A75,0x5A54,0x6A37,0x7A16,0x0AF1,
		0x1AD0,0x2AB3,0x3A92,0xFD2E,0xED0F,0xDD6C,0xCD4D,0xBDAA,0xAD8B,0x9DE8,0x8DC9,0x7C26,0x6C07,
		0x5C64,0x4C45,0x3CA2,0x2C83,0x1CE0,0x0CC1,0xEF1F,0xFF3E,0xCF5D,0xDF7C,0xAF9B,0xBFBA,0x8FD9,
		0x9FF8,0x6E17,0x7E36,0x4E55,0x5E74,0x2E93,0x3EB2,0x0ED1,0x1EF0);

       	crc = iv(crc);
	for(var i=0; i<str.length; i++)
		crc = crc16Tab[((crc>>8)^str.charCodeAt(i))&0xFF]^((crc<<8)&0xFFFF);
	return(crc);
}

function json_encode(obj)
{
	switch($type(obj))
	{
		case "number":
			return(String(obj));
		case "boolean":
			return(obj ? "1" : "0");
		case "string":
			return('"'+obj+'"');
		case "array":
		{
		        var s = '';
		        $.each(obj,function(key,item)
		        {
		                if(s.length)
                			s+=",";
		        	s += json_encode(item);
		        });
			return("["+s+"]");
		}
		case "object":
		{
		        var s = '';
		        $.each(obj,function(key,item)
		        {
		                if(s.length)
                			s+=",";
		        	s += ('"'+key+'":'+json_encode(item));
		        });
			return("{"+s+"}");
		}
	}
	return("null");
}
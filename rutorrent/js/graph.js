/*
 *      Speed graph.
 *
 *	$Id: graph.js 1451 2010-09-23 08:45:25Z novik65 $
 */

function clearElement(target)
{
	while(target.hasChildNodes())
	{
		clearElement(target.firstChild);
		target.firstChild.removeNode();
	}
}

function clearCanvas( target )
{
	var cnv = target.getElementsByTagName('canvas');
	if(cnv)
	{
		for(var i=0; i<cnv.length; i++)
		{
			cnv[i].onmousemove = null;
			cnv[i].onpropertychange = null;
			cnv[i].onresize = null;
			if(browser.isIE && browser.versionMajor<9)
			{
				cnv[i].getContext = null;
				cnv[i].context_.canvas = null;
				cnv[i].context_ = null;
			}
		}
	}
	if(browser.isIE)
		clearElement(target);
}

function rSpeedGraph()
{
}

rSpeedGraph.prototype.create = function( aOwner )
{
	this.owner = aOwner;
	this.maxSeconds = 600;
	this.seconds = -1;
	this.down = { label: theUILang.DL, data: [], color: "#1C8DFF" };
	this.up = { label: theUILang.UL, data: [], color: "#009900" };
	this.startSeconds = new Date().getTime()/1000;
	var rule = getCSSRule("div.graph_tab");
	this.gridColor = rule ? rule.style.color : "#545454";
}

var previousSpeedPoint = null;
rSpeedGraph.prototype.draw = function()
{
	var self = this;
	$(function() 
	{
		if((theWebUI.activeView=='Speed') &&
			self.owner.height() && self.owner.width())
		{
			clearCanvas( self.owner.get(0) );
			self.owner.empty();

			function xTick(n) 
			{
				var dt = new Date(n*1000);
				var h = dt.getHours();
				var m = dt.getMinutes();
				var s = dt.getSeconds();
				h = (h < 10) ? ("0" + h) : h;
				m = (m < 10) ? ("0" + m) : m;
				s = (s < 10) ? ("0" + s) : s;
				return( h+":"+m+":"+s );
			}

			$.plot(self.owner, [ self.up, self.down ],
			{ 
				colors:
				[
				 	self.up.color, self.down.color
				],
				lines:
				{
					show: true
				},
				grid:
				{
					color: self.gridColor,
					hoverable: true
				},
				xaxis: 
				{ 
					max: (self.seconds-self.startSeconds>=self.maxSeconds) ? null : self.maxSeconds+self.startSeconds,
					tickSize: 60,
					tickFormatter: xTick
			 	},
			  	yaxis: 
			  	{ 
			  		min: 0,
				  	minTickSize: 5*1024,
	  				tickFormatter: function(n) { return(theConverter.speed(n)) } 
		  		}
			});

			function showTooltip(x, y, contents)
			{
        			$('<div id="tooltip">' + contents + '</div>').css( {
					position: 'absolute',
					display: 'none',
					top: y + 5,
					left: x + 5,
					border: '1px solid #fdd',
					padding: '2px',
					'background-color': '#fee',
					'color': 'black',
					'font-size': '11px',
					'font-weight': 'bold',
					'font-family': 'Tahoma, Arial, Helvetica, sans-serif',
					opacity: 0.80
				}).appendTo("body").fadeIn(200);
			}

			self.owner.unbind("plothover"); 
			self.owner.bind("plothover", 
				function (event, pos, item) 
				{ 
					if(item)
					{
						if(previousSpeedPoint != item.datapoint)
						{
							previousSpeedPoint = item.datapoint;
							$("#tooltip").remove();
							showTooltip(item.pageX, item.pageY,
								item.series.label + " " + xTick(item.datapoint[0]) + " = " + theConverter.speed(item.datapoint[1]));
						}
					}
					else
					{
						$("#tooltip").remove();
						previousSpeedPoint = null;
					}
				}
			);

		}
	}
	);
}

rSpeedGraph.prototype.resize = function( newWidth, newHeight )
{
	if(this.owner)
	{
		if(newWidth)
			this.owner.width(newWidth);
		if(newHeight)
			this.owner.height(newHeight);
		this.draw();
	}
}

rSpeedGraph.prototype.addData = function( upSpeed, downSpeed )
{
	this.seconds = new Date().getTime()/1000;
	this.up.data.push([this.seconds,upSpeed]);
	this.down.data.push([this.seconds,downSpeed]);
	while((this.down.data[this.down.data.length-1][0]-this.down.data[0][0])>this.maxSeconds)
	{
		this.down.data.shift(); 
		this.up.data.shift();
	}		
	this.draw();
}

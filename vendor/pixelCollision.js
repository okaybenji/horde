// adapted from: http://shin.cl/pixelperfect/main.js
// found here: http://www.html5gamedevs.com/topic/1228-2d-pixel-perfect-collision-detection-with-rotated-graphics/
// demoed here: http://shin.cl/pixelperfect/
// translated via google

//To simplify our life.
var $={
	get:function(id)
	{
		return document.getElementById(id);
	},
	create:function(type)
	{
		return document.createElement(type);
	}
};

// Our Sprite class.
var sprite=function(img,x,y)
{
	this.image;
	if(img)
	{
		this.image = $.create("canvas");
		var c = this.image.getContext("2d");
		this.image.width = img.width;
		this.image.height = img.height;
		c.drawImage(img,0,0);
	
	}else{ // If we do not create a canvas.
		this.image = $.create("canvas");
		this.image.width = this.image.height = 1; // we give a width and height of 1 px
	}
	this.x = x || 0;
	this.y = y || 0;
	this.width = this.image.width;
	this.height = this.image.height;
};

// Returns true / false if this sprite intersects with another.
sprite.prototype.overlap=function(r)
{
	return (this.x<r.x+r.width && this.x+this.width>r.x && this.y<r.y+r.height && this.y+this.height>r.y);
};

// returns an intersection rectangle.
sprite.prototype.intersection=function(r)
{
	if(this.overlap(r))
	{
		var x,y,w,h;
		x = Math.max(this.x,r.x);
		y = Math.max(this.y,r.y);
		w = Math.min(this.x+this.width,r.width+r.height)-x;
		h = Math.min(this.y+this.height,r.y+r.height)-y;
		return [x,y,w,h];
	}
	else return [0,0,0,0];
};

// Get the pixels of an image.
function getDataOfImage(img,x,y,w,h)
{
	x = parseInt(x);
	y = parseInt(y);
	w = parseInt(w);
	h = parseInt(h);
	if(w==0) w=1;
	if(h==0) h=1;
	var c = $.create("canvas");
	c.width = img.width;
	c.height = img.height;
	var ct = c.getContext("2d");
	ct.clearRect(0,0,c.width,c.height);
	ct.drawImage(img,0,0);
	var imagedata = ct.getImageData(x,y,w,h);
	var rgb = imagedata.data;
	var pixels=new Array(parseInt(w*h));
	var i=0;
	for(var y=0;y<h;y++)
	{
		for(var x=0;x<w;x++)
		{
			var p=(y*w+x)*4;
			pixels[i]=(rgb[p+3]<<24)|(rgb[p]<< 16)|(rgb[p+1]<<8)|rgb[p+2];
			i++;
		}
	}
	return pixels;
}

/**
 * Method that detects if two sprite are colliding.
 * 
 * @param {sprite} s1 
 * @param {sprite} s2
 * 
 * @return {Boolean}
 */
function pixelCollision(s1,s2)
{
	if(s1.overlap(s2))
	{
		var r = s1.intersection(s2);
		var pixels1 = getDataOfImage(s1.image,r[0]-s1.x,r[1]-s1.y,r[2],r[3]);
		var pixels2 = getDataOfImage(s2.image,r[0]-s2.x,r[1]-s2.y,r[2],r[3]);
		for(var i=0;i<pixels1.length;i++)
		{
			if(pixels1[i]!=0 && pixels2[i]!=0)
			{
				return true;
			}
		}
		
	}
	
	return false;	
}

var canvas,ctx,dragging=false,RAD2DEG=Math.PI/180;

function roundRect(x,y,w,h,r,fill,stroke) {
  if(typeof(r)=='undefined') r=5;
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.arc(x+w-r,y+r,r,270*RAD2DEG,360*RAD2DEG,false);
  ctx.lineTo(x+w,y+h-r);
  ctx.arc(x+w-r,y+h-r,r,0,90*RAD2DEG,false);
  ctx.lineTo(x+r,y+h);
  ctx.arc(x+r,y+h-r,r,90*RAD2DEG,180*RAD2DEG,false);
  ctx.lineTo(x,y+r);
  ctx.arc(x+r,y+r,r,180*RAD2DEG,270*RAD2DEG,false);
  ctx.closePath();
  if(fill||typeof(fill)=='undefined') ctx.fill(); // default to fill
  if(stroke) ctx.stroke(); // default to no stroke
}
function desenhaCirculo(x,y,r,fill,stroke) {
  ctx.beginPath();
  ctx.arc(x,y,r,0*RAD2DEG,360*RAD2DEG,true);
  if(fill||typeof(fill)=='undefined') ctx.fill();
  if(stroke||typeof(stroke)=='undefined') ctx.stroke();
}
function dashedLine(x,y,x2,y2,dashArray) {
  if(typeof(dashArray)=='undefined') dashArray=[10,5];
  var passo, dashIndex=0, draw=true,resta;
  var dx=x2-x, dy=y2-y, dist=Math.sqrt(dx*dx+dy*dy), fatorX=dx/dist, fatorY=dy/dist;
  ctx.moveTo(x,y);
  for(resta=dist; resta>=0.1; resta-=passo) {
    passo=dashArray[dashIndex++%dashArray.length];
    if(passo>resta) passo=resta;
    x+=passo*fatorX;
    y+=passo*fatorY;
    if(draw) ctx.lineTo(x,y);
    else ctx.moveTo(x,y);
    draw=!draw;
  }
}

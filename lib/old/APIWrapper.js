/*
 * SENAI WebCursos - http://nead.senairs.org.br/cursos
 * Núcleo de Educação a Distância do SENAI RS - Brasil
*/
var find_LMS_API_Tries=0;
function find_LMS_API(win) {
  // Check to see if the window (win) contains the API
  // if the window (win) does not contain the API and the window (win) has
  // a parent window and the parent window is not the same as the window (win)
  while(win.API==null && win.parent!=null && win.parent!=win) {
    find_LMS_API_Tries++;
    if(find_LMS_API_Tries>7) return null;
    // set the variable that represents the window being searched to be
    // the parent of the current window then search for the API again
    win=win.parent;
  }
  return win.API;
}
function get_LMS_API() {
  find_LMS_API_Tries=0;
  var theAPI=find_LMS_API(window); // start by looking for the API in the current window
  // if the API is null (could not be found in the current window)
  // and the current window has an opener window
  if(theAPI==null && window.opener!=null && typeof(window.opener)!="undefined")
    theAPI=find_LMS_API(window.opener); // try to find the API in the current window’s opener
  return theAPI;
}
function safe_get_LMS_API() {
  var theAPI=get_LMS_API();
  if(theAPI==null) theAPI=new Dummy_LMS_API();
  return theAPI;
}
function Dummy_LMS_API() {
  this.LMSInitialize=function(dummyString) { return 'false'; }
  this.LMSGetValue=function(varname) { return ''; }
  this.LMSSetValue=function(varname,value) { return 'false'; }
  this.LMSCommit=function(dummyString) { return 'false'; }
  this.LMSFinish=function(dummyString) { return 'false'; }
  this.LMSGetLastError=function() { return '101'; }
  this.LMSGetErrorString=function(error_code) { return 'Erro 101: API não encontrada.'; }
  this.LMSGetDiagnostic=function(error_code) { return 'Erro 101: API não encontrada.'; }
}

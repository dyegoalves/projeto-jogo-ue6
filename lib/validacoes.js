/*
 * SENAI WebCursos - http://nead.senairs.org.br/cursos
 * Núcleo de Educação a Distância do SENAI RS - Brasil
*/
// Abaixo algumas máscaras pré-definidas para serem usadas com a função do_mask
var mask_hour='##:##';
var mask_12_hour='##:##:## AA';
var mask_24_hour='##:##:##';
var mask_cep='#####-###';
var mask_cnpj='##.###.###/####-##';
var mask_cpf='###.###.###-##';
var mask_date='##/##/####';
var mask_date_time='##/##/#### ##:##:##';
var mask_date_time_12='##/##/#### ##:##:## AA';
var mask_date_time_no_sec='##/##/#### ##:##';
var mask_phone='(##) ####-#####';
var STR_PAD_LEFT=1;
var STR_PAD_RIGHT=2;
var STR_PAD_BOTH=3;
var isIE=(document.all ? true : false);

// preenche uma string para um certo tamanho com outra string
function str_pad(input, pad_length, pad_string, pad_type) {
  var left, right, padlen;
  if(typeof pad_length=='undefined') var pad_length=0;
  if(typeof pad_string=='undefined') var pad_string=' ';
  if(typeof pad_type=='undefined') var pad_type=STR_PAD_RIGHT;
  if(pad_length > input.length) {
    switch(pad_type) {
      case STR_PAD_LEFT:
        input=Array(pad_length+1-input.length).join(pad_string)+ input;
      break;
      case STR_PAD_BOTH:
        padlen=pad_length - input.length;
        right=Math.ceil(padlen/2);
        left=padlen - right;
        input=Array(left+1).join(pad_string)+ input + Array(right+1).join(pad_string);
      break;
      default:
        input=input + Array(pad_length+1-input.length).join(pad_string);
      break;
    }
  }
  return input;
}
function trim(str) {
  return str.replace(/^\s*|\s*$/g,'');
}
function is_empty(str) {
  return(str==null || str=='' || trim(str)=='');
}
function is_integer(str) {
  exp=/^\-?\d+$/;
  return exp.test(str);
}
function is_natural(str) {
  exp=/^\d+$/;
  return exp.test(str);
}
function is_float(str) {
  exp=/^\-?\d+(\.\d+)?$/;
  return exp.test(trim(str));
}
function is_expoente(str) {
  exp=/^\-?\d+(\.\d+)?((e[+-]?)\d+)?$/;
  return exp.test(trim(str));
}
function is_date(str) {
  exp=/^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.]\d\d\d\d$/;
  if(!exp.test(str)) return false;
  var dia=str.substring(0, str.indexOf('/'));
  var strVal=str.substring(str.indexOf('/')+1, str.length);
  var mes=strVal.substring(0, strVal.indexOf('/'));
  var ano=strVal.substring(strVal.indexOf('/')+1, strVal.length);
  if(mes==2 && dia>(ano%4==0 &&(ano%100!=0||ano%400==0)?29:28)) return false;
  if((mes==4||mes==6||mes==9||mes==11)&& dia==31) return false;
  return true;
}
function is_time(str) {
  exp=/^([01][0-9]|2[0123])(:[0-5][0-9]){1,2}$/;
  return exp.test(str);
}
function is_date_time(str) {
  var pos;
  if(str==null||(pos=str.indexOf(' '))<0) return false;
  return is_date(str.substring(0,pos))&& is_time(str.substring(pos+1));
}
function is_email(str) {
  exp=/^[a-zA-Z0-9-_\.]+\@[a-zA-Z0-9-_\.]+\.[a-zA-Z]{2,4}$/;
  return exp.test(str);
}
function is_phone(str) {
  exp=/^\([\d]{2}\)\s[\d]{4}(-)[\d]{4,5}$/;
  if(!exp.test(str)) { // testa 1º com a máscara, se não validar, testa sem
    exp=/^[\d]{10,11}$/;
    return exp.test(str);
  }
  return true;
}
function is_cep(str) {
  var exp=/^[\d]{5}(-)[\d]{3}$/;
  if(!exp.test(str)) { // testa 1º com a máscara, se não validar, testa sem
    exp=/^[\d]{8}$/;
    return exp.test(str);
  }
  return true;
}
function is_cnpj(cnpj) {
  var exp=/^[\d]{2}(.)[\d]{3}(.)[\d]{3}(\/)[\d]{4}(-)[\d]{2}$/;
  if(exp.test(cnpj)) cnpj=cnpj.replace(/[^\d]+/g,'');
  else { // testa 1º com a máscara, se não validar, testa sem
    exp=/^[\d]{14}$/;
    if(!exp.test(cnpj)) return false;
  }
  // verifica se esta usando a repeticao de um numero
  if(cnpj=='00000000000000'||cnpj=='11111111111111'||cnpj=='22222222222222'
   ||cnpj=='33333333333333'||cnpj=='44444444444444'||cnpj=='55555555555555'
   ||cnpj=='66666666666666'||cnpj=='77777777777777'||cnpj=='88888888888888'
   ||cnpj=='99999999999999')
    return false;

  var i, j, digit, acum, tem_diff=false;
  var s1=cnpj.substring(0,12);
  var s2=cnpj.substring(12,15);
  var controle='', mult='543298765432';
  for(j=1; j<3; j++) {
    acum=0;
    for(i=0; i<12; i++)
      acum += eval(s1.charAt(i))* eval(mult.charAt(i));
    if(j==2) acum+=(2*digit);
    digit=(acum*10)%11;
    if(digit==10) digit=0;
    controle=controle+digit;
    mult='654329876543';
  }
  return(controle==s2);
}

function is_cpf(str) {
  str=strip_mask_chars(str,mask_cpf);
  if(is_integer(str)&& str.length >= 7 && str.length < 11)
    str=str_pad(str,11,'0',STR_PAD_LEFT);
  exp=/^[\d]{11}$/;
  if(!exp.test(str)) return false;
  // invalida se todos algarismos forem iguais
  var i, digit, acum, tem_diff=false;
  for(i=1; i<str.length; i++)
    if(str.charAt(i)!= str.charAt(0))
      tem_diff=true;
  if(!tem_diff) return false;
  // testa o 1º dígito verificador
  acum=0;
  for(i=0;i<9; i++)
    acum += (10-i)* eval(str.charAt(i));
  digit=(acum%11 < 2 ? 0 : 11-(acum % 11));
  if(eval(str.charAt(9))!= digit)
    return false;
  // testa o 2º dígito verificador
  acum=0;
  for(i=0;i<9; i++)
    acum += (11-i)* eval(str.charAt(i));
  acum += 2 * eval(str.charAt(9));
  digit=(acum%11 < 2 ? 0 : 11-(acum % 11));
  return(eval(str.charAt(10))== digit);
}

// Teclas com conflito no onkeypress do Firefox (IE ñ aciona o evento para control keys)
// key 33: caracteres ! e PAGE UP
// key 34: caracteres " e PAGE DOWN
// key 35: caracteres # e END
// key 36: caracteres $ e HOME
// key 37: caracteres % e SETA ESQ
// key 38: caracteres & e SETA UP
// key 39: caracteres ' e SETA DIR
// key 40: caracteres ( e SETA DOWN
// key 45: caracteres - e INSERT
// key 46: caracteres . e DEL
function mask_integer(ev,pode_negativo) {
  if(typeof pode_negativo=='undefined') pode_negativo=true; // valor padrão
  var exp=/\d/;
  var input=(ev.target ? ev.target : ev.srcElement);
  var key=(ev.keyCode ? ev.keyCode :(ev.charCode ? ev.charCode : ev.which));
  var chrCod=String.fromCharCode(key);
  var ctrlKey=(window.Event && document.layers ? (ev.modifiers & Event.CONTROL_MASK)> 0: ev.ctrlKey);
  var altKey=(window.Event && document.layers ? (ev.modifiers & Event.ALT_MASK)> 0: ev.altKey);

  return(exp.test(chrCod)||(ctrlKey && !altKey)||key==0||key==8||key==9||key==13
   ||(!isIE &&(key==35||key==36||key==37||key==39))
   ||(pode_negativo && chrCod=='-'&& get_input_sel_start(input)==0 && input.value.charAt(get_input_sel_end(input))!='-')
  );
}

function mask_float(ev,pode_negativo) {
  if(typeof pode_negativo=='undefined') pode_negativo=true; // valor padrão
  var exp=/\d/;
  var input=(ev.target ? ev.target : ev.srcElement);
  var key=(ev.keyCode ? ev.keyCode :(ev.charCode ? ev.charCode : ev.which));
  var chrCod=String.fromCharCode(key);
  var posCod=input.value.indexOf(chrCod);
  var ctrlKey=(window.Event && document.layers ? (ev.modifiers & Event.CONTROL_MASK)> 0: ev.ctrlKey);
  var altKey=(window.Event && document.layers ? (ev.modifiers & Event.ALT_MASK)> 0: ev.altKey);
  var selStart=get_input_sel_start(input);
  var selEnd=get_input_sel_end(input);

  return(exp.test(chrCod)||(ctrlKey && !altKey)||key==0||key==8||key==9||key==13
   ||(!isIE &&(key==35||key==36||key==37||key==39))
   ||(pode_negativo && chrCod=='-'&& selStart==0 && input.value.charAt(selEnd)!='-')
   ||(chrCod=='.'&&(posCod<0 ||(selStart!=selEnd && posCod>=selStart && posCod<=selEnd)))
  );
}

function mask_expoente(ev,pode_negativo) {
  if(typeof pode_negativo=='undefined') pode_negativo=true; // valor padrão
  var exp=/\d/;
  var input=(ev.target ? ev.target : ev.srcElement);
  var key=(ev.keyCode ? ev.keyCode :(ev.charCode ? ev.charCode : ev.which));
  var chrCod=String.fromCharCode(key);
  var posCod=input.value.indexOf(chrCod);
  var ctrlKey=(window.Event && document.layers ? (ev.modifiers & Event.CONTROL_MASK)> 0: ev.ctrlKey);
  var altKey=(window.Event && document.layers ? (ev.modifiers & Event.ALT_MASK)> 0: ev.altKey);
  var selStart=get_input_sel_start(input);
  var selEnd=get_input_sel_end(input);
  var newTam=input.value.length-(selEnd-selStart);

  return(exp.test(chrCod)||(ctrlKey && !altKey)||key==0||key==8||key==9||key==13
   ||(!isIE &&(key==35||key==36||key==37||key==39))
   ||(pode_negativo && chrCod=='-'&& selStart==0 && input.value.charAt(selEnd)!='-')
   ||(chrCod=='.'&& selStart>0 && newTam>0 &&(input.value.indexOf('e')<0 || input.value.indexOf('e')>=selStart)&&(posCod<0 ||(selStart!=selEnd && posCod>=selStart && posCod<=selEnd)))
   ||((chrCod=='+'||chrCod=='-')&& input.value.indexOf('e')==selStart-1 && selStart>0
      &&(input.value.lastIndexOf('-')<=0 ||(selStart!=selEnd && input.value.lastIndexOf('-')>=selStart && input.value.lastIndexOf('-')<selEnd))
      &&(input.value.lastIndexOf('+')< 0 ||(selStart!=selEnd && input.value.lastIndexOf('+')>=selStart && input.value.lastIndexOf('+')<selEnd))
     )
   ||(chrCod=='e'&& selStart>0 && newTam>0 &&(posCod<0 ||(selStart!=selEnd && posCod>=selStart && posCod<=selEnd)))
  );
}

function mask_max(ev,max) {
  var input=(ev.target ? ev.target : ev.srcElement);
  var key=(ev.keyCode ? ev.keyCode :(ev.charCode ? ev.charCode : ev.which));
  var ctrlKey=(window.Event && document.layers ? (ev.modifiers & Event.CONTROL_MASK)> 0: ev.ctrlKey);
  var altKey=(window.Event && document.layers ? (ev.modifiers & Event.ALT_MASK)> 0: ev.altKey);
  return(input.value.length<max ||(ctrlKey && !altKey)||key==0||key==8||key==9||key==13
    ||(!isIE && key>=35 && key<=40)||get_input_sel_start(input)!=get_input_sel_end(input));
}

function mask_max_do(input,max) {
  if(input.value.length > max)
    input.value=input.value.substring(0,max);
}

/** Permite aplicar uma máscara a uma string tendo os seguintes caracteres-chave:
 * '#': somente números
 * 'H': hexadecimal [0-9|A-F]
 * 'A': alfanumérico (qualquer caracter)
 */
function mascara(input,str_mask) {
  var pos, mask_final='', mask_max=str_mask.length;
  var cont, mask_num=strip_mask_chars(input,str_mask);
  if(mask_num.length==0) return '';

  for(cont=0,pos=0; cont < mask_max; cont++,pos++) {
    if(str_mask.charAt(cont)=='#'||str_mask.charAt(cont)=='H'||str_mask.charAt(cont)=='A') {
      if(mask_num.length==0) break;
      mask_final += mask_num.charAt(0);
      mask_num=mask_num.substring(1);
    } else {
      mask_final += str_mask.charAt(cont);
      if(input.charAt(pos)!=str_mask.charAt(cont)) pos--;
    }
  }
  return mask_final;
}

/** Permite aplicar uma máscara a um campo de texto tendo os seguintes caracteres-chave:
 * '#': somente números
 * 'H': hexadecimal [0-9|A-F]
 * 'A': alfanumérico (qualquer caracter)
 * Exemplo de uso: <input type="text" name="cpf" onkeydown="return do_mask(event,this,mask_cpf)" onkeyup="if(event.keyCode!=9 && event.which!=9 && this.value.length>=mask_cpf.length) { prox_campo.focus(); prox_campo.select(); }"/>
 */
function do_mask(e,input,str_mask) {
  var key=1,ctrlKey=false,altKey=false;
  if(e != null) {
    key=(e.keyCode ? e.keyCode : e.which);
    ctrlKey=(window.Event && document.layers ? (e.modifiers & Event.CONTROL_MASK)> 0: e.ctrlKey);
    altKey=(window.Event && document.layers ? (e.modifiers & Event.ALT_MASK)> 0: e.altKey);
    if(key >= 96 && key <= 105) key -= 48;
    //Especial   Back     tab    enter      end     home      esq      dir
    if(key==0||key==8||key==9||key==13||key==35||key==36||key==37||key==39||(ctrlKey && !altKey))
      return true;
  }
  var pos,type='#',cont,mask_max=0,mask_final='',cur_pos=get_input_sel_start(input);
  var mask_num=strip_mask_chars(input.value.substring(0,cur_pos),str_mask);
  var sufix=strip_mask_chars(input.value.substring(get_input_sel_end(input),input.value.length),str_mask);

  for(pos=0; pos < str_mask.length; pos++) {
    if(str_mask.charAt(pos)=='#'||str_mask.charAt(pos)=='A'||str_mask.charAt(pos)=='H') {
      if(mask_max==mask_num.length) type=str_mask.charAt(pos);
      mask_max++;
    }
  }
  if(e != null) {
    if(type=='#'&&(key < 48 || key > 57||(ctrlKey && altKey))) return false;
    if(type=='H'&&((ctrlKey && altKey)|| !((key >= 48 && key <= 57)||(key >= 65 && key <= 70)||(key >= 97 && key <= 102)))) return false;
    if((mask_num.length+sufix.length)>= mask_max) {
      if(type=='A' && cur_pos == get_input_sel_end(input)) return false;
      mask_num=strip_mask_chars(input.value,str_mask);
    } else if(type=='#'|| type=='H') {
      mask_num += String.fromCharCode(key)+sufix;
      cur_pos++;
    }
  }
  for(cont=0,pos=0; cont < str_mask.length; cont++,pos++) {
    if(str_mask.charAt(cont)=='#'||str_mask.charAt(cont)=='H'||str_mask.charAt(cont)=='A') {
      if(mask_num.length == 0) break;
      mask_final += mask_num.charAt(0);
      mask_num=mask_num.substring(1);
    } else {
      mask_final += str_mask.charAt(cont);
      if(pos <= cur_pos && input.value.charAt(pos)!=str_mask.charAt(cont)) {
        cur_pos++;
        pos--;
      }
    }
  }
  input.value=mask_final;
  set_input_sel_range(input,cur_pos,cur_pos);
  return(type=='A');
}

function strip_mask_chars(mask_temp,str_mask) {
  str_mask=replace(replace(str_mask,'A',''),'#','');
  for(var cont=0; cont < str_mask.length; cont++)
    if(mask_temp.indexOf(str_mask.charAt(cont)) >= 0)
      mask_temp=replace(mask_temp,str_mask.charAt(cont),'');
  return mask_temp;
}

function replace(str,text,by) { // Replaces text with by in str
  if(str.length == 0 || text.length == 0) return str;
  var i=str.indexOf(text);
  if(!i &&(text != str.substring(0,text.length))) return str;
  if(i == -1) return str;
  var newstr=str.substring(0,i) + by;
  if(i+text.length < str.length)
    newstr += replace(str.substring(i+text.length,str.length),text,by);
  return newstr;
}

function set_input_sel_range(input,start,end) {
  if(input.setSelectionRange) {
    input.setSelectionRange(start,end);
    input.focus();
  } else {
    var range=input.createTextRange();
    range.collapse(true);
    range.moveStart('character',start);
    range.moveEnd('character',end-start);
    range.select();
  }
}

function get_input_sel_start(input) {
  if(input.selectionStart != null) return input.selectionStart;
  var range=document.selection.createRange();
  var isCollapsed=range.compareEndPoints('StartToEnd',range)==0;
  if(!isCollapsed) range.collapse(true);
  var b=range.getBookmark();
  return b.charCodeAt(2)-2;
}

function get_input_sel_end(input) {
  if(input.selectionEnd != null) return input.selectionEnd;
  var range=document.selection.createRange();
  var isCollapsed=range.compareEndPoints('StartToEnd',range)==0;
  if(!isCollapsed) range.collapse(false);
  var b=range.getBookmark();
  return b.charCodeAt(2)-2;
}

function get_mask(str, str_mask) {
  var pos, mask_final='', mask_num=strip_mask_chars(str,str_mask);

  if(mask_num.length == 0) return '';
  for(pos=0; pos < str_mask.length; pos++) {
    if(str_mask.charAt(pos)=='#'||str_mask.charAt(pos)=='H'||str_mask.charAt(pos)=='A') {
      if(mask_num.length == 0) break;
      mask_final += mask_num.charAt(0);
      mask_num=mask_num.substring(1);
    } else {
      mask_final += str_mask.charAt(pos);
    }
  }
  return mask_final;
}

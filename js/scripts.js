function SetCoreScore() {
  var i, o, oid, menor=null, count=1;
  var num=api.LMSGetValue('cmi.objectives._count');
  if(num < vet_arqs.length-1) return false;
  for(i=1; i<vet_arqs.length; i++) vet_arqs[i][5]= null;
  for(o=0; o<num; o++) {
    oid=api.LMSGetValue('cmi.objectives.'+o+'.id');
    for(i=1; i<vet_arqs.length; i++) {
      if(vet_arqs[i][4]==oid) {
        vet_arqs[i][5]=parseFloat(api.LMSGetValue('cmi.objectives.'+o+'.score.raw'));
        if(menor==null || menor > vet_arqs[i][5]) menor = vet_arqs[i][5];
        count++;
        break;
      }
    }
  }
  if(count < num) return false;
  var lesson_status, mastery_score=parseFloat(api.LMSGetValue('cmi.student_data.mastery_score'));
  if(menor>=mastery_score) lesson_status='passed';
  else if(menor>=mastery_score*0.75) lesson_status='completed'; // para gerar desempenho amarelo
  else lesson_status='failed';
  api.LMSSetValue("cmi.core.lesson_status",lesson_status);
  api.LMSSetValue("cmi.core.score.raw",menor.toFixed(2));
  api.LMSCommit("");
  return true;
}

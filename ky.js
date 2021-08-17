

for (let index = 0; index < 20; index++) {
    
    var nomes = "jogador_" + index;

    if (nomes.match(/jogador_/)) {
      console.log("string encontrada");
    } else {
      console.log("string not encontrada");
    }
}
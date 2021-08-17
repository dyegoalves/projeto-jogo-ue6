var app = new Vue({
  el: "#app",
  data: {
    message: "Ola",
    showbuttonInciar: true,
    jogadores: new Object(),
  },

  mounted() {
    //Chama a funcao para carregar os dados
    this.getDados();
  },

  methods: {
    getDados: function () {
      var values = [];
      (keys = Object.keys(localStorage)), (i = keys.length);
      while (i--) {
        values.push(JSON.parse(localStorage.getItem(keys[i])));
      }

      //Set dados do LOCALSTORAGE
      this.jogadores = values;

      //Sort em acertos quanto maior o numero de acertos melhor posicao
      this.jogadores.sort(function (a, b) {
        return b.acertos - a.acertos;
      });
    },

    ishowbt: function (ishow) {
      this.showbuttonInciar = ishow;
      restart();
    },
  },
});

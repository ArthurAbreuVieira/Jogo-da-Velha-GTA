import sound from "./sound.js";
import _interface from "./interface.js";
import settings from "./settings.js";

const game = {
  player: null,
  round: 0,
  finish: false,
  initialPlayer: null,

  checkSrc(id) {
    const file = document.getElementById(id).src;
    return file.substring(file.length - 10, file.length);
  },

  checkWinner() {
    if ((this.checkSrc('c1') === this.checkSrc('c2')) && (this.checkSrc('c1') === this.checkSrc('c3')) && this.checkSrc('c1') != "transp.png") {
      _interface.setWinnerLine(["c1","c2","c3"]);
      return true;
    }

    else if ((this.checkSrc('c4') === this.checkSrc('c5')) && (this.checkSrc('c4') === this.checkSrc('c6')) && this.checkSrc('c4') != "transp.png") {
      _interface.setWinnerLine(["c4","c5","c6"]);
      return true;
    }

    else if ((this.checkSrc('c7') === this.checkSrc('c8')) && (this.checkSrc('c7') === this.checkSrc('c9')) && this.checkSrc('c7') != "transp.png") {
      _interface.setWinnerLine(["c7","c8","c9"]);
      return true;
    }

    else if ((this.checkSrc('c1') === this.checkSrc('c4')) && (this.checkSrc('c1') === this.checkSrc('c7')) && this.checkSrc('c1') != "transp.png") {
      _interface.setWinnerLine(["c1","c4","c7"]);
      return true;
    }

    else if ((this.checkSrc('c2') === this.checkSrc('c5')) && (this.checkSrc('c2') === this.checkSrc('c8')) && this.checkSrc('c2') != "transp.png") {
      _interface.setWinnerLine(["c2","c5","c8"]);
      return true;
    }

    else if ((this.checkSrc('c3') === this.checkSrc('c6')) && (this.checkSrc('c3') === this.checkSrc('c9')) && this.checkSrc('c3') != "transp.png") {
      _interface.setWinnerLine(["c3","c6","c9"]);
      return true;
    }

    else if ((this.checkSrc('c1') === this.checkSrc('c5')) && (this.checkSrc('c1') === this.checkSrc('c9')) && this.checkSrc('c1') != "transp.png") {
      _interface.setWinnerLine(["c1","c5","c9"]);
      return true;
    }

    else if ((this.checkSrc('c3') === this.checkSrc('c5')) && (this.checkSrc('c3') === this.checkSrc('c7')) && this.checkSrc('c3') != "transp.png") {
      _interface.setWinnerLine(["c3","c5","c7"]);
      return true;
    }

    return false;
  },

  cpuPlay() {
    if (this.checkSrc('c5') === "transp.png") return 'c5';

    return 'c' + Math.floor((Math.random() * 9) + 1);
  },

  checkGame(id) {
    if (this.finish) return false;

    if(this.round == 0) {
      if(settings.getSettings().player === "Random") {
        this.initialPlayer = settings.getRandomPlayer();
        this.player = this.initialPlayer;
      } else {
        this.initialPlayer = settings.getSettings().player;
        this.player = this.initialPlayer;
      }
    }

    const pc = settings.getSettings().pc;

    const cell = this.checkSrc(id);

    if (cell === "transp.png") {
      if(settings.getSettings().sounds) sound.spray.play();

      _interface.changeCellImg(id, this.player);

      this.round++;

      if (this.checkWinner()) {
        if(settings.getSettings().sounds) sound.passed.play();

        _interface.missionPassed();

        this.finish = true;

        _interface.createResultMsg(
          `Fim de Jogo <span class=${this.player==="Grove"?"green":"purple"}>${this.player}</span> venceu!`
        );

        return false;
      }

      if (this.round >= 9) {
        if(settings.getSettings().sounds) sound.cj.play();
        this.finish = true;

        _interface.createResultMsg("Fim de jogo!! Deu velha!!!");

        return false;
      }

      if (this.player === "Grove") this.player = "Ballas";
      else this.player = "Grove";
    }
    // if (pc ) setTimeout(() => this.checkGame(this.cpuPlay()), 400);
    if (pc && this.player !== this.initialPlayer) setTimeout(() => this.checkGame(this.cpuPlay()), 400);
  },

  reset() {
    this.round = 0;
    this.finish = false;

    _interface.createResultMsg("");

    _interface.resetCells();
  }
}

export default game;
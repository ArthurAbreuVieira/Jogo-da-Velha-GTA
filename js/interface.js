import game from "./game.js";
import sound from "./sound.js";
import settings from "./settings.js";

const _interface = {
  menu: document.getElementById("menu"),
  _settings: document.getElementById("settings"),
  board: document.getElementById("board"),
  cells: document.querySelectorAll("[data-js=cell]"),
  menuButtons: document.querySelectorAll("[data-js=menu-button]"),
  settingsOptions: document.querySelectorAll("[data-js=setting-option]"),
  pcLabel: document.querySelector("[data-js=pc-label]"),
  introStep: 0,

  startInterface() {
    const start = document.getElementById("start");
    const video = document.createElement("video");
    start.addEventListener("click", () => {
      if (this.introStep === 0) {
        this.introStep++;

        video.src = "./video/intro.mp4";
        video.muted = true;
        start.innerHTML = "";
        start.appendChild(video);
        video.play();
        if (settings.getSettings().sounds) sound.intro.play();
        setTimeout(() => {
          start.removeChild(video);

          sound.background.loop = true;
          if (settings.getSettings().backgroundSound) sound.background.play();

          start.style.display = "none";
          this.menu.style.display = "flex";
        }, 16000);
      } else if (this.introStep === 1) {
        this.introStep++;

        sound.intro.pause();
        if (start.hasChildNodes(video)) start.removeChild(video);

        sound.background.currentTime = 0;
        if (settings.getSettings().backgroundSound) sound.background.play();

        start.style.display = "none";
        this.menu.style.display = "flex";
      }
    });


    const reset = document.querySelector("[data-js=reset]");
    reset.addEventListener("click", () => game.reset());

    this.pcLabel.innerText = `Jogar contra o computador: ${settings.getSettings().pc ? "Sim" : "Não"}`

    this.pcLabel.addEventListener("click", () => {
      if (game.round !== 0) {
        this.pcLabel.style.color = "red";
        setTimeout(() => this.pcLabel.style.color = "#fff", 200);
        return false;
      }

      const currentSettings = settings.getSettings();
      settings.setSettings({ ...currentSettings, pc: currentSettings.pc ? false : true });
      this.pcLabel.innerText = `Jogar contra o computador: ${!currentSettings.pc ? "Sim" : "Não"}`
    })

    this.cells.forEach(cell => {
      cell.addEventListener("click", e => game.checkGame(cell.id));
    });

    this.menuButtons.forEach((btn, index) => {
      btn.addEventListener("mouseover", e => {
        if (settings.getSettings().sounds) sound.hover.play();

        const buttonContainer = document.querySelector(".menu-buttons");
        const angle = index === 0 ? -12 : 12;
        buttonContainer.style.transform = `rotate(${angle}deg)`;
        buttonContainer.style.left = index === 0 ? "60px" : "-60px";
        btn.style.margin = "0 20px"
      });
    });

    this.menuButtons.forEach((btn, index) => {
      btn.addEventListener("mouseout", e => {
        const buttonContainer = document.querySelector(".menu-buttons");
        buttonContainer.style.transform = `rotate(0deg)`;
        btn.style.margin = "0"
        buttonContainer.style.left = "0";
      });
    });

    this.menuButtons.forEach((btn, index) => {
      btn.addEventListener("click", e => {
        if (settings.getSettings().sounds) sound.click.play();

        switch (index) {
          case 0:
            this.play();
            break;
          case 1:
            this.settings();
            break;
        }
      });
    });

    const selector = document.createElement("span");
    selector.classList.add("selector");

    this.settingsOptions[0].innerText = settings.getSettings().sounds ? "Efeitos sonoros: ON" : "Efeitos sonoros: OFF";
    this.settingsOptions[1].innerText = `Música: ${settings.getSettings().backgroundSound ? "On" : "Off"}`;
    this.settingsOptions[2].innerText = `Wallpaper: ${settings.getSettings().background}`;
    this.settingsOptions[3].innerText = `Player inicial: ${settings.getSettings().player}`;

    this.settingsOptions.forEach((option, index) => {
      option.addEventListener("mouseover", e => {
        if (settings.getSettings().sounds) sound.hover.play();
        option.appendChild(selector);
      });
    });

    this.settingsOptions.forEach((option, index) => {
      option.addEventListener("mouseleave", e => {
        try {
          option.removeChild(selector);
        } catch (e) {
          option.appendChild(selector);
          option.removeChild(selector);
        }
      });
    });

    this.settingsOptions.forEach((option, index) => {
      option.addEventListener("click", e => {
        if (settings.getSettings().sounds) sound.click.play();

        option.appendChild(selector);

        let currentSettings;
        let currentOptionIndex;
        let options;
        switch (index) {
          case 0:
            options = [true, false];

            currentSettings = settings.getSettings();
            currentOptionIndex = options.indexOf(currentSettings.sounds);

            if (currentOptionIndex === options.length - 1) {
              option.innerText = `Efeitos sonoros: On`;
              settings.setSettings({ ...currentSettings, sounds: options[0] });
            } else {
              option.innerText = `Efeitos sonoros: Off`;
              settings.setSettings({ ...currentSettings, sounds: options[currentOptionIndex + 1] });
            }

            break;

          case 1:
            options = [true, false];

            currentSettings = settings.getSettings();
            currentOptionIndex = options.indexOf(currentSettings.backgroundSound);

            if (currentOptionIndex === options.length - 1) {
              option.innerText = `Música: On`;
              settings.setSettings({ ...currentSettings, backgroundSound: options[0] });
              if (sound.background.paused) sound.background.play();
            } else {
              option.innerText = `Música: Off`;
              settings.setSettings({ ...currentSettings, backgroundSound: options[currentOptionIndex + 1] });
              sound.background.pause();
            }

            break;

          case 2:
            options = ["Imagem 1", "Imagem 2", "Imagem 3", "Imagem 4", "Imagem 5", "Imagem 6", "Imagem 7", "Imagem 8", "Imagem 9", "Imagem 10", "Random"];

            currentSettings = settings.getSettings();
            currentOptionIndex = options.indexOf(currentSettings.background);

            if (currentOptionIndex === options.length - 1) {
              option.innerText = `Wallpaper: ${options[0]}`;
              settings.setSettings({ ...currentSettings, background: options[0] });
            } else {
              option.innerText = `Wallpaper: ${options[currentOptionIndex + 1]}`;
              settings.setSettings({ ...currentSettings, background: options[currentOptionIndex + 1] });
            }

            break;


          case 3:
            options = ["Grove", "Ballas", "Random"];

            currentSettings = settings.getSettings();
            currentOptionIndex = options.indexOf(currentSettings.player);

            if (currentOptionIndex === options.length - 1) {
              option.innerText = `Player inicial: ${options[0]}`;
              settings.setSettings({ ...currentSettings, player: options[0] });
            } else {
              option.innerText = `Player inicial: ${options[currentOptionIndex + 1]}`;
              settings.setSettings({ ...currentSettings, player: options[currentOptionIndex + 1] });
            }

            break;

          case 4:
            this.menu.style.display = "flex";
            this._settings.style.display = "none";
            break;
        }
      });
    });

    this.changeMenuImg();
  },

  setBackground() {
    const backgroundRule = settings.getSettings().background;
    let bgIndex;
    if (backgroundRule === "Random") {
      bgIndex = Math.floor(1 + Math.random() * 10);
    } else {
      bgIndex = backgroundRule.replace("Imagem ", "");
    }

    document.body.style.backgroundImage = `url(img/bg${bgIndex}.jpg)`;
  },

  play() {
    this.menu.style.display = "none";
    this.board.style.display = "flex";

    this.setBackground();
  },

  settings() {
    this.menu.style.display = "none";
    this._settings.style.display = "flex";
    const bgIndex = Math.floor(Math.random() * 5 + 1);
    this._settings.style.backgroundImage = `url(img/menu-bg${bgIndex}.jpg)`;
  },

  createResultMsg(msg) {
    document.getElementById("msg").innerHTML = msg;
    this.cells.forEach(cell => cell.style.cursor = "not-allowed");
  },

  setWinnerLine(elements) {
    elements.forEach((e, i) => {
      setTimeout(() => document.getElementById(e).classList.add("winner"), 400 * (i + 1));
    });
  },

  missionPassed() {
    const textElement = document.createElement("p");
    textElement.classList.add("mission-passed");
    const missionPassedText = `Mission Passed!<br/> <span>Respect +</span>`;
    textElement.innerHTML = missionPassedText;
    this.board.appendChild(textElement);

    setTimeout(() => {
      textElement.style.opacity = 1;
      setTimeout(() => {
        textElement.style.opacity = 0;
        setTimeout(() => this.board.removeChild(textElement), 1000);
      }, 5000);
    }, 500);
  },

  changeCellImg(id, player) {
    const imgElement = document.getElementById(id);

    const angle = player === "grove" ? 90 : -90;
    imgElement.style.transform = `scale(0) rotate(${angle}deg)`;
    imgElement.style.visibility = "hidden";
    imgElement.style.opacity = "0";
    imgElement.src = `img/${player}.png`;

    setTimeout(() => {
      imgElement.style.visibility = "visible";
      imgElement.style.opacity = "1";
      imgElement.style.transform = "scale(1) rotate(0deg)";
    }, 100);
  },

  changeMenuImg() {
    const imgElement = document.querySelector("#menu img");
    const imageBaseName = "./img/menu-bg?.jpg";
    const imgCount = 5;

    for (let i = 0; i < imgCount; i++) {
      setTimeout(() => {
        imgElement.style.opacity = "0";
        setTimeout(() => {
          imgElement.src = imageBaseName.replace("?", i + 1);
          imgElement.style.opacity = "1";
        }, 500 * (i + 1));


        if (i === imgCount - 1) setTimeout(() => this.changeMenuImg(), 5000);

      }, 5000 * (i + 1));
    }
  },

  resetCells() {
    this.cells.forEach(cell => {
      cell.src = `img/transp.png`;
      cell.style = "";
      cell.style.cursor = "pointer";
      cell.classList.remove("winner");
    });

    this.setBackground();
  }

}

export default _interface;
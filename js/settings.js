const settings = {
  setSettings(newValues) {
    localStorage.setItem("gta-settings", JSON.stringify(newValues));
  },

  getSettings() {
    const settings = JSON.parse(localStorage.getItem("gta-settings"));
    return settings;
  },

  setDefaultSettings() {
    let settings = JSON.parse(localStorage.getItem("gta-settings"));
    if(!settings) {
      settings = {
        sounds: true,
        background: "Random",
        player: "Grove",
        pc: false,
        backgroundSound: true
      }
      this.setSettings(settings);  
    }
  },

  getRandomPlayer() {
    const players = ["Grove", "Ballas"];
    const index = Math.floor(Math.random() * (1 + 1));

    return players[index];
  }
}

export default settings;
function msToInterval(ms) {
  const minutes = Math.floor(ms / 1000 / 60);
  ms -= minutes * 1000 * 60;
  const seconds = Math.floor(ms / 1000);
  ms -= seconds * 1000;
  return `${
    minutes < 10 ? '0' + minutes : minutes
  }:${
    seconds < 10 ? '0' + seconds : seconds
  }`;
}

module.exports = {
  msToInterval: msToInterval,
}
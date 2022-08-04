const e = require("express");
const nodejieba = require("nodejieba");
const path_config = require("../path.config");
const data = require(path_config.data_path);

const extra_words = () => {
  nodejieba.load({
    stopWordDict: path_config.dict_path,
  });
  let res = [];
  let map = new Map();
  let words = data;
  for (let word of words) {
    if (
      word.subtitles === undefined ||
      !word.titleUrl ||
      !word.title.startsWith("Watched ") ||
      !word.time.includes("2021")
    ) {
      continue;
    }
    word.title = word.title.replace("Watched ", "");

    for (let subtitle of word.subtitles) {
      nodejieba.insertWord(subtitle.name);
    }
    let w = nodejieba.extract(word.title, 10);
    for (let i = 0; i < w.length; i++) {
      res.push(w[i]);
    }
    //     const MOD = 10000000007;
    //     for (let i = 0; i < res.length; i++) {
    //       if (map.has(res[i].word)) {
    //         map.set(res[i].word, (map.get(res[i].word) + res[i].weight) % MOD);
    //       } else {
    //         map.set(res[i].word, res[i].weight);
    //       }
    //     }

    //     res = [];
    //     for (let [key, value] of map.entries()) {
    //       console.log(value);
    //       res.push({ word: key, weight: value });
    //     }
  }
  console.log("word count", res.length);
  return res;
};

extra_words();

module.exports = { extra_words };

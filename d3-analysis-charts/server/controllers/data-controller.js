// Import database
const database = require("../db");

exports.getVideoLength = async (req, res) => {
  await database.all(
    "SELECT duration / 60 AS duration , COUNT(1) AS counts FROM video WHERE duration > 0 GROUP BY 1;",
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

exports.getYearlyCount = async (req, res) => {
  await database.all(
    "SELECT STRFTIME('%Y', DATE(timestamp, 'unixepoch')) AS year,COUNT(1) AS counts FROM history GROUP BY 1;",
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

exports.getWatchHours = async (req, res) => {
  await database.all(
    "SELECT STRFTIME('%Y', DATETIME(timestamp, 'unixepoch', 'localtime')) AS year, STRFTIME('%H', DATETIME(timestamp, 'unixepoch', 'localtime')) AS hour, COUNT(1) AS counts FROM history GROUP BY 1, 2 HAVING year = '2021';",
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

exports.getTimesRank = async (req, res) => {
  await database.all(
    'SELECT  name , "https://www.youtube.com/channel/" || channel_id as channel_url,c as counts FROM ( SELECT channel.name, channel.channel_id, COUNT(1) AS c FROM history LEFT JOIN video ON history.video_id = video.video_id LEFT JOIN channel ON video.channel_id = channel.channel_id GROUP BY 1 ORDER BY c DESC LIMIT 25)',
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

exports.getDurationRank = async (req, res) => {
  await database.all(
    'SELECT  name , "https://www.youtube.com/channel/" || channel_id as channel_url, ROUND(c,2) as duration FROM ( SELECT channel.name, channel.channel_id, SUM(video.duration) / 3600.0 AS c FROM history LEFT JOIN video on history.video_id = video.video_id LEFT JOIN channel on video.channel_id = channel.channel_id WHERE video.duration > 0 GROUP BY 1, 2 ORDER BY c DESC LIMIT 25 )',
    (err, rows) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(rows);
      }
    }
  );
};

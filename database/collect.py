from datetime import datetime
import dateutil.parser
import json
import os
import requests
import sqlite3
import youtube_dl

path = '../data/watch-history.json'
sqlite_file = '../identifier.sqlite'
video_detail_cache_folder = '../cache/%s'
video_url = 'http://www.youtube.com/watch?v=%s'

conn = sqlite3.connect(sqlite_file)

def insert_channel(name,channel_id):
    c = conn.cursor();
    c.execute("INSERT OR IGNORE INTO channel (channel_id, name) VALUES (?, ?)",(channel_id,name))

def insert_video(title, video_id, channel_id):
    c = conn.cursor()
    c.execute("INSERT OR IGNORE INTO video (video_id, channel_id, title) VALUES (?, ?, ?)", (video_id, channel_id, title))

def insert_history(timestamp, video_id):
      c = conn.cursor()
      c.execute("INSERT OR IGNORE INTO history (timestamp, video_id) VALUES (?, ?)", (timestamp, video_id))

def update_video_info(video_id, duration):
      c = conn.cursor()
      c.execute("UPDATE video SET duration=? WHERE video_id=?", (duration, video_id))

def get_video_duration(ydl,video_id):
    file_path = video_detail_cache_folder % video_id
    url = video_url % video_id

    if not os.path.exists(file_path):
        try:
            result = ydl.extract_info(url, download=False)
        except:
            return -1

        with open(file_path, 'w') as f:
            f.write(json.dumps(result))

    with open(file_path) as json_file:
        data = json.load(json_file)
        try:
            return data["duration"]
        except:
            return -1


def populate_database():
    ydl = youtube_dl.YoutubeDL({'outtmpl': '%(id)s%(ext)s'})

    with open(path) as json_file:
        data = json.load(json_file)
        for history in data:
            if "subtitles" not in history or "titleUrl" not in history or not history["title"].startswith("Watched "):
                continue

            channel_id = ""
            for subtitle in history["subtitles"]:
                channel_id = subtitle["url"].replace("https://www.youtube.com/channel/", "")
                insert_channel(subtitle["name"],channel_id)

            title = history["title"].replace("Watched ", "")
            video_id = history["titleUrl"].replace("https://www.youtube.com/watch?v=", "")
            insert_video(title, video_id, channel_id)

            duration = get_video_duration(ydl,video_id)
            if duration:
                update_video_info(video_id, duration)

            timestamp = int(dateutil.parser.parse(history["time"]).timestamp())
            insert_history(timestamp, video_id)

populate_database()

conn.commit()
conn.close()





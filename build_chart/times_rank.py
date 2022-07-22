import sqlite3

sqlite_file = '../identifier.sqlite'

conn = sqlite3.connect(sqlite_file)

c = conn.cursor()
c.execute("""
SELECT "|" || ROW_NUMBER() OVER (ORDER BY c DESC) || "|" || "[" || name || "](https://www.youtube.com/channel/" || channel_id || ")|" || c || "|"
FROM (
  SELECT 
    channel.name, 
    channel.channel_id, 
    COUNT(1) AS c FROM history
  LEFT JOIN video ON
    history.video_id = video.video_id
  LEFT JOIN channel ON
    video.channel_id = channel.channel_id
  GROUP BY 1
  ORDER BY c DESC
  LIMIT 25
)
""")

rows = c.fetchall()

for row in rows:
  print(row)

conn.commit()
conn.close()

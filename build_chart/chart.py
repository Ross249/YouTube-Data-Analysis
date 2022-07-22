import matplotlib.pyplot as plt
import sqlite3


def plot_video_length():
    x = []
    y = []

    c = conn.cursor()
    c.execute("""
  SELECT 
    duration / 60, COUNT(1) 
    FROM video 
    WHERE duration > 0
    GROUP BY 1;
  """
              )

    rows = c.fetchall()

    for row in rows:
        x.append(row[0])
        y.append(row[1])

    plt.plot(x, y, marker='x')
    # plt.xticks(x)
    plt.xlim(0, 180)
    plt.xlabel('Length')
    plt.ylabel('Video Count')
    plt.title('YouTube Length Distribution')
    plt.legend()


def plot_yearly_count():
    x = []
    y = []

    c = conn.cursor()
    c.execute("""
  SELECT
    STRFTIME('%Y', DATE(timestamp, 'unixepoch')) AS year,
    COUNT(1)
  FROM
    history
  GROUP BY 1;
  """
              )

    rows = c.fetchall()

    for row in rows:
        x.append(row[0])
        y.append(row[1])

    plt.bar(x, y)
    plt.xticks(x)
    plt.xlabel('Year')
    plt.ylabel('Video')
    plt.title('Yearly Watched YouTube Videos')
    plt.legend()


def plot_watch_hour():
    x = []
    y = []

    c = conn.cursor()
    c.execute("""
  SELECT
    STRFTIME('%Y', DATETIME(timestamp, 'unixepoch', 'localtime')) AS year,
    STRFTIME('%H', DATETIME(timestamp, 'unixepoch', 'localtime')) AS hour,
    COUNT(1)
  FROM history GROUP BY 1, 2 HAVING year = '2021';
  """
              )

    rows = c.fetchall()

    for row in rows:
        x.append(int(row[1]))
        y.append(int(row[2]))

    plt.bar(x, y)
    plt.xlabel('Hour')
    plt.ylabel('Video')
    plt.title('Watch Hour (2021)')
    plt.legend()


sqlite_file = '../identifier.sqlite'
conn = sqlite3.connect(sqlite_file)

plt.rcParams["figure.figsize"] = (12, 4)

plt.subplot(1, 2, 1)
plot_yearly_count()

plt.subplot(1, 2, 2)
plot_watch_hour()

plt.subplots_adjust(wspace=0.2)

# plt.show()
plt.savefig("../img/graphs.svg", format="svg")

plt.clf()

plot_video_length()
# plt.show()
plt.savefig("../img/video_length.svg", format="svg")

conn.commit()
conn.close()

import json
import jieba.analyse
from wordcloud import WordCloud

json_file_path = '../data/watch-history.json'

# with open('./stop_words.txt') as f:
#     stopWords = [line.strip() for line in f.readlines()]

def gen_img(texts, words_number):
  data = ' '.join(text for text in texts)
  wc = WordCloud(
      width=1000,
      height=500,
      background_color='white',
      max_words=words_number,
      font_path='../lib/STHeiti-Light.ttc'
  )
  wc.generate(data)
  wc.to_file('../img/wordle.png')

def extract_words():
  words = []
  with open(json_file_path) as json_file:
    data = json.load(json_file)
    for history in data:
      if 'subtitles' not in history or 'titleUrl' not in history or not history['title'].startswith('Watched ') or not '2021' in history['time']:
        continue

      title = history['title'].replace('Watched ', '')

      for subtitle in history["subtitles"]:
        jieba.add_word(subtitle["name"])
        jieba.suggest_freq(subtitle["name"], True)


      # 这里你可以 jieba.add_word 或 del_word 一些词
      jieba.analyse.set_stop_words('../lib/stop_words.txt')
      tags = jieba.analyse.extract_tags(title)
      # tags = jieba.cut(title)
      # tags = [t for t in tags if t not in stopWords]
      # print(tags)
      words.extend(tags)
  return words

def analyze():
  words = extract_words()
  print('words count: ', len(words))
  gen_img(words, len(words))

analyze()

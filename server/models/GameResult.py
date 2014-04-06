from google.appengine.ext import ndb
from server.models.Bot import Bot

class GameResult(ndb.Model):
  bot1 =  ndb.KeyProperty(kind=Bot)
  bot2 =  ndb.KeyProperty(kind=Bot)
  created = ndb.DateTimeProperty(auto_now_add=True)
  result = ndb.IntegerProperty()
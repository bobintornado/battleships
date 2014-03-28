from google.appengine.ext import ndb

class Board(ndb.Model):
  grid = ndb.StringProperty()
  
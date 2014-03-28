from google.appengine.ext import ndb

class Bot(ndb.Model):
  name = ndb.StringProperty()
  language = ndb.StringProperty()
  code = ndb.StringProperty()
  score = ndb.FloatProperty()
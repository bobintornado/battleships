from server.lib.bottle import Bottle, debug,request
import json
# use the Jinja templating system
from view_helper import JINJA_ENV
# import model code
from server.models.Bot import Bot

bottle = Bottle() # create another WSGI application for this controller and resource.
debug(True) #  uncomment for verbose error logging. Do not use in production


@bottle.get('/all')
def show():
  bots = Bot.query()
  result = []
  for bot in bots:
    result.append(bot.to_dict())
  return json.dumps(result)

@bottle.post('/create')
def add():
  name = request.params.get('name')
  lan = request.params.get('language')
  code = request.params.get('code')
  new_bot = Bot(name = name, language = lan, code = code, score = 0)
  new_bot.put()
  result = json.dumps({"name":name,"language":lan,"code":code})
  return result
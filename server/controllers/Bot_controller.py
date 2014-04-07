from server.lib.bottle import Bottle, debug,request,route, run, redirect
import json
# use the Jinja templating system
from view_helper import JINJA_ENV
# import model code
from server.models.Bot import Bot
import Utility

import urllib
from google.appengine.api import urlfetch
from google.appengine.ext import ndb

bottle = Bottle() # create another WSGI application for this controller and resource.
debug(True) #  uncomment for verbose error logging. Do not use in production


@bottle.get('/percentile10')
def show():
  bots = Bot.query().order(-Bot.score)
  result = []
  if bots.count() <= 10: 
    for bot in bots:
      result.append(bot.to_dict())
    return json.dumps(result)
  else:
    botsList = bots.run(batch_size=1000)
    #dividing code
    avg = len(botsList) / 10.0
    last = 0.0
    while last < len(botsList):
      result.append(botsList[int(last)])
      last += avg

    return json.dumps(result)

@bottle.get('/all')
def show():
  bots = Bot.query()
  result = []
  for bot in bots:
    result.append(bot.to_dict())
  return json.dumps(result)

@bottle.post('/create') #post
def add():
  name = ""
  lan = "python"
  code = ""
  
  if "application/json" in request.content_type:
    d = json.loads(request.body.getvalue())
    name = d['name']
    lan = d['language']
    code = d['code']
  else:
    name = request.params.get('name')
    lan = request.params.get('language')
    code = request.params.get('code')
  
  result = json.loads(Utility.invoke_verify(code,lan))
  if 'errors' in result:
    #return str(result['errors'])
    return json.dumps({"status":"error","message":"Your bot cannot be compiled.",
                        "errors":str(result['errors'])})
  else:
    #save bot
    new_key_a = ndb.Key(Bot, solution)
    b = new_key_a.get() 
    if b is not None:
      return json.dumps({"status":"error","message":"The bot name is taken",
                        "errors":""})
    else:
      random_bot_name = Utility.random_name_generator() 
      key_name = ndb.Key(Bot, solution)
      new_bot = Bot(name =random_bot_name, language = lan, code = solution, score = 400, key = key_name)
      new_bot.put()
      return json.dumps(new_bot.to_dict())
  






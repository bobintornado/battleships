from server.lib.bottle import Bottle, debug,request
import json
# use the Jinja templating system
from view_helper import JINJA_ENV
# import model code
from server.models.Bot import Bot

from server.lib.bottle import route, request, run, redirect
import urllib
from google.appengine.api import urlfetch
from google.appengine.ext import ndb

bottle = Bottle() # create another WSGI application for this controller and resource.
debug(True) #  uncomment for verbose error logging. Do not use in production


@bottle.get('/all')
def show():
  bots = Bot.query()
  result = []
  for bot in bots:
    result.append(bot.to_dict())
  return json.dumps(result)

@bottle.route('/create') #post
def add():
  ##verify against christ server
  name = request.params.get('name')
  lan = request.params.get('language')
  code = request.params.get('code')
  #name = "alexander"
  #lan = "python"
  #code = "def play_game(d):\n  return d"
  #code = "def sdaf"
  #tests = ">>> play_game('___,___,___')\n  'ANYTHING'\n"
  result = json.loads(invoke_verify(code,lan))
  if 'errors' in result:
    #return str(result['errors'])
    return json.dumps({"status":"error","message":"Your bot cannot be compiled.",
                        "errors":str(result['errors'])})
  else:
    new_bot = Bot(name = name, language = lan, code = code, score = 0)
    #GAE has auto retrying feature and a 500 internal error will be replied if failed
    #500 internal error handling unimplemented
    new_bot.put()
  return json.dumps({"status":"success","name":new_bot.name,"language":new_bot.language,
                     "code":new_bot.code,"score":new_bot.score})

def invoke_verify(problem,lan,tests=""):
  url = "http://ec2-54-251-204-6.ap-southeast-1.compute.amazonaws.com/" + lan
  result = verify(problem, tests, url)
  return result   

def verify(problem, tests, url):
  j = {"tests":tests, "solution":problem}
  requestJSON = json.dumps(j)
  result = verify_service(requestJSON,url)
  return result
  
def verify_service(requestJSON, url):
  params = urllib.urlencode({'jsonrequest': requestJSON})
  deadline = 10 
  result = urlfetch.fetch(url=url,
                          payload=params,
                          method=urlfetch.POST,
                          deadline=deadline,
                          headers={'Content-Type': 'application/x-www-form-urlencoded'})
  return result.content

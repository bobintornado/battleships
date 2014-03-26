from server.lib.bottle import Bottle, debug,request
import json
# use the Jinja templating system
from view_helper import JINJA_ENV
# import model code
from server.models.Bot import Bot

from server.lib.bottle import route, request, run, redirect
from google.appengine.api import users
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
  #name = request.params.get('name')
  #lan = request.params.get('language')
  #code = request.params.get('code')
  name = "alexander"
  lan = "python"
  code = "def map():\n  return true"
  new_bot = Bot(name = name, language = lan, code = code, score = 0)
  #new_bot = Bot(name = "beautyqueen", language = "englrish", code = "pasdasdef wef()[]", score=0)
  new_bot.put()
  #verify_service("name":"alexander","language":"python","code":"code"}
  result = json.dumps({"name":name,"language":lan,"code":code})
  url = "http://ec2-54-251-204-6.ap-southeast-1.compute.amazonaws.com/python"
  output = verify_service(result,url)
  return output
  #return result
  #return 'true'

def verify_service(requestJSON, url):
      params = urllib.urlencode({'jsonrequest': requestJSON})

      deadline = 10
    
      result = urlfetch.fetch(url=url,
                                payload=params,
                                method=urlfetch.POST,
                                deadline=deadline,
                                headers={'Content-Type': 'application/x-www-form-urlencoded'})
      return result.content


def verify(problem, tests, url):
  d = {"tests":tests, "solution":problem}
  requestJSON = json.dumps(d)
  result = verify_service(requestJSON,url)
  return result

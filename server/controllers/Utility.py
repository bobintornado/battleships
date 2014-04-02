from server.lib.bottle import Bottle, debug,request,route, run, redirect
import json
# use the Jinja templating system
from view_helper import JINJA_ENV

import urllib
from google.appengine.api import urlfetch
from google.appengine.ext import ndb

def invoke_verify(solution,lan,tests=""):
  url = "http://ec2-54-251-204-6.ap-southeast-1.compute.amazonaws.com/" + str(lan)
  result = verify(solution, tests, url)
  return result   

def verify(solution, tests, url):
  j = {"tests":tests, "solution":solution}
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
from server.lib.bottle import Bottle, debug,request,route, run, redirect
import json
import random
# use the Jinja templating system
from view_helper import JINJA_ENV

import urllib
from google.appengine.api import urlfetch
from google.appengine.ext import ndb

def invoke_verify(solution,lan,tests=""):
  url = "http://162.222.183.53/" + str(lan)
  result = verify(solution, tests, url)
  return result   

def verify(solution, tests, url):
  j = {"tests":tests, "solution":solution}
  requestJSON = json.dumps(j)
  result = verify_service(requestJSON,url)
  return result
  
def verify_service(requestJSON, url):
  params = urllib.urlencode({'jsonrequest': requestJSON})
  deadline = 100
  result = urlfetch.fetch(url=url,
                          payload=params,
                          method=urlfetch.POST,
                          deadline=deadline,
                          headers={'Content-Type': 'application/x-www-form-urlencoded'})
  return result.content
  
def random_name_generator():
    # originally from: https://gist.github.com/1266756
    # with some changes
    # example output:
    # "falling-late-violet-forest-d27b3"
    adjs = [ "autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark",
          "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter",
          "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue",
          "billowing", "broken", "cold", "damp", "falling", "frosty", "green",
          "long", "late", "lingering", "bold", "little", "morning", "muddy", "old",
          "red", "rough", "still", "small", "sparkling", "throbbing", "shy",
          "wandering", "withered", "wild", "black", "young", "holy", "solitary",
          "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine",
          "polished", "ancient", "purple", "lively", "nameless"
      ]
    nouns = [ "waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning",
          "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter",
          "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook",
          "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly",
          "feather", "grass", "haze", "mountain", "night", "pond", "darkness",
          "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder",
          "violet", "water", "wildflower", "wave", "water", "resonance", "sun",
          "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper",
          "frog", "smoke", "star"
      ]
    hex = "0123456789abcdef"
    return (random.choice(adjs) + "-" + random.choice(nouns) + "-" + random.choice(hex) + random.choice(hex) + random.choice(hex))



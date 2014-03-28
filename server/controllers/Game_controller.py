from server.lib.bottle import Bottle, debug,request
import json
# use the Jinja templating system
from view_helper import JINJA_ENV

import Utility

bottle = Bottle() # create another WSGI application for this controller and resource.
debug(True) #  uncomment for verbose error logging. Do not use in production

@bottle.post('/getNewBoard')
def getNewBoard():
  board = ""
  lan = ""
  solution = ""

  if "text/plain" in request.content_type:
    d = json.loads(request.body.getvalue())
    board = d['board']
    lan = d['language']
    solution = d['solution']
  else:
    board = request.params.get('board')
    lan = request.params.get('language')
    solution = request.params.get('solution')

  tests = ">>> getMove('" + "board" + "') \n 'False'"

  response = json.loads(Utility.invoke_verify(solution,lan,tests))

  return response['results'][0]['received']

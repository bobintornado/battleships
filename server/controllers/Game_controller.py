from server.lib.bottle import Bottle, debug,request
import json
from difflib import Differ 
# use the Jinja templating system
from view_helper import JINJA_ENV

import Utility
from server.models.Bot import Bot
from server.models.GameResult import GameResult 
from google.appengine.ext import ndb

bottle = Bottle() # create another WSGI application for this controller and resource.
debug(True) #  uncomment for verbose error logging. Do not use in production

@bottle.post('/getNewBoard')
def getNewBoard():
  board = ""
  lan = ""
  solution = "" #the code

  if "application/json" in request.content_type:
    d = json.loads(request.body.getvalue())
    board = d['board']
    lan = d['language']
    solution = d['solution']
  else:
    board = request.params.get('board')
    lan = request.params.get('language')
    solution = request.params.get('solution')


  #hide ships up
  board = str(board)
  enemyBoard = str.replace(board, 's','-')

  tests = ""

  if lan == "python":
    tests = ">>> getMove('" + enemyBoard + "') \n '---b--'"
  if lan == "js":
    tests = "assert_equal('---b----', getMove('" + enemyBoard + "'));"
  if lan == "java":
    tests = "assertEquals(" + '"' + "-b--" + '"' + ", getMove(" + '"' + enemyBoard + '"' + "))"
  if lan == "ruby":
    tests = "assert_equal(getMove(), '---b----'))" 
  
  response = json.loads(Utility.invoke_verify(solution,lan,tests))

  if "errors" in response:
    #return str(result['errors'])
    return json.dumps({"status":"error","message":"Your bot cannot be compiled.",
                        "errors":str(response['errors'])})
  elif "error" in response:
    return json.dumps({"status":"error","message":"Your bot cannot be compiled.",
                        "errors":str(response['error'])})
  else:
    #return response
    newEnemyBoard = response['results'][0]['received']

  #return newEnemyBoard

  if moveValidation(board, enemyBoard, newEnemyBoard) == True :
    
    #following checking is more convenient, needs refactor later
    newBoard = ""
    boardList = list(board)
    index = 0

    # crying. so hard to refactor one
    try:
      index = newEnemyBoard.index("b")
    except Exception, e:
      return json.dumps({"status":"error","message":"Place a bomb!","generateStr":newEnemyBoard}) 
    
    #Check Hiting or Missing
    if boardList[index] is 's':
      boardList[index] = 'h' 
    elif boardList[index] is '-':
      boardList[index] = 'm'
    else:
      return json.dumps({"status":"error","message":"Don't waste your bomb! Place it on empty cell only!","generateStr":newEnemyBoard}) 
    
    newBoard = "".join(boardList)
    
    #auto save bot with random name
    q = Bot.query(Bot.code == solution)
    if q.count() == 0:
      #bug unsettled there
      random_bot_name = Utility.random_name_generator() 
      new_bot = Bot(name =random_bot_name, language = lan, code = solution, score = 400)
      new_bot.put()
      return json.dumps({"newBoard":newBoard,"winningStatus":winningStatus(newBoard),"bot":new_bot.to_dict(),"generateStr":newEnemyBoard})
    else:
      bot = q.fetch(1)[0]
      return json.dumps({"newBoard":newBoard,"winningStatus":winningStatus(newBoard),"bot":bot.to_dict(),"generateStr":newEnemyBoard})

  else:
    errorMessage = moveValidation(board, enemyBoard, newEnemyBoard)
    return json.dumps({"status":"error", "message":errorMessage})

def winningStatus(board):
  if "s" in board:
    return False
  else:
    return True

def moveValidation(oldBoard,enemyBoard,newEnemyBoard):
  #validation remains undone
  # x = 0
  # #Production needs to be changed to 50
  # size = 3
  # for i in range(size):
  #   if enemyBoard[i] != newEnemyBoard[i]:
  #     x += 1
  # if x != 1:
  #   return "There are invalid number of cell changed!"
  return True

@bottle.post('/addResult')
def add_result():
  name1 = ""
  name2 = ""
  result = ""

  if "application/json" in request.content_type:
    d = json.loads(request.body.getvalue())
    name1 = d['name1']
    name2 = d['name2']
    result = d['result']
  else:
    name1 = request.params.get('name1')
    name2 = request.params.get('name2')
    result = request.params.get('result')

  q1 = Bot.query(Bot.name == name1)
  q2 = Bot.query(Bot.name == name2)

  bot1 = q1.fetch(1)[0]
  bot2 = q2.fetch(1)[0]

  #saving result

  r = int(result)
  gResult = GameResult(bot1 = bot1.put(), bot2 = bot2.put(), result = r)
  gResult.put()

  #0: name 1 lose, 1:draw, 2:name 1 win
  return update_rating(bot1,bot2,result)

def update_rating(bot1,bot2,result):
  k = 32

  q1 = 10**(bot1.score/400)
  q2 = 10**(bot2.score/400)

  e1 = q1/(q1+q2)
  e2 = q2/(q1+q2)

  if result == "0":
    bot1.score = bot1.score + k * (0 - e1)
    bot2.score = bot2.score + k * (1 - e2)
  elif result == "1":
    bot1.score = bot1.score + k * (0.5 - e1)
    bot2.score = bot2.score + k * (0.5 - e2)
  else:
    bot1.score = bot1.score + k * (1 - e1)
    bot2.score = bot2.score + k * (0 - e2)

  bot1.put()
  bot2.put()

  result = []
  result.append(bot1.to_dict())
  result.append(bot2.to_dict())
  
  return json.dumps(result)















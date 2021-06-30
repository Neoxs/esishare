'''server/app.py - main api app declaration'''
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO, send

'''Main wrapper for app creation'''
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins='*')
CORS(app)


activeUsers = []

##
# Sockets
##

@socketio.on('join')
def handleJoin(user):
  activeUsers.append({'username': user["username"], 'sid': request.sid, 'emoji': user["emoji"]})
  socketio.emit('update', activeUsers, broadcast=True)
  print('new user joined')

@socketio.on('disconnect')
def handleDisc():
  print(activeUsers)
  for key in activeUsers:
    sid = key["sid"]
    if (sid == request.sid) : activeUsers.pop(activeUsers.index(key))
  socketio.emit('update', activeUsers, broadcast=True)



##
# API routes
##

@app.route('/api/items')
def items():
  '''Sample API route for data'''
  return jsonify([{'title': 'A'}, {'title': 'B'}])

##
# View route
##

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

##
# Run App
##
socketio.run(app)
import flask
from flask import jsonify , request
from DBWrapper import DBWrapper
app = flask.Flask(__name__)
app.config["DEBUG"] = True
db = DBWrapper()
@app.route('/getCampigns', methods=['GET'])
def getCampigns():
    #return array of jsons of campigns
    return jsonify(db.getAllCampigns())
@app.route('/startNewCampign', methods=['POST'])
def startNewCampign():
    data = request.json
    print(data)
    db.addNewCampign(data)
    #input - json with relevant info
    return data

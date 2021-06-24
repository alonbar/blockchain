import flask
from DBWrapper import DBWrapper
app = flask.Flask(__name__)
app.config["DEBUG"] = True
db = DBWrapper()
@app.route('/getCampigns', methods=['GET'])
def getCampigns():
    #return array of jsons of campigns
    return db.getAllCampigns()
@app.route('/startNewCampign', methods=['POST'])
def startNewCampign():
    data = request.json
    db.addNewCampign(data)
    #input - json with relevant info
    return data
app.run()

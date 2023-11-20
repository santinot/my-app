from flask import Flask, request, jsonify
from flask_cors import CORS
from SentimentAnalyzer import SentimentAnalyzer
from MongoDB import MongoDB
from bson.json_util import dumps

# Flask App
app = Flask(__name__)
CORS(app)


@app.route('/api/messages/insert', methods=['POST'])
def insertMessage():
    data = request.get_json()
    id, message, score = data["id"], data["message"], data["score"]
    db_connection.insertNewMessage(id, message, score)
    return jsonify({"text" : "New Message Inserted"})


@app.route('/api/messages/get', methods=['GET'])
def getMessages():
    result = list(db_connection.getMessages())
    json_result = dumps(result)
    return(json_result)


@app.route('/api/analysis', methods=['POST'])
def post():
    data = request.get_json()
    response = sentiment_analyzer.sentimentAnalysis(data["message"])
    return jsonify({"value" : str(response)})


if __name__=="__main__":
    # Instance of the analyzer
    sentiment_analyzer = SentimentAnalyzer()

    # Connection to DB
    db_connection = MongoDB()
    print("*MongoDB Server active and running*")

    # Run the app
    app.run(debug=True)
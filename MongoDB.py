# pip install httpcore==0.15.0 httpx==0.25.1 - Avviare server mongodb
from pymongo import MongoClient

class MongoDB:
    def __init__(self, connection_string = "mongodb://localhost:27017"):
        self.client = MongoClient(connection_string)
        self.db = self.client.App
        self.messagesCollection = self.db.messages

    def insertNewMessage(self, id, msg, score):
        new_message = {"id": id, "message": msg, "score": score}
        result = self.messagesCollection.insert_one(new_message)
        print(f"Message inserted with id: {result.inserted_id}")

    def getMessages(self, limit_query = 500):
        results = self.messagesCollection.find().limit(limit_query)
        return results


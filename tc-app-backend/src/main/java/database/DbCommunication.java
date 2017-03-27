package database;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class DbCommunication {

	MongoClient mongoClient;

	public MongoDatabase connectDb() {
		mongoClient = new MongoClient();
		return mongoClient.getDatabase("TcApp");
	}

	public void closeDb() {
		mongoClient.close();
	}

	public void addToCollection(String collectionName, Document entry) {
		MongoDatabase database = connectDb();
		MongoCollection<Document> collection = database.getCollection(collectionName);
		collection.insertOne(entry);
		closeDb();
	}

}

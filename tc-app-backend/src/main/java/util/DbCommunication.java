package util;

import org.bson.Document;

import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class DbCommunication {

	MongoClient mongoClient;
	MongoDatabase database;

	public DbCommunication() {
		mongoClient = new MongoClient();
		database = mongoClient.getDatabase("TcApp");
	}

	public void closeDb() {
		mongoClient.close();
	}

	public void addToCollection(String collectionName, Document entry) {
		MongoCollection<Document> collection = database.getCollection(collectionName);
		collection.insertOne(entry);
		closeDb();
	}

	public Document findOne(String collectionName, Document doc) {
		MongoCollection<Document> collection = database.getCollection(collectionName);
		FindIterable<Document> document = collection.find(doc);
		Document docFound = document.first();
		return docFound;
	}

	public FindIterable<Document> findAll(String collectionName, Document doc) {
		MongoCollection<Document> collection = database.getCollection(collectionName);
		FindIterable<Document> documents = collection.find(doc);
		return documents;
	}

}

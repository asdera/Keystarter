var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/database";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { subscription: "Netflix", user: "Aman", timestamp: "stuff" };
  db.collection("subscription").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 record inserted");
    db.close();
  });
});

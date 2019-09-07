var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb://aman:aids@cluster0-shard-00-00-qc3vq.gcp.mongodb.net:27017,cluster0-shard-00-01-qc3vq.gcp.mongodb.net:27017,cluster0-shard-00-02-qc3vq.gcp.mongodb.net:27017/database?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { subscription: "Netflix", username: "keystarter"};
  db.collection("subscription").remove(myobj, function(err, obj) {
    if (err) throw err;
    console.log(obj.result.n + " record(s) deleted");
    db.close();
    });
  });

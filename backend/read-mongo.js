var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/database";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var myobj = { subscription: "Netflix", username: "rohilgupta" };
  db.collection("subscription")
    .find(myobj)
    .toArray(function(err, res) {
      if (err) throw err;
      console.log(res);
      db.close();
    });
});

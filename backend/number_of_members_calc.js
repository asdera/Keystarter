// Initialize the mongoclient
var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb://aman:aids@cluster0-shard-00-00-qc3vq.gcp.mongodb.net:27017,cluster0-shard-00-01-qc3vq.gcp.mongodb.net:27017,cluster0-shard-00-02-qc3vq.gcp.mongodb.net:27017/database?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";

MongoClient.connect(url, function(err, db) {
// Check if 1. subscription exists in collection subscription_count
if (err) throw err;
var myobj = { subscription: "netflix"};
db.collection("subscription_count")
  .find()
  .toArray()
  .then(items =>
    checkIfExists(items, db, myobj)
  );

});

function checkIfExists(retArr, db, myobj) {
  var number_of_people = 0
  //add number
  retArr.forEach((collection) => {
    console.log(collection);
    if (collection.subscription == myobj.subscription){
      number_of_people = collection.number;
    }
  })
  var subscription = myobj.subscription;
  //keeps a count of where you in the list you are
  var temp_subcount = 0;
  //subscription doesn't exist
  if ((retArr && retArr.length === 0) || !retArr) {
    console.log("Subscription doesn't exist")
  } else {
    db.listCollections().toArray(function(err, collInfos) {
    // collInfos is an array of collection info objects that look like:
      console.log(collInfos);

      collInfos.forEach((collection) => {
        console.log(collection);
        var name = collection.name;
        console.log(name);
        if (name.includes(subscription) && name.includes("#")){

          var temp = parseInt(name.split("#")[1]);
          if (temp_subcount <= temp){
            temp_subcount = temp;
          }
        }
      })

      // check if temp_subcount is 0 if 0 then we init a new collection with format "<subscription>#1"
      if (temp_subcount === 0){
        var collection_name = subscription+"#1"
        db.createCollection(collection_name, function(err, res) {
          if (err) throw err;
          console.log("Collection created : ", collection_name);
        });
      } else{
          var sub = (subscription+"#"+temp_subcount);
          db.collection(sub).find().toArray(function(err, items) {
              console.log("Items : ", items);
              console.log("Len(Items) : ", items.length);
              if (items.length >= number_of_people){
                db.createCollection((subscription+"#"+(temp_subcount+1)), function(err, res) {
                  if (err) throw err;
                  console.log("Collection created : ", (subscription+"#"+(temp_subcount+1)));
                });
              }
          });
        }
    });
  }
}

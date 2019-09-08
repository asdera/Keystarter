var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb://aman:aids@cluster0-shard-00-00-qc3vq.gcp.mongodb.net:27017,cluster0-shard-00-01-qc3vq.gcp.mongodb.net:27017,cluster0-shard-00-02-qc3vq.gcp.mongodb.net:27017/database?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
const Bot = require("keybase-bot");

const bot = new Bot();
const companies = [
  "netflix",
  "hulu",
  "pandora",
  "headspace",
  "apple music",
  "google play",
  "spotify",
  "luminosity",
  "amazon prime",
  "deezer",
  "grammarly",
  "brilliant"
];
const costs = [
  "+4usd",
  "+3usd",
  "+2.5usd",
  "+3.25usd",
  "+3.75usd",
  "+2.5usd",
  "+2.5usd",
  "+3.75usd",
  "+2.5usd",
  "+2.5usd",
  "+7.5usd",
  "+2.5usd"
];

const username = "ourlovelybot";
const paperkey =
  "stock act tobacco maid owner plunge inflict object viable iron hammer hour small";

//const username = "rohilgupta";
//const paperkey =
//  "advice warrior woman slight exhibit before remove fan jar wonder liar next around";

bot
  .init(username, paperkey, { verbose: false })
  .then(() => {
    console.log(
      `Your bot is initialized. It is logged in as ${bot.myInfo().username}`
    );

    const onMessage = messageContent => {
      const { channel, content } = messageContent;
      const plainText = messageContent.content.text.body.toLowerCase();
      const incoming_username = messageContent.sender.username;
      const timestamp = messageContent.sentAt;
      var company;

      for (var i = 0; i < companies.length; i++) {
        if (plainText.includes(companies[i])) {
          company = companies[i];
          cost = costs[i];
          break;
        }
      }

      subscription_count(url, company);
      console.log("subscription_count stuff promise established");

      const addSubscription =
        content.type === "text" &&
        plainText.includes(company) &&
        plainText.includes("subscribe") &&
        !plainText.includes("unsubscribe");

      const unsubscribe =
        content.type === "text" &&
        plainText.includes(company) &&
        plainText.includes("unsubscribe");
      
      const payment =
        content.type === "text" &&
        plainText.includes("+");
      
      const hello =
        content.type === "text" &&
        (plainText.includes("hi") || plainText.includes("hello") || plainText.includes("yo"))
      
      const help =
        content.type === "text" &&
        (plainText.includes("yes") || plainText.includes("sure") || plainText.includes("help"))
      
      const botbalance =
        content.type === "text" &&
        plainText.includes("botbalance")

      addSubscription &&
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          console.log("about to push to subscribe");

          db.collection("subscription")
            .find()
            .toArray()
            .then(items =>
              insertdbCallback(
                items,
                channel,
                timestamp,
                incoming_username,
                db,
                company
              )
            );
        });

      unsubscribe &&
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;

          db.collection("subscription")
            .find()
            .toArray()
            .then(items =>
              deletedbCallback(items, channel, timestamp, incoming_username, db)
            );
        });

      console.log("completed onMessage (promises left to deal with tho)");

      if (payment) {
        bot.chat.send(channel, {
          body: "Thank you for your payment. Your request will be processed shortly!"
        });
      } else if (hello) {
        bot.chat.send(channel, {
          body: "Hello good sir! Are you on the lookout for cheap subscriptions?"
        });
      } else if (help) {
        bot.chat.send(channel, {
          body: "Just ask me to subscribe to any service!"
        });
      } else if (botbalance) {
        bot.chat.send(channel, {
          body: "Botbalance"
        });
      }
    };

    bot.chat.watchAllChannelsForNewMessages(onMessage);
  })
  .catch(error => {
    console.error("ERRRRRRROR:", error);
    console.log("Turning off the robot");
    bot.deinit();
  });

function subscription_count(url, company) {
  MongoClient.connect(url, (err, db) => {
    console.log("entering callback for subscription_count");
    // Check if 1. subscription exists in collection subscription_count
    if (err) throw err;

    var myobj = { subscription: company };
    db.collection("subscription_count")
      .find()
      .toArray()
      .then(items => {
        return checkIfExists(company, items, db, myobj);
      })
      .then(collection_name => {
        console.log("entering callback of callback for subscription_count") &&
          collection_name &&
          db.collection(collection_name).insertOne(myobj, function(err) {
            if (err) throw err;
            console.log("exiting callback of callback for subscription_count");
            console.log("1 record inserted in", collection_name);
          });
      });
    console.log("exiting callback for subscription_count");
  });
}

function deletedbCallback(retArr, channel, timestamp, incoming_username, db) {
  var allCompanies = [];
  retArr.forEach(obj => {
    allCompanies.push(obj["subscription"]);
  });

  // Record doesn't exist
  if (!allCompanies.includes(company)) {
    bot.chat.send(channel, {
      body: "You've already unsubscribed from all subscriptions!"
    });
  } else {
    myobj = {
      subscription: company,
      username: incoming_username,
      timestamp: timestamp
    };

    db.collection("subscription").remove(myobj, function(err, obj) {
      if (err) throw err;
      console.log(obj.result.n + " record(s) deleted");
      bot.chat.send(channel, {
        body: "I will unsubscribe you from " + company + "."
      });
    });
  }
}

function insertdbCallback(
  retArr,
  channel,
  timestamp,
  incoming_username,
  db,
  company
) {
  var allCompanies = [];
  retArr.forEach(obj => {
    allCompanies.push(obj["subscription"]);
  });

  // Record doesn't exist
  if (!allCompanies.includes(company)) {
    console.log("record of", company, "doesn't exist in subscriptions");

    myobj = {
      subscription: company,
      username: incoming_username,
      timestamp: timestamp
    };

    db.collection("subscription").insertOne(myobj, function(err) {
      if (err) throw err;
      console.log("1 record inserted");
      bot.chat.send(channel, {
        body: "Sure, I'll subscribe you to " + company + ".\nPlease pay -" + cost + "-."
      });
    });
  } else {
    console.log("record of", company, "exists in subscriptions");
    bot.chat.send(channel, {
      body: "You're already subscribed!"
    });
  }
}

function checkIfExists(company, retArr, db, myobj) {
  var number_of_people = 0;
  //add number
  retArr.forEach(collection => {
    if (collection.subscription == myobj.subscription) {
      number_of_people = collection.number;
    }
  });
  var subscription = myobj.subscription;
  //keeps a count of where you in the list you are
  var temp_subcount = 0;

  var allCompanies = [];
  retArr.forEach(obj => {
    allCompanies.push(obj["subscription"]);
  });

  //subscription doesn't exist if its not in retArr (subscription_count)
  if (!allCompanies.includes(company)) {
    console.log("Subscription doesn't exist");
  } else {
    console.log("Subscription does exist");
    return db
      .listCollections()
      .toArray()
      .then(collInfos => {
        // collInfos is an array of collection info objects that look like:

        collInfos.forEach(collection => {
          //console.log(collection);
          var name = collection.name;
          //console.log(name);
          if (name.includes(subscription) && name.includes("#")) {
            var temp = parseInt(name.split("#")[1]);
            if (temp_subcount <= temp) {
              temp_subcount = temp;
            }
          }
        });

        // check if temp_subcount is 0 if 0 then we init a new collection with format "<subscription>#1"
        if (temp_subcount === 0) {
          console.log("temp_subcount is 0");
          var collection_name = subscription + "#1";
          db.createCollection(collection_name, function(err) {
            if (err) throw err;
          });

          return collection_name;
        } else {
          var sub = subscription + "#" + temp_subcount;
          db.collection(sub)
            .find()
            .toArray(function(items) {
              if (items && items.length >= number_of_people) {
                db.createCollection(
                  subscription + "#" + (temp_subcount + 1),
                  function(err, res) {
                    if (err) throw err;
                    console.log(
                      "Collection created : ",
                      subscription + "#" + (temp_subcount + 1)
                    );
                    res();
                  }
                );
              }
            });
        }
      })
      .then(retVal => {
        return retVal;
      });
  }
}

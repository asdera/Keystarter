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

const username = "ourlovelybot";
const paperkey =
  "stock act tobacco maid owner plunge inflict object viable iron hammer hour small";

//const username = "rohilgupta";
//const paperkey =
//  "advice warrior woman slight exhibit before remove fan jar wonder liar next around";
(async function() {
  bot
    .init(username, paperkey, { verbose: false })
    .then(async () => {
      console.log(
        `Your bot is initialized. It is logged in as ${bot.myInfo().username}`
      );

      const onMessage = async messageContent => {
        const { channel, content } = messageContent;
        const plainText = messageContent.content.text.body.toLowerCase();
        const incoming_username = messageContent.sender.username;
        const timestamp = messageContent.sentAt;
        var company;

        for (var i = 0; i < companies.length; i++) {
          if (plainText.includes(companies[i])) {
            company = companies[i];
            console.log("found company", company);
            break;
          }
        }

        await subscription_count(url, company);

        const addSubscription =
          content.type === "text" &&
          plainText.includes(company) &&
          plainText.includes("subscribe") &&
          !plainText.includes("unsubscribe");

        const unsubscribe =
          content.type === "text" &&
          plainText.includes(company) &&
          plainText.includes("unsubscribe");

        addSubscription &&
          (await MongoClient.connect(url, async function(err, db) {
            if (err) throw err;

            await db
              .collection("subscription")
              .find()
              .toArray()
              .then(async items => {
                console.log("GOT HEREREEE", items);
                await insertdbCallback(
                  items,
                  channel,
                  timestamp,
                  incoming_username,
                  db,
                  company
                );
              });
          }));

        unsubscribe &&
          (await MongoClient.connect(url, async function(err, db) {
            if (err) throw err;

            await db
              .collection("subscription")
              .find()
              .toArray()
              .then(
                async items =>
                  await deletedbCallback(
                    items,
                    channel,
                    timestamp,
                    incoming_username,
                    db
                  )
              );
          }));
      };

      await bot.chat.watchAllChannelsForNewMessages(onMessage);
    })
    .catch(error => {
      console.error(error);
      bot.deinit();
    });

  async function subscription_count(url, company) {
    await MongoClient.connect(url, async (err, db) => {
      // Check if 1. subscription exists in collection subscription_count
      if (err) throw err;
      var myobj = { subscription: company };
      await db
        .collection("subscription_count")
        .find()
        .toArray()
        .then(async items => {
          return await checkIfExists(items, db, myobj);
        })
        .then(async collection_name => {
          await db.collection(collection_name).insertOne(myobj, function(err) {
            if (err) throw err;
            console.log("1 record inserted in", collection_name);
          });
        });
    });
  }

  async function deletedbCallback(
    retArr,
    channel,
    timestamp,
    incoming_username,
    db
  ) {
    // Record doesn't exist
    if ((retArr && retArr.length === 0) || !retArr) {
      //console.log("retArr is: ", retArr);
      bot.chat.send(channel, {
        body: "You've already unsubscribed from all subscriptions!"
      });
    } else {
      myobj = {
        subscription: company,
        username: incoming_username,
        timestamp: timestamp
      };

      await db.collection("subscription").remove(myobj, function(err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " record(s) deleted");
        bot.chat.send(channel, {
          body: "I will unsubscribe you from " + company + "."
        });
      });
    }
  }

  async function insertdbCallback(
    retArr,
    channel,
    timestamp,
    incoming_username,
    db,
    company
  ) {
    console.log("in insertdbCallback");
    // Record doesn't exist
    if ((retArr && retArr.length === 0) || !retArr) {
      console.log("record doesn't exist!?!?!?!?!!?");

      myobj = {
        subscription: company,
        username: incoming_username,
        timestamp: timestamp
      };

      await db.collection("subscription").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 record inserted");
        bot.chat.send(channel, {
          body: "Sure, I'll subscribe you to " + company + "."
        });
      });
    } else {
      console.log("");
      await bot.chat.send(channel, {
        body: "You're already subscribed!"
      });
    }
  }

  async function checkIfExists(retArr, db, myobj) {
    var number_of_people = 0;
    //add number
    retArr.forEach(collection => {
      //console.log(collection);
      if (collection.subscription == myobj.subscription) {
        number_of_people = collection.number;
      }
    });
    var subscription = myobj.subscription;
    //keeps a count of where you in the list you are
    var temp_subcount = 0;
    //subscription doesn't exist
    if ((retArr && retArr.length === 0) || !retArr) {
      console.log("Subscription doesn't exist");
    } else {
      console.log("Subscription does exist");
      return await db
        .listCollections()
        .toArray()
        .then(async collInfos => {
          // collInfos is an array of collection info objects that look like:
          console.log(collInfos);

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
            await db.createCollection(collection_name, function(err) {
              if (err) throw err;
              console.log("Collection created:", collection_name);
            });

            console.log("collection_name", collection_name);

            return collection_name;
          } else {
            var sub = subscription + "#" + temp_subcount;
            await db
              .collection(sub)
              .find()
              .toArray(async function(items) {
                //console.log("Items : ", items);
                //console.log("Len(Items) : ", items.length);
                if (items.length >= number_of_people) {
                  await db.createCollection(
                    subscription + "#" + (temp_subcount + 1),
                    function(err, res) {
                      if (err) throw err;
                      console.log(
                        "Collection created : ",
                        subscription + "#" + (temp_subcount + 1)
                      );
                    }
                  );
                }
              });
          }
        })
        .then(retVal => {
          console.log("last one", retVal);
          return retVal;
        });
    }
  }
})();

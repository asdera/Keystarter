var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb://aman:aids@cluster0-shard-00-00-qc3vq.gcp.mongodb.net:27017,cluster0-shard-00-01-qc3vq.gcp.mongodb.net:27017,cluster0-shard-00-02-qc3vq.gcp.mongodb.net:27017/database?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority";
const Bot = require("keybase-bot");

const bot = new Bot();
const username = 'keystarter'
const paperkey = 'title language transfer athlete boost iron version asthma camp knife movie blanket mixed'
bot
  .init(username, paperkey, { verbose: false })
  .then(() => {
    console.log(
      `Your bot is initialized. It is logged in as ${bot.myInfo().username}`
    );

    // Reply to all messages between you and `kbot` with 'thanks!'
    const channel = {
      name: "kbot," + bot.myInfo().username,
      public: false,
      topicType: "chat"
    };

    const onMessage = messageContent => {
      const { channel, content } = messageContent;
      const plainText = messageContent.content.text.body.toLowerCase();
      const incoming_username = messageContent.sender.username;
      const timestamp = messageContent.sentAt;
      const addSubscription =
        content.type === "text" &&
        plainText.includes("netflix") &&
        plainText.includes("subscribe") &&
        !plainText.includes("unsubscribe");

      const unsubscribe =
        content.type === "text" &&
        plainText.includes("netflix") &&
        plainText.includes("unsubscribe");

      addSubscription && console.log("user wants to add a subscription");

      addSubscription &&
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;

          //var myobj = { subscription: "Netflix", username: incoming_username };
          db.collection("subscription")
            .find()
            .toArray()
            .then(items =>
              insertdbCallback(items, channel, timestamp, incoming_username, db)
            );
        })
        unsubscribe &&
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;

          //var myobj = { subscription: "Netflix", username: incoming_username };
          db.collection("subscription")
            .find()
            .toArray()
            .then(items =>
              deletedbCallback(items, channel, timestamp, incoming_username, db)
            );
        });
    };

    bot.chat.watchChannelForNewMessages(channel, onMessage);
  })
  .catch(error => {
    console.error(error);
    bot.deinit();
  });

  function deletedbCallback(retArr, channel, timestamp, incoming_username, db) {
    // Record doesn't exist
    if ((retArr && retArr.length === 0) || !retArr) {
      console.log("retArr is: ", retArr);
      bot.chat.send(channel, {
        body: "You've already unsubscribed from all subscriptions!"
      });
    } else {
      myobj = {
        subscription: "Netflix",
        username: incoming_username,
        timestamp: timestamp
      };

      db.collection("subscription").remove(myobj, function(err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " record(s) deleted");
        bot.chat.send(channel, {
          body: "I will unsubscribe you to Netflix immediately."
        });
      });
    }
  }

function insertdbCallback(retArr, channel, timestamp, incoming_username, db) {
  // Record doesn't exist
  if ((retArr && retArr.length === 0) || !retArr) {
    myobj = {
      subscription: "Netflix",
      username: incoming_username,
      timestamp: timestamp
    };

    db.collection("subscription").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      bot.chat.send(channel, {
        body: "I will subscribe you to Netflix immediately."
      });
    });
  } else {
    console.log("retArr is: ", retArr);
    bot.chat.send(channel, {
      body: "You're already subscribed!"
    });
  }
}

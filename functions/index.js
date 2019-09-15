const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.updateStats = functions.firestore
  .document("round_scores/{round_scoresId}")
  .onCreate((roundScore, context) => {
    const data = roundScore.data();
    console.log({ data });
    const db = admin.firestore();
    return db
      .collection("users")
      .doc(data.playerId)
      .get()
      .then(playerSnap => {
        const player = playerSnap.data();
        console.log({ player });
        const {
          lastRoundScore,
          lastRoundDate,
          lowestScore,
          highestScore
        } = player;

        let lastRD = lastRoundDate || data.date.toDate();
        let lastRS = lastRoundScore || data.score;
        let lowest = lowestScore || data.score;
        let highest = highestScore || data.score;

        console.log("hjere", { lastRS, lastRD, lowest, highest });

        if (lastRoundDate && data.date.toDate() >= lastRoundDate.toDate()) {
          lastRS = data.score;
          lastRD = data.date;
        }

        if (
          lowestScore &&
          parseInt(data.score, 10) <= parseInt(lowestScore, 10)
        ) {
          lowest = data.score;
        }

        if (
          highestScore &&
          parseInt(data.score, 10) >= parseInt(highestScore, 10)
        ) {
          highest = data.score;
        }

        console.log({ lastRS, lastRD, lowest, highest });
        return { lastRS, lastRD, lowest, highest };
      })
      .then(stats => {
        return db
          .collection("users")
          .doc(data.playerId)
          .update({
            lastRoundScore: stats.lastRS,
            lastRoundDate: stats.lastRD,
            lowestScore: stats.lowest,
            highestScore: stats.highest
          });
      })
      .catch(error => {
        return console.log("Error updating stats", error);
      });
  });

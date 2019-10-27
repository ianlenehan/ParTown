/* eslint-disable prettier/prettier */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment');

admin.initializeApp();

exports.updateStats = functions.firestore
  .document('round_scores/{round_scoresId}')
  .onCreate((roundScore, context) => {
    const data = roundScore.data();
    console.log({ data });
    const db = admin.firestore();
    return db
      .collection('users')
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

        console.log('here', { lastRS, lastRD, lowest, highest });

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
          .collection('users')
          .doc(data.playerId)
          .update({
            lastRoundScore: stats.lastRS,
            lastRoundDate: stats.lastRD,
            lowestScore: stats.lowest,
            highestScore: stats.highest
          });
      })
      .catch(error => {
        return console.error('Error updating stats', error);
      });
  });

exports.sendNewRoundNotification = functions.firestore
  .document('rounds/{round_id}')
  .onCreate(async event => {
    const roundData = event.data();
    const loserPoints = roundData.scores[roundData.loser.id];
    const payload = {
      notification: {
        title: 'New Result Added',
        body: `${roundData.loser.fullName} lost this one with ${loserPoints} points ${roundData.loser.emoji}😆.`
      }
    };
    const db = admin.firestore();
    const tournamentSnap = await db
      .collection(`tournaments`)
      .doc(roundData.tournamentId)
      .get();

    console.log('TCL: tournamentSnap', tournamentSnap);

    const players = tournamentSnap.data().players;
    console.log('TCL: players', players);

    const playerTokens = Object.keys(players).map(playerId => {
      return players[playerId].fcmToken;
    });
    const tokens = playerTokens.filter(t => t);
    console.log('TCL: tokens', playerTokens, tokens);

    return admin.messaging().sendToDevice(tokens, payload);
  });

exports.sendNewAvailabilityNotification = functions.firestore
  .document('scheduledRounds/{scheduled_round_id}')
  .onCreate(async event => {
    const roundData = event.data();
    const roundDate = moment(roundData.date.toDate()).format('D MMM');
    const payload = {
      notification: {
        title: 'Can You Play?',
        // eslint-disable-next-line prettier/prettier
        body: `${roundData.createdBy} has scheduled a new round for ${roundDate}. Open the app and let them know if you can play or not.`
      }
    };
    const db = admin.firestore();
    const tournamentSnap = await db
      .collection(`tournaments`)
      .doc(roundData.tournamentId)
      .get();

    console.log('TCL: tournamentSnap', tournamentSnap);

    const players = tournamentSnap.data().players;
    console.log('TCL: players', players);

    const playerTokens = Object.keys(players).map(playerId => {
      return players[playerId].fcmToken;
    });
    const tokens = playerTokens.filter(t => t);
    console.log('TCL: tokens', playerTokens, tokens);

    return admin.messaging().sendToDevice(tokens, payload);
  });

import config from "./config";
import firebase from "firebase";
import {
  currentTime,
  dateToday,
  idDate,
} from "../assets/resources/date-handler";

firebase.initializeApp(config());
firebase.analytics();

export const _firebase = firebase;
export const _database = firebase.database();
export const _storage = firebase.storage();
export const _auth = firebase.auth();

firebase.analytics();

export const validField = (x) => {
  return x.length !== 0;
};

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const logEvent = async (ac, path) => {
  const log = {
    action: ac,
    date: dateToday(),
    time: currentTime(),
    userId: _auth.currentUser.email,
  };
  var done = false;
  await _database
    .ref("records/" + path + "/")
    .child(idDate())
    .set(log)
    .then(() => {
      done = true;
    });
  return done;
};

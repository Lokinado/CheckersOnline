const bcrypt = require('bcryptjs');
const saltRounds = 10;
import { log } from './Logger';
import db = require('./Database');

let passport;

export async function preprocessPassword( password: string ){
    let hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

export function getPassport() {
  if (passport == null) {
    passport = passportConfig();
  }

  return passport;
}

export async function addUser(username, password) {
  log.info("Add user '" + username + "'");
  try {
    let hash = await bcrypt.hash(password, saltRounds);
    db.addUser(username, hash);
  } catch(err) {
    log.error(err);
    return;
  }
}

export async function userExists( username : string ) {
  let result = await db.getUser(username);
  return result.length !== 0;
}

export async function getPassword( username : string ) {
  let result = await db.getUser(username);
  return result[0].pass;
}

export async function validateUser(username, password) {
  // log.info("Validate " + username);
  if (!await userExists(username)) {
    log.info("User '" + username + "' does not exist");
    return false;
  }

  let hashedPassword = await getPassword(username);

  let result;

  try {
    result = await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    log.error(err);
    return false;
  }

  return result;
}

function passportConfig() {
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  passport.serializeUser((user, callback) => {
    // log.info("Serialize " + JSON.stringify(user));
    callback(null, user.username);
  });

  passport.deserializeUser(async (username, callback) => {
    // log.info("Deserialize " + username);
    let user = {
      username: username,
      password: await getPassword(username),
    };
    // log.info("Deserialized " + JSON.stringify(user));
    callback(null, user);
  });
  
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      // log.info("Local Strategy " + username + " " + password);
      if (await validateUser(username, password)) {
        done(null, {
          username : username,
          password : password,
        });
      } else {
        log.info("Wrong password");
        done(null, false);
      }
  }));

  return passport;
}

export function verifyRequest() {
  return function(req, res, next) {
    // { // pass everyone, for development purposes only
    //   next();
    //   return;
    // }
    
    // check if session is established
    if (!req.isAuthenticated()) {
      log.warn("Access denied");
      res.status(400).send();
      return;
    }
    
    // everything ok, we can move on
    next();
  }
}

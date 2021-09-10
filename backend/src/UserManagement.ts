import auth = require('./Auth');
import { log } from './Logger';

let passport = auth.getPassport();

// login user, establish session
export function login(req, res) {
  log.req("Log in " + JSON.stringify(req.body));

  passport.authenticate('local', (err, user) => {
  if (err) {
    log.error(err);
    return;
  }

  // wrong login or password
  if (user == false) {
    log.res("Login failed");
    res.status(400).send(); 
    return;
  } 

  // ok 
  req.logIn(user, (err) => {
    if (err) {
        log.error(err);
        return;
    }

    let resp = {username: user.username}
    log.res("Logged in " + JSON.stringify(resp));

    res.send("OK");
  });


  })(req, res);
}

// get information about session with given request
export function session(req, res) {
  log.req("Get user session");
  if (req.user) {
    log.res("User session '" + req.user.username + "'");
    res.send(JSON.stringify({username: req.user.username}));
  } else {
    log.res("No user session");
    res.send(JSON.stringify({username: req.user}));
  }
}

  // logout user
export function logout(req, res) {
  let resp;
  if (req.user) {
      log.req("Logout '" + req.user.username + "'");
      resp = "Logged out '" + req.user.username + "'";
  } else {
      log.req("Logout no one");
      resp = "Logged out no one";
  }
  req.logout();
  log.res(resp);
  res.send(resp);
}

export async function signup(req, res) {
  log.req("Create user " + JSON.stringify(req.body));

  if (await auth.userExists(req.body.username)) {
    log.res("User '" + req.body.username + "' already exists");
    res.status(400).send();
    return;
  }

  await auth.addUser(req.body.username, req.body.password);

  log.res("Created user '" + req.body.username + "'");

  passport.authenticate('local', (err, user) => {
    if (err) {
      log.error(err);
      return;
    }

    // wrong login or password
    if (user == false) {
      log.res("Login failed");
      return;
    } 

    // ok 
    req.logIn(user, (err) => {
      if (err) {
        log.error(err);
        return;
      }

      let resp = {username: user.username}
      log.res("Logged in " + JSON.stringify(resp));
      res.send("OK");
    });
  })(req, res);
}
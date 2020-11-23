/**
 * Created by 8032 on 26/02/2016.
 */
var passport = require('passport'), //include passport
LocalStrategy = require('passport-local').Strategy,
bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ id: id } , function (err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },

  ///______________________________ fonction pour tester l'email et le mot de passe
  function(email, password, done)
  {
    User.findOne({ email: email }, function (err, user) // mtady an le user
    {
      if (err) //ra mis erreur
      {
        return done(err); // le erreur n retournena
      }
      if (!user) // si l'email n'exuiste pas
      {
        return done(null, false, { message: 'Email invalide.' }); //afficher email invalide
      }

      bcrypt.compare(password, user.password, function (err, res) // comparaison password aver use.password (bcrypt: hashage du mdp)
      {
        if (!res) //si les deux mdp ne se ressemblent pas
        {
          return done(null, false, { message: 'Mot de passe invalide'});//affiachage mdp invalide
        }
        //else sinon
        var returnUser = { //varible de retour: user
          email: user.email, // affiche m'email de l'user
          createdAt: user.createdAt, //affiche l'heure, date de la creation de l'user
          id: user.id //affiche d'id de l'user
        };
        return done(null, returnUser, {message: 'Bienvenue!'}); //affichage bienvenue
      });
    });
  }
  ///__________________________________fin function
));

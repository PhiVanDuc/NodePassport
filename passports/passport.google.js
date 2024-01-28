var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const { User, Provider } = require('../models/index');

module.exports = new GoogleStrategy({
    clientID: "544176344342-o9vnp0c4c27hmmnaso9u27hdv2pdnqvr.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://node-passport.vercel.app/auth/google/callback",
    scope: ['profile', 'email'],
  },
  async function(request, accessToken, refreshToken, profile, done) {
    const info = profile._json;

    let user = await User.findOne({
      where: {
        email: info.email,
      },
      include:{
        model: Provider,
        where: {
          name: 'google'
        }
      }
    });

    if (!user) {
      await Provider.create({
        name: 'google'
      });

      const id = await Provider.max('id');
      await User.create({
        provider_id: +id,
        name: info.name,
        email: info.email,
        status: true,
      });

      user = await User.findOne({
        where: {
          email: info.email,
        },
        include:{
          model: Provider,
          where: {
            name: 'google'
          }
        }
      });
    }
    
    return done(null, user);
  }
)
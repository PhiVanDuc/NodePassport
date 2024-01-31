var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const { User, Provider } = require('../models/index');

module.exports = new GoogleStrategy({
    clientID: "544176344342-o9vnp0c4c27hmmnaso9u27hdv2pdnqvr.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback",
    scope: ['profile', 'email'],
  },
  async function(request, accessToken, refreshToken, profile, done) {
    const { displayName, email } = profile;

    const [provider] = await Provider.findOrCreate({
      where: {
        name: 'google'
      },
      defaults: {
        name: 'google'
      }
    });

    if (!provider) {
      return done(null, false, {
        message: 'Provider không tồn tại!',
      });
    }

    const [user] = await User.findOrCreate({
      where: {
        email,
      },
      include: [
        {
          model: Provider,
          where: {
            name: 'google'
          }
        }
      ],
      defaults: {
        provider_id: provider.id,
        name: displayName,
        email,
        status: true
      }
    });

    if (!user) {
      return done(null, false, {
        message: 'Đã có lỗi xảy ra!',
      });
    }
    
    return done(null, user);
  }
)
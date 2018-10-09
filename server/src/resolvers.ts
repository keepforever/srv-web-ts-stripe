import { IResolvers } from 'graphql-tools';
import { User } from './entity/User';
import * as bcrypt from 'bcryptjs';

export const resolvers: IResolvers = {
  Query: {
    hello: () => "hi",
    me: (_,__, { req } ) => {
      if(!req.session.userId) {
        console.log('no user id session')
        return null
      }
      
      return User.findOne(req.session.userId)
    }
  }, 
  Mutation: {
    // first arg, "parent", we pass "_" because don't care about it
    register: async (_, {email, password}) => {
      // hash password for security, bcrypt.hash() is async func
      const hashedPassword = await bcrypt.hash(password, 10 )
      await User.create({
        email, 
        password: hashedPassword
      // must call save to persist user in the Database. 
      }).save()
      // return true because we specified a "Boolean" in Mutation def
      return true
    },
    login: async (_, {email, password}, { req }) => {
      
      // verify email and password match database entry
      // use findOne() over find() in this use case. 
      // find() is for many results and returns an array
      const user = await User.findOne({ where: { email } });
      if(!user) {
        return null
      }

      // make sure password is correct
      const valid = await bcrypt.compare(password, user.password)

      if(!valid) {
        return null
      }

      // express sessions knows to add a cookie to the user
      req.session.userId = user.id

      return user
    }
  }
}
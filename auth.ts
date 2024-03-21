import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

/**
 * It's good practice to hash passwords before storing them in a database. 
 * Hashing converts a password into a fixed-length string of characters, which appears random, 
 * providing a layer of security even if the user's data is exposed.
 *
 * In your seed.js file, you used a package called bcrypt to hash the user's password before storing it in the database. 
 * You will use it again later in this chapter to compare that the password entered by the user 
 * matches the one in the database. 
 * However, you will need to create a separate file for the bcrypt package. 
 * This is because bcrypt relies on Node.js APIs not available in Next.js Middleware.
 *
 * Create a new file called auth.ts that spreads your authConfig object:
 */
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  /* Next, you will need to add the providers option for NextAuth.js. providers is an array 
  where you list different login options such as Google or GitHub. 
  For this course, we will focus on using the Credentials provider only. *
  
  Node : Although we're using the Credentials provider, it's generally recommended to use 
  alternative providers such as OAuth or email providers. See the NextAuth.js docs for a full list of options.
  */
  providers: [Credentials({})]
});
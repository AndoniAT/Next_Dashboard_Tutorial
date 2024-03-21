<h1 style="text-align:center"> NEXT.JS Course</h1>
<h6 style="text-align:center">Andoni ALONSO TORT</h6>
<br/>
Tutorial from the official site of [Nextjs](https://nextjs.org/learn/dashboard-app).

To run the project :
    - `npm install`
    - `npm run dev`


Si vous voulez vour les erreurs d'accesibilité à l'aide de eslin, exécuter la commande `npm run lint`.

    If for exemple, we have an Image without alt attribute, lint will detect it and prevent you with the following message like this below:

    ./app/ui/invoices/table.tsx
    88:23  Warning: Image elements must have an alt prop, either with meaningful text, or an empty string for decorative images.  jsx-a11y/alt-text

    If you tried to deploy your application to Vercel, the warning would also show up in the build logs. 


<h2>NextAuth.js</h2>

We will be using NextAuth.js to add authentication to our application. 

NextAuth.js abstracts away much of the complexity involved in managing sessions, sign-in and sign-out, and other aspects of authentication. While you can manually implement these features, the process can be time-consuming and error-prone. NextAuth.js simplifies the process, providing a unified solution for auth in Next.js applications.

    > npm install next-auth@beta

    installing the beta version of NextAuth.js, which is compatible with Next.js 14.

Next, generate a secret key for your application. This key is used to encrypt cookies, ensuring the security of user sessions. You can do this by running the following command in your terminal:

    > openssl rand -base64 32

Then, in your .env file, add your generated key to the AUTH_SECRET variable:

    AUTH_SECRET=your-secret-key

For auth to work in production, you'll need to update your environment variables in your Vercel project too. Check out this [guide](https://vercel.com/docs/projects/environment-variables) on how to add environment variables on Vercel.

<h5>Try it out</h5>
Now, try it out. You should be able to log in and out of your application using the following credentials:

Email: user@nextmail.com
Password: 123456

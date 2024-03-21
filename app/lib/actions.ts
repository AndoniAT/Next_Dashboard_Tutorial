'use server';
/**
 * To handle type validation, you have a few options. 
 * While you can manually validate types, 
 * using a type validation library can save you time and effort. 
 * For your example, we'll use Zod, a TypeScript-first 
 * validation library that can simplify this task for you.
 */
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

/**
 * In your actions.ts file, import Zod and define a schema 
 * that matches the shape of your form object. This schema will validate the formData 
 * before saving it to a database.
 */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
      invalid_type_error: 'Please select a customer.', /*  Zod already throws an error if the customer field is empty as it expects a type string. But let's add a friendly message if the user doesn't select a customer.*/
    }),
    amount: z.coerce.number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }), /* Since you are coercing the amount type from string to number, it'll default to zero if the string is empty. Let's tell Zod we always want the amount greater than 0 with the .gt() function. */
    status: z.enum(['pending', 'paid'], {
      invalid_type_error: 'Please select an invoice status.', /* Zod already throws an error if the status field is empty as it expects "pending" or "paid". Let's also add a friendly message if the user doesn't select a status */
    }),
    date: z.string(),
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};
   
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

/* We add
formData - same as before.
prevState - contains the state passed from the useFormState hook. You won't be using it in the action in this example, but it's a required prop.
*/
export async function createInvoice(prevState: State, formData: FormData) {
    //const { customerId, amount, status } = CreateInvoice.parse({
      /* safeParse() will return an object containing either a success or error field 
      This will help handle validation more gracefully without having put this logic inside the try/catch block.
      */
    const validatedFields = CreateInvoice.safeParse({ 
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    // If form validation fails, return errors early. Otherwise, continue.
    if (!validatedFields.success) {
      /* If validatedFields isn't successful, we return the function early with the error messages from Zod.*/ 
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Create Invoice.',
      };
    }
    
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;

    //It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
      await sql`
          INSERT INTO invoices (customer_id, amount, status, date)
          VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
      `;
    } catch( e ) {
      return {
        message: 'Database Error: Failed to Create Invoice.',
      };
    }

    revalidatePath('/dashboard/invoices'); // Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.
    redirect('/dashboard/invoices');
}
 
export async function updateInvoice(
  id: string, 
  prevState: State,
  formData: FormData) {
    
    const validatedFields = UpdateInvoice.safeParse({ 
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });

     // If form validation fails, return errors early. Otherwise, continue.
     if (!validatedFields.success) {
      /* If validatedFields isn't successful, we return the function early with the error messages from Zod.*/ 
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Missing Fields. Failed to Update Invoice.',
      };
    }
   
    // Prepare data for insertion into the database
    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
   
    try {
      await sql`
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
      `;
    } catch( e ) {
      return {
        message: 'Database Error: Failed to Update Invoice.',
      };
    }
   
    revalidatePath('/dashboard/invoices'); //  clear the client cache and make a new server request.
    redirect('/dashboard/invoices'); //  redirect the user to the invoice's page.
  }

export async function deleteInvoice(id: string) {
    //throw new Error('Failed to Delete Invoice');

    try {
      await sql`DELETE FROM invoices WHERE id = ${id}`;
      // Since this action is being called in the /dashboard/invoices path, 
      // you don't need to call redirect. 
      // Calling revalidatePath will trigger a new server request 
      // and re-render the table.
      revalidatePath('/dashboard/invoices');
      return { message: 'Deleted Invoice.' };
    } catch( e ) {
      return {
        message: 'Database Error: Failed to Delete Invoice.',
      };
    }
}

 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
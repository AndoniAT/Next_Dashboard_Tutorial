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
/**
 * In your actions.ts file, import Zod and define a schema 
 * that matches the shape of your form object. This schema will validate the formData 
 * before saving it to a database.
 */
const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
  });
   
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    
    //It's usually good practice to store monetary values in cents in your database to eliminate JavaScript floating-point errors and ensure greater accuracy.
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    await sql`
        INSERT INTO invoices (customer_id, amount, status, date)
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;

    revalidatePath('/dashboard/invoices'); // Once the database has been updated, the /dashboard/invoices path will be revalidated, and fresh data will be fetched from the server.
    redirect('/dashboard/invoices');
}

 
export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   
    const amountInCents = amount * 100;
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices'); //  clear the client cache and make a new server request.
    redirect('/dashboard/invoices'); //  redirect the user to the invoice's page.
  }

  export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;

    // Since this action is being called in the /dashboard/invoices path, 
    // you don't need to call redirect. 
    // Calling revalidatePath will trigger a new server request 
    // and re-render the table.
    revalidatePath('/dashboard/invoices');
  }
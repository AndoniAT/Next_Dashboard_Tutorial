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
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import nodemailer from 'nodemailer'
import { createClient as createAdminClient } from '@supabase/supabase-js'

async function sendEmail(to: string, subject: string, html: string) {
  try {
    console.log(`[EMAIL] Attempting to send email to: ${to}`);
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_APP_PASSWORD!, 
      },
    });

    const info = await transporter.sendMail({
      from: '"Resume Platform" <nidhi.singh.connect@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    });

    console.log('[EMAIL] Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EMAIL] Email failed:', error);
    return { success: false, error };
  }
}

export async function updateResume(formData: FormData) {
  const supabase = await createClient()

  const { data: { user: adminUser } } = await supabase.auth.getUser()
  if (!adminUser || !(await isAdmin(adminUser.id))) {
    throw new Error('Not authorized')
  }
  
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  const notes = formData.get('notes') as string
  const score = formData.get('score') ? Number(formData.get('score')) : null
  const userId = formData.get('userId') as string

  if (!id || !status || !userId) {
    return redirect(`/admin/resume/${id}?error=missing_fields`)
  }

  const { error } = await supabase
    .from('resumes')
    .update({ status, notes, score })
    .eq('id', id)

  if (error) {
    console.error('Update failed:', error)
    return redirect(`/admin/resume/${id}?error=update_failed`)
  }

  try {
    console.log(`[DEBUG] Starting email process for resume ${id}`);
    
    const supabaseAdmin = createAdminClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (userError || !userData?.user?.email) {
      console.error('[DEBUG] Could not get user email:', userError);
      throw new Error('Could not retrieve user email');
    }
    
    const userEmail = userData.user.email;
    console.log(`[DEBUG] Sending email to: ${userEmail}`);

    const emailResult = await sendEmail(
      userEmail,
      'Resume Status Update',
      `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #4f46e5; padding-bottom: 10px;">
          Resume Status Update
        </h2>
        <p>Hello,</p>
        <p>Your resume submission has been reviewed and the status has been updated to:</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <strong style="color: #4f46e5; font-size: 18px;">${status}</strong>
        </div>
        ${notes ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #333;">Reviewer's Notes:</h3>
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            ${notes}
          </div>
        </div>
        ` : ''}
        ${score ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #333;">Score:</h3>
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
            <strong style="color: #059669; font-size: 24px;">${score} points</strong>
          </div>
        </div>
        ` : ''}
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Thank you for using our Resume Review Platform!
          </p>
          <p style="color: #6b7280; font-size: 12px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
      `
    );

    if (emailResult.success) {
      console.log(`[DEBUG] Email sent successfully to ${userEmail}`);
    } else {
      console.error(`[DEBUG] Email failed to send:`, emailResult.error);
    }
    
  } catch (emailError) {
    console.error('[DEBUG] Email process failed:', emailError);
  }
  
  revalidatePath('/admin')
  revalidatePath(`/admin/resume/${id}`)
  redirect('/admin')
}

export async function testEmailSetup() {
  try {
    const result = await sendEmail(
      'nidhi.singh.connect@gmail.com',
      'Email Setup Test',
      `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Test Successful!</h2>
        <p>Your Nodemailer setup is working correctly.</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      </div>
      `
    );
    
    console.log('Test email result:', result);
    return result;
  } catch (error) {
    console.error('Test email failed:', error);
    return { success: false, error };
  }
}
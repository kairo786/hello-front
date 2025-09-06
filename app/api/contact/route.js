import nodemailer from 'nodemailer';


export async function POST(req) {
  const { name, inputemail, message ,email } = await req.json();
  

  // Transporter setup (secure server side)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MY_EMAIL,       // apna gmail
      pass: process.env.APP_PASSWORD,   // Gmail App password
    },
  });

  try {
    // 1. Aapko (Admin) ko email
   await transporter.sendMail({
  from: `"Hello Web" <${process.env.MY_EMAIL}>`,
  to: process.env.MY_EMAIL,
  subject: `📩 New Contact from ${name}`,
  html: `
    <div style="font-family: Arial, sans-serif; padding:20px; color:#333; background:#f9f9f9;">
      <h2 style="color:#4F46E5;">📥 New Contact Request</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>INPUT Email:</b> ${inputemail}</p>
      <p><b>Message:</b></p>
      <blockquote style="border-left:4px solid #4F46E5; margin:10px 0; padding-left:10px; color:#555;">
        ${message}
      </blockquote>
      <hr style="margin:20px 0;"/>
      <p style="font-size:12px; color:#888;">This email was sent automatically by Hello Web.</p>
    </div>
  `,
});


    // 2. User ko confirmation email
    await transporter.sendMail({
  from: `"Hello" <${process.env.MY_EMAIL}>`,
  to: email,
  subject: "Thank you for contacting Hello",
  html: `
    <div style="font-family: Arial, sans-serif; padding:20px; background:#fff; border:1px solid #eee; border-radius:8px;">
      <div style="text-align:center;">
        <img src="https://i.ibb.co/bt0zYVL/helloicon.png" alt="Hello Web Logo" width="120" style="margin-bottom:15px;" />
      </div>
      <h2 style="color:#4F46E5;">Hello ${name}, 👋</h2>
      <p style="font-size:15px; color:#333;">Thank you for reaching out. We have received your message:</p>
      <blockquote style="border-left:4px solid #4F46E5; margin:10px 0; padding-left:10px; color:#555;">
        ${message}
      </blockquote>
      <p style="margin-top:20px; font-size:15px; color:#333;">
        We’ll get back to you soon! <br/>
        🌍 <i style ="color:#FF9800">Hello : Where people connect each other & Bringing you closer, wherever you are!!</i>
      </p>
      <p style="margin-top:30px; color:#4F46E5; font-weight:bold;">– The Hello Team</p>
    </div>
  `,
});


    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("Email send error:", error);
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
}

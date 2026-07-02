import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { SITE_NAME } from '@/consts';

export const prerender = false;

interface ContactPayload {
  name?: string;
  company?: string;
  email?: string;
  tel?: string;
  message?: string;
  'hp-address'?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, locals }) => {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ ok: false, message: '不正なリクエストです。' }, 400);
  }

  const name = String(payload.name ?? '').trim();
  const company = String(payload.company ?? '').trim();
  const email = String(payload.email ?? '').trim();
  const tel = String(payload.tel ?? '').trim();
  const message = String(payload.message ?? '').trim();
  const honeypot = String(payload['hp-address'] ?? '').trim();

  if (!name || !email || !message) {
    return jsonResponse(
      { ok: false, message: 'お名前・メールアドレス・お問い合わせ内容は必須です。' },
      400,
    );
  }

  if (!EMAIL_RE.test(email)) {
    return jsonResponse({ ok: false, message: 'メールアドレスの形式が正しくありません。' }, 400);
  }

  // ハニーポットに入力があった場合はボットとみなし、見かけ上は成功させつつメール送信のみスキップする
  if (honeypot) {
    return jsonResponse({ ok: true }, 200);
  }

  const env = locals.runtime.env;
  const resend = new Resend(env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: env.CONTACT_FROM_EMAIL,
    to: env.CONTACT_TO_EMAIL,
    replyTo: email,
    subject: `【${SITE_NAME}】お問い合わせ: ${name} 様`,
    text: [
      `お名前: ${name}`,
      `会社名: ${company || '（未入力）'}`,
      `メールアドレス: ${email}`,
      `電話番号: ${tel || '（未入力）'}`,
      '',
      'お問い合わせ内容:',
      message,
    ].join('\n'),
  });

  if (error) {
    console.error('Resend send error:', error);
    return jsonResponse(
      { ok: false, message: '送信に失敗しました。時間をおいて再度お試しください。' },
      500,
    );
  }

  return jsonResponse({ ok: true }, 200);
};

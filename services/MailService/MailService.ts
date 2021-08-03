import nodemailer, { SentMessageInfo } from 'nodemailer'

export class MailServiceClass {
  sendSignupUser(email: string, hash: string) {
    const smtpData: any = {
      host: 'smtp.gmail.com',
      port: '465',
      secure: true,
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_PASSWORD
      }
    }
    const mailData = {
      from: '"〇〇" <' + smtpData.auth.user + '>',
      to: email,
      subject: '〇〇 新規登録の案内',
      html: `<div>
        <p>以下のリンクからユーザー登録を行ってください。<p/>
        <a href="${process.env.NEXT_PUBLIC_DOMAIN}/mypage/auth/signup?hash=${hash}" target="_blank">ユーザー登録</a>
      </div>
      `,
    }
    return new Promise<SentMessageInfo>((resolve, reject) => {
      const transporter = nodemailer.createTransport(smtpData)
      transporter.sendMail(mailData, (error, info) => {
        if (error) {
          // エラー処理
          console.log('// エラー処理')
          reject(error)
        } else {
          // 送信時処理
          console.log('// 送信時処理')
          console.log('Email sent: ' + info)
          resolve(info)
        }
      })
    })
  }
}

export const MailService = new MailServiceClass
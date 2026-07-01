import { IUserRepository } from '../../repositories/interfaces/IUserRepository'
import { IOtpRepository } from '../../repositories/interfaces/IOtpRepository'
import { AppError } from '../errors/app-error'
import { env } from '../../env'
import nodemailer from 'nodemailer'

interface SendOtpRequest {
  email: string
}

export class SendOtpUseCase {
  constructor(
    private userRepository: IUserRepository,
    private otpRepository: IOtpRepository
  ) {}

  async execute({ email }: SendOtpRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      // Retorna sucesso para evitar "user enumeration"
      return
    }

    if (!user.is_active) {
      throw new AppError('Usuário desativado. Entre em contato com a loja.', 403)
    }

    // Gerar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Expira em 15 minutos
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    await this.otpRepository.create({
      email,
      code,
      expires_at: expiresAt,
    })

    if (env.SMTP_USER && env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST || 'smtp.gmail.com',
        port: env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: `"ChamApp" <${env.SMTP_USER}>`,
        to: email,
        subject: 'Recuperação de Senha - ChamApp',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Olá, ${user.name}!</h2>
            <p>Você solicitou a recuperação da sua senha no <b>ChamApp</b>.</p>
            <p>Seu código de verificação de 6 dígitos é:</p>
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #EA1D2C;">${code}</h1>
            <p>Este código expira em 15 minutos.</p>
            <p style="color: #666; font-size: 14px;">Se não foi você que solicitou, por favor, ignore este e-mail.</p>
          </div>
        `,
      })
    } else {
      console.log(`\n========================================`)
      console.log(`[RECUPERAÇÃO DE SENHA]`)
      console.log(`E-mail: ${email}`)
      console.log(`Código: ${code}`)
      console.log(`========================================\n`)
    }
  }
}

import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetStoreSettings } from '../../../services/factories/make-store-settings'

// Retorna os próximos N dias disponíveis e as janelas de horários
export async function getStoreAvailability(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const useCase = makeGetStoreSettings()
  const { settings } = await useCase.execute()

  const operatingDays = (settings.operating_days as Array<any>) || [
    { day: 0, open: false },
    { day: 1, open: true, start: "08:00", end: "18:00" },
    { day: 2, open: true, start: "08:00", end: "18:00" },
    { day: 3, open: true, start: "08:00", end: "18:00" },
    { day: 4, open: true, start: "08:00", end: "18:00" },
    { day: 5, open: true, start: "08:00", end: "18:00" },
    { day: 6, open: true, start: "08:00", end: "12:00" },
  ]
  const holidays = (settings.holidays as string[]) || []

  const availableDays = []
  const today = new Date()

  // Gerar disponibilidade para os próximos 14 dias
  for (let i = 0; i < 14; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    
    // Ignorar dias no passado para o dia atual (na verificação de horários)
    const dateStr = d.toISOString().split('T')[0]
    
    if (holidays.includes(dateStr)) {
      continue // Feriado, não atende
    }

    const dayOfWeek = d.getDay()
    const config = operatingDays.find((op: any) => op.day === dayOfWeek)

    if (config && config.open) {
      // Gerar as janelas de horários de 1h em 1h
      const startHour = parseInt(config.start.split(':')[0])
      const endHour = parseInt(config.end.split(':')[0])
      
      const timeSlots = []
      for (let h = startHour; h < endHour; h++) {
        const slotStart = `${h.toString().padStart(2, '0')}:00`
        const slotEnd = `${(h + 1).toString().padStart(2, '0')}:00`
        
        // Se for hoje, e a janela já passou, não adiciona
        if (i === 0) {
          const currentHour = today.getHours()
          if (h <= currentHour) continue
        }

        timeSlots.push(`${slotStart} - ${slotEnd}`)
      }

      if (timeSlots.length > 0) {
        availableDays.push({
          date: dateStr,
          timeSlots,
        })
      }
    }
  }

  return reply.status(200).send({ availableDays })
}

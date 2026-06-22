import { EventEmitter } from 'events'

class AppEvents extends EventEmitter {}

export const appEvents = new AppEvents()

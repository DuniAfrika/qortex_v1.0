import EventEmitter from 'events';

export type QortexEvent = {
  type: string;
  data: Record<string, unknown>;
  timestamp: string;
};

class QortexEventBus extends EventEmitter {
  emitEvent(type: string, data: Record<string, unknown>) {
    const payload: QortexEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    this.emit('event', payload);
  }
}

export const eventBus = new QortexEventBus();

export const emitEvent = (type: string, data: Record<string, unknown>) => {
  eventBus.emitEvent(type, data);
};

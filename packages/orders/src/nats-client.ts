import nats, { Stan } from 'node-nats-streaming';

class NatsClient {
  private _stan?: Stan;

  get stan() {
    if(!this._stan) {
      throw new Error('NATS client unavailable');
    }

    return this._stan;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._stan = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.stan.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });

      this.stan.on('error', (error) => {
        console.error('Failed to connect to NATS', error);
        reject(error);
      });
    });
  }
}

// Export a singleton...
export const natsClient = new NatsClient();

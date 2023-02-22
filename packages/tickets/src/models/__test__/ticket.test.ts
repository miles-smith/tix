import { Ticket } from '../ticket';

describe('Ticket', () => {
  
  describe('Optimistic Concurrency Control', () => {
    let ticketId: string;

    beforeEach(async () => {
      const ticket = Ticket.build({
        title: 'Test Ticket',
        price: '1.00',
        userId: '62064650b18cd064285bc555',
      });

      await ticket.save();

      ticketId = ticket.id;
    });
    
    it('has a `version` property', async () => {
      const ticket = await Ticket.findById(ticketId);

      expect(ticket).toHaveProperty('version', 0)
    });

    it('increments the `version` number on save', async () => {
      const ticket = await Ticket.findById(ticketId);

      expect(ticket!.version).toEqual(0);

      ticket!.set({ price: '2.00' });
      
      await ticket!.save();

      expect(ticket!.version).toEqual(1);
    });

    it('allows updates to fresh records', async () => {
      const freshTicket = await Ticket.findById(ticketId);
      const staleTicket = await Ticket.findById(ticketId);

      freshTicket!.set({ price: '2.00' });
      staleTicket!.set({ price: '3.00' });

      await expect(freshTicket!.save()).resolves.toBeTruthy();
    });

    it('prevents updates to stale records', async () => {
      const freshTicket = await Ticket.findById(ticketId);
      const staleTicket = await Ticket.findById(ticketId);

      freshTicket!.set({ price: '2.00' });
      staleTicket!.set({ price: '3.00' });

      await freshTicket!.save();

      await expect(staleTicket!.save()).rejects.toBeTruthy();
    });
  });
});


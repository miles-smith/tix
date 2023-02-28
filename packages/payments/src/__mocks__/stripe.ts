import { randomUUID } from "crypto";

export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({
      id: randomUUID()
    })
  }
}

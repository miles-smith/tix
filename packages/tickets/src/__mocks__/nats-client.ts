export const natsClient = {
  stan: {
    publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
      callback();
    })
  }
};

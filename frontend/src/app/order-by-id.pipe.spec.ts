import { OrderByIdPipe } from './order-by-id.pipe';

describe('OrderByIdPipe', () => {
  it('create an instance', () => {
    const pipe = new OrderByIdPipe();
    expect(pipe).toBeTruthy();
  });
});

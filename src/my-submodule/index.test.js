import { sum, multiply } from './'

describe('my-submodule', () => {
  it('can sum', () => {
    expect(sum(1, 2)).toEqual(3)
  })

  it('can multiply', () => {
    expect(multiply(10, 2)).toEqual(20)
  })
})

import { mySubmodule } from './'

it('can use functions inside module', () => {
	expect(mySubmodule.sum(1, 2)).toEqual(3)
	expect(mySubmodule.multiply(2, 3)).toEqual(6)
})

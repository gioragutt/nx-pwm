// import { Hasher, HasherContext } from '@nrwl/devkit';

// import { depcheckHasher } from './hasher';

// describe('depcheckHasher', () => {
//   it('should generate hash', async () => {
//     const mockHasher: Hasher = {
//       hashTaskWithDepsAndContext: jest
//         .fn()
//         .mockReturnValue({ value: 'hashed-task' }),
//     } as unknown as Hasher;

//     const hash = await depcheckHasher(
//       {
//         id: 'my-task-id',
//         target: {
//           project: 'proj',
//           target: 'target',
//         },
//         overrides: {},
//       },
//       {
//         hasher: mockHasher,
//       } as unknown as HasherContext
//     );

//     expect(hash).toEqual({ value: 'hashed-task' });
//   });
// });

it.todo('figure out how to test this with file access');

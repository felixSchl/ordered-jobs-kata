import run from '..';
import assert from 'assert';

describe('The ordered jobs kata', () => {
  it('should resolve job dependencies', () => {

    assert.deepEqual(
      run([ { name: 'a' } ])
    , [ 'a' ]);

    assert.deepEqual(
      run([
        { name: 'a' }
      , { name: 'b' }
      , { name: 'c' }
      ])
    , [ 'a', 'b', 'c' ]);

    assert.deepEqual(
      run([
        { name: 'a' }
      , { name: 'b', depends: 'c' }
      , { name: 'c' }
      ])
    , [ 'a', 'c', 'b' ]);

    assert.deepEqual(
      run([
        { name: 'a' }
      , { name: 'b', depends: 'c' }
      , { name: 'c', depends: 'f' }
      , { name: 'd', depends: 'a' }
      , { name: 'e', depends: 'b' }
      , { name: 'f' }
      ])
    , [ 'a', 'd', 'f', 'c', 'b', 'e' ]);

    assert.throws(() => {
      run([
        { name: 'a' }
      , { name: 'b' }
      , { name: 'c', depends: 'c' }
      ]);
    });

    assert.throws(() => {
      run([
        { name: 'a' }
      , { name: 'b', depends: 'c' }
      , { name: 'c', depends: 'f' }
      , { name: 'd', depends: 'a' }
      , { name: 'e' }
      , { name: 'f', depends: 'b' }
      ])
    });
  });
});

import _ from 'lodash';

/**
 * Solve the ordered jobs kata.
 *
 * http://invalidcast.tumblr.com/post/52980617776/the-ordered-jobs-kata
 * 
 * This is naiive, unoptimized and uses recursion which will overflow the
 * stack if the list of jobs is long enough (unless babel works some magic
 * here, e.g. transpiles this into trampolines).
 *
 * @param {Array<{ name: String, depends: String }>} jobs
 * The jobs to resolve, where each jobs can depend on other jobs.
 * 
 * @param {Array<String>} [solved]
 * The list of solved jobs (used internally to recurse).
 * 
 * @returns {Array<String>}
 * The list of job names in order.
 */
export default function run(jobs=[], solved=[]) {
  return jobs.length
    ? run.apply(
        null
      , _.foldl(
          jobs
        , ([open, done], { name, depends }) => {
            if (name === depends) {
              throw new Error(
                'Self Referencing Dependency detected: '
              + `${name} depends on itself ${depends}`);
            }
            if (depends) {
              if (_.contains(done, depends)) {
                done.push(name);
              } else {

                // Resolve cyclic dependencies
                (function resolve(depends, chain=[name]) {
                  const next = _.find(open, ({ name }) => name === depends);
                  if (next) {
                    chain = chain.concat([next.depends]);
                    if (next.depends === name) {
                      throw new Error(
                        'Cyclic dependency detected: '
                      + chain.join('->'));
                    } else {
                      resolve(next.depends, chain);
                    }
                  }
                })(depends);

                open.push({ name: name, depends: depends });
              }
            } else {
              done.push(name);
            }
            return [open, done];
          }
        , [[], solved]))
    : solved;
};

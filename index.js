import _ from 'lodash';

/**
 * Solve the ordered jobs mantra
 *
 * http://invalidcast.tumblr.com/post/52980617776/the-ordered-jobs-kata
 *
 * @param {Array<Job>}
 * The jobs to resolve, where each {Job} can depend on other jobs.
 *
 * @returns {Array<Job>}
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

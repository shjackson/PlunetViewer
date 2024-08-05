import _ from "lodash";

export async function sequentialPromises(promises: Promise<any>[]) {
  for (const promise of promises) {
    if (_.isArray(promise)) {
      await Promise.all(promise);
      continue;
    }
    await promise;
  }
}
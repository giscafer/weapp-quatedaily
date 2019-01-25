/* async/await  try/catch解决方案 */
export default function promiseHandler(promise) {
  return promise.then(res => [null, res]).catch(err => [err, null]);
}

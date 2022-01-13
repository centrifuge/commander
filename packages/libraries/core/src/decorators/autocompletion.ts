/**
 * Class decorator for command auto-completion support.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function Autocompletion(target: Function) {
  Object.defineProperty(target.prototype, 'autocomplete', {
    value: function autocomplete() {
      console.log('Add auto-completion support using decorator');
    },
  });
}

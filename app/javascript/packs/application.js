import { needsPolyfills, loadPolyfills } from '../mastodon/load_polyfills';
import main from '../mastodon/main';

if (true || needsPolyfills()) {
  loadPolyfills().then(main);
} else {
  main();
}

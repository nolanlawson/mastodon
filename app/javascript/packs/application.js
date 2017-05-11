import { needsPolyfills, loadPolyfills } from '../mastodon/load_polyfills';
import main from '../mastodon/main';

if (needsPolyfills()) {
  loadPolyfills().then(main);
} else {
  main();
}

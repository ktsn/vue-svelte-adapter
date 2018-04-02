# vue-svelte-adapter

Using Svelte components in Vue.js.

## Usage

Install it via npm:

```sh
$ npm install vue-svelte-adapter
```

First, you make a Svelte component:

```html
<p>{{ message }}</p>

<script>
export default {
  data() {
    return {
      message: 'Hello!'
    }
  }
}
</script>
```

Then, you import the component and `toVue` function from `vue-svelte-component` so that transform it into a Vue component.

```js
// Your Svelte component
import Hello from './Hello.html'

// Svelte to Vue adapter
import { toVue } from 'vue-svelte-adapter'

// Return a Vue component which converted from the Svelte component
export default toVue(Hello, {
  // You can specify some Vue props to port to Svelte data
  props: {
    message: String
  }
})
```

## License

MIT

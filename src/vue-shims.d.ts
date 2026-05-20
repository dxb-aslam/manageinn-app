// Tells TypeScript that *.vue files have a default-exported Vue component.
// Without this, `import Foo from './Foo.vue'` errors in IDEs.
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

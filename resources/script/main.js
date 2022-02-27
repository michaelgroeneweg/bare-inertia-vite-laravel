import { createApp, h } from "vue"
import { App, plugin, Head, Link } from '@inertiajs/inertia-vue3'
import { InertiaProgress } from '@inertiajs/progress'
import '../css/app.css';

InertiaProgress.init()

const el = document.getElementById('app')

let asyncViews = () => {
  return import.meta.glob('./Pages/**/*.vue');
}

const app = createApp({
  render: () => h(App, {
    initialPage: JSON.parse(el.dataset.page),
        resolveComponent: async name => {
            if (import.meta.env.DEV) {
                return (await import(`../views/pages/${name}.vue`)).default;
            } else {
                let pages = asyncViews();
                const importPage = pages[`../views/pages/${name}.vue`];
                return importPage().then(module => module.default);
            }
        }
    })
})

app.use(plugin)
    .component('InertiaHead', Head)
    .component('InertiaLink', Link)
    .mount(el)
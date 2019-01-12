
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { name: 'home', path: '/', component: () => import('components/Home'), meta: {auth: true} },
      { name: 'addnew', path: '/addnew', component: () => import('components/Addnew'), meta: {auth: true} },
      { name: 'edithousehold', path: '/edithousehold/:id', component: () => import('components/EditHousehold'), meta: {auth: true} },
      { name: 'settings', path: '/settings', component: () => import('components/Settings'), meta: {auth: true} }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

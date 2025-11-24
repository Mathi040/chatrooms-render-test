import { Router } from '@vaadin/router';

if (window.location.pathname === '/chatroom') {
    window.location.replace('/');
}

const router = new Router(document.querySelector('.root'));
router.setRoutes([
    { path: '/', component: 'home-page' },
    { path: '/chatroom', component: 'chat-page' }
]);


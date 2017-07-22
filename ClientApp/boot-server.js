import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { routes } from './routes';

export default createServerRenderer(params => {
    return new Promise((resolve, reject) => {

        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const routerContext = {};
        const app = (
            <StaticRouter context={ routerContext } location={ params.location.path } children={ routes } />
        );
        renderToString(app);

        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            resolve({ redirectUrl: routerContext.url });
            return;
        }
        
        // Once any async tasks are done, we can perform the final render
        params.domainTasks.then(() => {
            resolve({
                html: renderToString(app),
                globals: { }
            });
        }, reject); // Also propagate any errors back into the host application
    });
});

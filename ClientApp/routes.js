import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Login } from './components/Login/Login';

export const routes = <Layout>
    <Route exact path='/' component={ Login } />
</Layout>;
import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, defer } from 'react-router-dom';
import { Cart } from './pages/Cart/Cart';
import { Error as ErrorPage } from './pages/Error/Error';
import './index.css';
import { Layout } from './layout/Menu/Layout';
import { Products } from './pages/Product/Product';
import axios from 'axios';
import { PREFIX } from './helpers/API';

const Menu = lazy(() => import('./pages/Menu/Menu'));

const router = createBrowserRouter([
	{
		path: '/',
		element: <Layout/>,
		children: [
			{
				path: '/',
				element: <Suspense fallback={<>Загрузка...</>}><Menu/></Suspense>
			},
			{
				path: '/cart',
				element: <Cart/>
			},
			{
				path: '/product/:id',
				element: <Products/>,
				errorElement: <>Error</>,
				loader: async ({params}) => {
					return defer({
						data: new Promise((resolve, reject) => {
							setTimeout(() => {
								axios.get(`${PREFIX}/products/${params.id}`).then(result => resolve(result)).catch(err => reject(err));
							}, 2000);
						})
					});
					// return defer({
					// 	data: axios.get(`${PREFIX}/products/${params.id}`).then(data => data)
					// });
					// await new Promise<void>((resolve) => {
					// 	setTimeout(() => {
					// 		resolve();
					// 	}, 2000);
					// });
					// const { data } =  await axios.get(`${PREFIX}/products/${params.id}`);
					// return data;
				}
			}
		]
	},
	{
		path: '*',
		element: <ErrorPage/>
	}
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router}/>
	</React.StrictMode>
);

import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import PosterDetailPage from "./PosterDetailPage";
import HomePage from "./HomePage";
import ErrorPage from "./ErrorPage";
import BasketPage from "./BasketPage";


const router = createBrowserRouter([{

    path: "/",
    element: <Layout/>,
    errorElement: <ErrorPage/>,
    children: [
      {path: "/", element: <HomePage/>},
      {path: "/products/:id", element: <PosterDetailPage/>},
      {path: "/basket", element: <BasketPage/>},
      
    ]


    }])

export default router;
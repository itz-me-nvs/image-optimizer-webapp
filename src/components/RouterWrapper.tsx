import { Suspense } from "react"
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import App from "../App"
import Authorize from "./Authorize"
import CMSOptimizationPage from "./CMSOptimizePage"
import LoaderComponent from "./Loading"
import SiteList from "./SiteList"
import useAuth from "./useAuth"

const RouterWrapper = () => {
    const isAuthorized = useAuth()
    console.log('uferufeb', isAuthorized);

    return (
        <Router>
        <Suspense fallback={<LoaderComponent />}>
        <Routes>
        <Route
                path="authorize"
                element={ isAuthorized ? <Navigate to="/" /> : <Authorize />}
              />
        <Route path="/" element={isAuthorized ? <App /> : <Authorize />}>
        <Route index element={<SiteList />} />

            <Route
            path='sites'
            element={<Navigate to="/" />}
            />
            <Route
                  path="sites/:siteID"
                  element={<CMSOptimizationPage />}
                />
        </Route>
        </Routes>
        </Suspense>
        </Router>
    )
}

export default RouterWrapper
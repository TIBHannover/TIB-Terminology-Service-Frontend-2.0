import React from "react";
// The import below should be updated to match your Router component
import includeRoutes from "../RouterComponent/RouterComponent";
import DynamicSitemap from "react-dynamic-sitemap";

export default function Sitemap(props) {
	return (
		<DynamicSitemap routes={includeRoutes} prettify={true} {...props}/>
	);
}
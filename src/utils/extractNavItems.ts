import { joinPath } from "./joinPath";
import type { NavItem, RouteWithHandle } from "@/@types/global";


export function extractNavItems(routes:RouteWithHandle[], parentPath:string = ''):NavItem[] {
  
  const navItems:NavItem[] = [];

  for ( const route of routes ) {
    const path = route.index ? ( parentPath || '/' ) : joinPath(parentPath, route.path);

    if ( route.handle?.showInNav && route.handle?.label ) {
      navItems.push( { path, label: route.handle.label } );
    }

    if ( route.children ) {
      navItems.push(...extractNavItems(route.children, path));
    }
  }

  return navItems;
}
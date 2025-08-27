export function joinPath(base:string, child?:string):string {
  if(!child) return base || '/';

  const normalizeBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizeChild = child.startsWith("/") ? child.slice(1) : child;

  return `${normalizeBase}/${normalizeChild}`;
}
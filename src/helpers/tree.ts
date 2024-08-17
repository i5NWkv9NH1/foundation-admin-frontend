// @ts-nocheck
export const menuFieldMapping = {
  id: 'id',
  name: 'name',
  router: 'router',
  icon: 'icon',
  path: 'path',
  parentId: 'parentId',
  component: 'component',
  redirect: 'redirect',
  // TODO: Bug
  // type: 'type',
  parent: 'parent',
  children: 'children',
  actions: 'actions',
  sort: 'sort'
};
export const organizationFieldMapping = {
  id: 'id',
  name: 'name',
  label: 'label',
  icon: 'icon',
  path: 'path',
  parentId: 'parentId',
  sort: 'sort',
  status: 'status',
  // TODO: type field bug
  // type: 'type',
  parent: 'parent',
  children: 'children',
  accounts: 'accounts'
};
export function buildTree<T>(data?: T[], fieldMapping): T[] {
  if (!data) return;
  if (!!!data.length) return;

  const nodesMap = {};
  const rootNodes = [];

  // 创建节点映射
  data.forEach((item) => {
    const node = {};
    Object.keys(fieldMapping).forEach((key) => {
      node[key] = item[fieldMapping[key]];
    });
    node.parent = null; // 初始值为 null
    node.children = [];

    nodesMap[item[fieldMapping.id]] = node;
  });

  // 构建树结构
  data.forEach((item) => {
    const node = nodesMap[item[fieldMapping.id]];
    const pathParts = item[fieldMapping.path].split('.');

    if (pathParts.length > 1) {
      // 获取父节点的路径
      const parentPath = pathParts.slice(0, -1).join('.');
      const parentId = Object.keys(nodesMap).find((id) => nodesMap[id].path === parentPath);

      if (parentId) {
        const parentNode = nodesMap[parentId];
        parentNode.children.push(node);
        node.parent = parentNode; // 设置 parent 字段
      }
    } else {
      // 根节点
      rootNodes.push(node);
    }
  });

  // 递归填充子节点
  function addChildren(nodes) {
    nodes.forEach((node) => {
      // 避免在每个层级重复添加相同的子节点
      const childNodes = data
        .filter((item) => {
          const itemPathParts = item[fieldMapping.path].split('.');
          return itemPathParts.length === node.path.split('.').length + 1 && item[fieldMapping.path].startsWith(node.path + '.');
        })
        .map((item) => nodesMap[item[fieldMapping.id]])
        .filter((childNode) => !node.children.some((existingChild) => existingChild.id === childNode.id)); // 避免重复添加

      node.children.push(...childNodes);

      // 排序子节点
      node.children.sort((a, b) => {
        const sortA = a[fieldMapping.sort] || 0;
        const sortB = b[fieldMapping.sort] || 0;
        return sortA - sortB;
      });

      addChildren(childNodes); // 递归处理子节点
    });
  }

  addChildren(rootNodes);

  return rootNodes;
}

export function convertToTree(menus) {
  // 1. 创建一个 ID 到菜单对象的映射
  const menuMap = new Map();
  menus.forEach((menu) => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // 2. 构建树形结构
  const tree = [];
  menus.forEach((menu) => {
    if (menu.parentId) {
      // 如果有父菜单，将其添加到父菜单的 children 数组中
      const parentMenu = menuMap.get(menu.parentId);
      if (parentMenu) {
        parentMenu.children.push(menuMap.get(menu.id));
      }
    } else {
      // 如果没有父菜单，则为根菜单
      tree.push(menuMap.get(menu.id));
    }
  });

  return tree;
}
// 预先导入所有可能的组件
const views = import.meta.glob('@/pages/**/*.vue');

// 动态导入组件的辅助函数
function loadView(view: string) {
  const matchedView = views[`/src/pages${view}.vue`];
  if (matchedView) {
    return matchedView;
  } else {
    return views[`/src/pages/[...404].vue`];
  }
}
// 从菜单数据生成 Vue Router 4 的 RouteRecordRaw
export function buildRoutes(tree: any[], parentRouter = ''): RouteRecordRaw[] {
  return tree.map((item) => {
    const { path, parentId, type, ...rest } = item; // 删除 path 字段
    const route: RouteRecordRaw = {
      path: type === 'MENU' ? item.router.replace(/^\//, '') : item.router, // 使用 router 字段，确保子路由路径不以 / 开头
      name: item.name,
      component: type === 'MENU' ? loadView(`${parentRouter}/${item.component}`) : () => import('@/layouts/AdminLayout.vue'),
      meta: { title: item.name, icon: item.icon, sort: item.sort },
      children: item.children ? buildRoutes(item.children, type === 'CATALOG' ? `${parentRouter}${item.router}` : parentRouter) : []
    };
    return route;
  });
}

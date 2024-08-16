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

export const convertToTree = buildTree;

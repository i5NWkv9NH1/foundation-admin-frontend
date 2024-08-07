// @ts-nocheck
export function buildTree (flatData) {
  const map = new Map()
  const root = []

  // 创建一个 ID 到节点的映射
  flatData.forEach(item => {
    map.set(item.id, { ...item, children: [] })
  })

  // 组装树结构
  flatData.forEach(item => {
    const node = map.get(item.id)
    if (item.parentId === null) {
      root.push(node)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children.push(node)
      }
    }
  })

  return root
}

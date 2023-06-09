/*
 * @Author: LiuTao
 * @Date: 2023-06-02 09:22:16
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-06-05 15:25:09
 * @Description: ...
 */
/* eslint-disable prefer-spread */
import { isArray, isNumber, isObject, isNil } from './is'

/**
 * @description: 柯里化
 * @param cb { Function }
 * @return { Function }
 */
export function curry(cb: Function): Function {
  return (function recursion(...args: any[]) {
    const fn = function (...args2: any[]) {
      return recursion.apply(null, [...args, ...args2])
    }
    fn.valueOf = function () {
      return cb.apply(null, args)
    }
    fn.toString = function () {
      return this.valueOf()
    }
    return fn
  })()
}

/**
 * @description: To Number
 * @return { Number or undefined }
 */
export function toNumber(arg) {
  if (isNumber(arg)) return arg
  const res = Number(arg)
  return Number.isNaN(res) ? undefined : res
}
/**
 * @description: Stringify Object to string
 * @param { Object }
 * @return { String }
 */
export function toJSON(arg) {
  try {
    const str = JSON.stringify(arg)
    return str
  } catch (e) {
    console.error(e)
  }
}
/**
 * @description: Parse json string to Object
 * @param { String }
 * @return { Object }
 */
export function parseJSON(arg) {
  try {
    const json = JSON.parse(arg)
    return json
  } catch (e) {
    console.error(e)
  }
}

/**
 * Remove an item from an array.
 */
export function remove(arr, item) {
  if (!arr.length) return
  const index = arr.indexOf(item)
  if (index > -1) {
    return arr.splice(index, 1)
  }
}

/**
 * @description: Flat to tree
 * @param { Array }
 * @return { Array }
 */
export function flatToTree(flat, root?, fields?) {
  if (!isArray(flat)) return console.error('Invalid argument!')

  fields = Object.assign({ key: 'id', parent: 'pid', children: 'children' }, fields)

  const temp = {}
  const tree: any[] = []
  flat.forEach(item => !isNil(item[fields.key]) && (temp[item[fields.key]] = item))
  flat.forEach(item => {
    const parentKey = item[fields.parent]
    const parent = temp[parentKey]
    if (root !== undefined ? parentKey === root : !parent) {
      tree.push(item)
      return
    }
    if (!parent || parent === item) return
    if (!parent[fields.children]) {
      parent[fields.children] = []
    }
    parent[fields.children].push(item)
  })
  return tree
}

/**
 * @description: Tree to flat（BFS）
 * @param { Array }
 * @return { Array }
 */
export function treeToFlat(tree, fields?, arr: any[] = []) {
  if (isObject(tree)) {
    tree = [tree]
  }
  if (!isArray(tree)) return console.error('Invalid argument!')

  fields = Object.assign({ key: 'id', parent: 'pid', children: 'children' }, fields)

  const temp: any[] = []
  tree.forEach(item => {
    arr.push(item)
    if (!Array.isArray(item[fields.children])) return
    item[fields.children].forEach(_ => {
      _[fields.parent] = item[fields.key]
    })
    temp.push(...item[fields.children])
    delete item[fields.children]
  })
  if (temp.length === 0) return arr
  return treeToFlat(temp, fields, arr)
}
/**
 * @description: Tree to flat（DFS）
 * @param { Array }
 * @return { Array }
 */
export function treeToFlat2(tree, fields?) {
  if (isObject(tree)) {
    tree = [tree]
  }
  if (!isArray(tree)) return console.error('Invalid argument!')

  fields = Object.assign({ key: 'id', parent: 'pid', children: 'children' }, fields)

  const arr: any[] = []
  tree.forEach(item => {
    arr.push(item)
    if (!isArray(item[fields.children])) return
    arr.push(...(treeToFlat2(item[fields.children] || []), fields))
    delete item[fields.children]
  })
  return arr
}

/**
 * @description: Tree's forEach
 * @param { tree: Array, callback: Function, fields: Object }
 */
export function treeForEach(tree, callback, fields?) {
  if (!isArray(tree)) return console.error('Invalid argument!')

  fields = Object.assign({ children: 'children' }, fields)

  const recur = function (_tree, parent = null) {
    _tree.forEach((item, index) => {
      callback(item, index, parent)
      if (isArray(item[fields.children])) {
        recur(item[fields.children], item)
      }
    })
    return _tree
  }
  return recur(tree)
}

/**
 * @description: Tree's filter
 * @param { tree: Array, callback: Function, fields: Object }
 */
export function treeFilter(tree, callback, fields?) {
  if (!isArray(tree)) return console.error('Invalid argument!')

  fields = Object.assign({ children: 'children' }, fields)

  const recur = function (_tree, parent = null) {
    return _tree.filter((item, index) => {
      const res = callback(item, index, parent)
      if (res && isArray(item[fields.children])) {
        item[fields.children] = recur(item[fields.children], item)
      }
      return res
    })
  }
  return recur(tree)
}

/**
 * @description: Tree's map
 * @param { tree: Array, callback: Function, fields: Object }
 */
export function treeMap(tree, callback, fields?) {
  if (!isArray(tree)) return console.error('Invalid argument!')

  fields = Object.assign({ children: 'children' }, fields)

  const recur = function (_tree, parent = null) {
    return _tree.map((item, index) => {
      const res = callback(item, index, parent)
      if (isArray(item[fields.children])) {
        item[fields.children] = recur(item[fields.children], item)
      }
      return res
    })
  }
  return recur(tree)
}

/**
 * @description: Find node in tree
 * @param { tree: Array, value: Any, fields: Object }
 * @return { Any }
 */
export function findNodeInTree(tree, value, fields?) {
  if (isObject(tree)) {
    tree = [tree]
  }
  if (!isArray(tree)) return console.error('Invalid argument!')

  fields = Object.assign({ key: 'id', children: 'children' }, fields)

  let res: any = null
  tree.some((node, index) => {
    if (node[fields.key] === value) {
      res = { index, node }
      return true
    }
    if (isArray(node[fields.children])) {
      res = findNodeInTree(node[fields.children], value, fields)
      if (res) {
        res.parent = node
      }
      return !!res
    }
  })
  return res
}

/**
 * @description: Get children keys
 * @param { Array | Object }
 * @return { Array }
 */
export function getChildrenKeys(tree, fields?) {
  if (isObject(tree)) {
    tree = [tree]
  }
  if (!isArray(tree)) return console.error('Invalid argument!')

  fields = Object.assign({ key: 'id', parent: 'pid', children: 'children' }, fields)

  function _loop(_arg, keys: any[] = []) {
    if (!isArray(_arg) || !_arg.length) return keys
    const _children: any = []
    _arg.forEach(p => {
      if (isArray(p[fields.children])) {
        _children.push(...p[fields.children])
      }
    })
    keys.push(..._children.map(_ => _[fields.key]))
    return _loop(_children, keys)
  }
  return _loop(tree)
}

/**
 * @description: Get parent keys
 * @param { tree: Array, key: Any, fields: Object }
 * @return { Array }
 */
export function getParentKeys(tree, key, fields?) {
  if (isObject(tree)) {
    tree = [tree]
  }
  if (!isArray(tree)) return console.error('Invalid argument!')

  fields = Object.assign({ key: 'id', parent: 'pid', children: 'children' }, fields)

  const temp = {}
  const keys: any = []
  treeForEach(
    tree,
    item => {
      temp[item[fields.key]] = item
    },
    fields
  )
  while (temp[key]) {
    const pKey = temp[key][fields.parent]
    const pNode = temp[pKey]
    if (isNil(pKey) || !pNode) break
    key = pNode[fields.key]
    keys.push(key)
  }
  return keys.reverse()
}

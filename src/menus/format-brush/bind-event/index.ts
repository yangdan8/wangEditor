import { styleStr, headTagName } from './../index'
import Editor from '../../../editor/index'
import $, { DomElement } from '../../../utils/dom-core'
import { UA } from '../../../utils/util'
import SelectionAndRange from '../../../editor/selection'

// 不需要应用样式的标签
const DISABLED_TAG_LIST = ['IMG', 'A', 'VIDEO', 'HR', 'TABLE', 'TBODY', 'UL', 'OL', 'LI']

/**
 * 绑定格式刷的事件监听函数
 * @param editor Editor
 */
function bindEvent(editor: Editor) {
    const fn = (e: MouseEvent) => {
        if (!editor.formatActiveFlag) return
        // 获取选区
        const selection = editor?.selection
        // 创建空白选区并且保存,解决range缓存造成的无法准确获取正确range的问题
        selection.createEmptyRange()
        selection.saveRange()
        // 选区为空,说明是点击选择的某行元素
        if (selection.isSelectionEmpty()) {
            // 获取鼠标所在的目标元素
            const targetElem = $(e.target)
            // 根据目标元素创建选区
            selection.createRangeByElem(targetElem)
            const text = selection.getSelectionText()
            // headTagName不为空,证明用户选中的是个标题
            if (headTagName !== '' && !hasDisabledTag(targetElem)) {
                // 处理head标签
                handleHeadTag(editor, text)
            } else {
                if (hasDisabledTag(targetElem)) return
                // 普通标签
                targetElem.html(text).attr && targetElem?.html(text)?.attr('style', styleStr)
                selection.restoreSelection()
                // handleNormalTag(editor, text)
            }
        } else {
            const resultElem = getSelectionAllElem(selection)
            // 保证选中的元素都是可以应用样式的
            if (resultElem) {
                // 处理head标签
                if (headTagName !== '') {
                    const text = selection.getSelectionText()
                    const containerElem = selection.getRange()?.startContainer
                    // 选中的是元素
                    if (containerElem?.nodeType === 1) {
                        // 如果选择的有禁用的标签则不应用样式
                        if (hasDisabledTag($(containerElem))) {
                            return
                        }
                    }
                    handleHeadTag(editor, text)
                } else {
                    // 普通标签
                    handleNormalTag(editor, resultElem!)
                }
            }
        }
        selection.restoreSelection()
        // 应用完毕,取消菜单高亮
        editor.formatActiveFlag = false
    }
    // 将处理事件放入事件池中
    editor.txt.eventHooks.formatBrushMouseupEvents.push(fn)
}

/**
 * 处理包含标题的标签
 * @param editor Editor
 * @param text 选中的文本
 */
function handleHeadTag(editor: Editor, text: string) {
    // 避免styleStr为空时,标签上存在style属性
    if (styleStr === '') {
        editor.cmd.do('insertHTML', `<${headTagName} >${text}</${headTagName}>`)
    } else {
        editor.cmd.do('insertHTML', `<${headTagName} style='${styleStr}'>${text}</${headTagName}>`)
    }
}

/**
 * 处理普通标签
 * @param editor Editor
 * @param text 选中的文本
 */
function handleNormalTag(editor: Editor, text: string) {
    // 火狐浏览器需要特殊处理一下
    const tagName = UA.isFirefox ? 'span' : 'p'
    // 避免styleStr为空时,标签上存在style属性
    if (styleStr === '') {
        editor.cmd.do('insertHTML', `<${tagName} >${text}</${tagName}>`)
    } else {
        editor.cmd.do('insertHTML', `<${tagName} style='${styleStr}'>${text}</${tagName}>`)
    }
}

/**
 * 判断该元素以及子元素是否为禁用格式刷的标签
 * @param target 目标元素
 * @returns boolean
 */
function hasDisabledTag(target: DomElement): boolean {
    if (!target) return false
    // 元素标签名
    const nodeName = target.getNodeName()
    if (DISABLED_TAG_LIST.includes(nodeName)) {
        return true
    }
    // 获取子元素
    const children = target.children()?.elems!
    for (let i = 0; i < children.length; i++) {
        return hasDisabledTag($(children[i]))
    }
    return false
}
/**
 * 获取选区中的所有元素结构
 * @param selection 选区
 * @returns string 元素的字符串
 */
function getSelectionAllElem(selection: SelectionAndRange) {
    const startElem = selection.getSelectionStartElem()
    const endElem = selection.getSelectionEndElem()
    let result = ''
    let nextElem = startElem
    // 选中的是一行文本中的部分文字
    if (startElem?.selector === endElem?.selector) {
        return (result = `<span style="${styleStr}">${selection?.getSelectionText()}</span>`)
    }
    while (nextElem?.selector) {
        // 如果有禁止元素,就直接返回,不执行任何操作
        if (hasDisabledTag(nextElem!)) {
            return
        } else {
            result += `<p style="${styleStr}">${nextElem?.text()}</p>`
        }
        if (nextElem?.selector === endElem?.selector) return result
        // 获取下一个相邻元素
        nextElem = nextElem?.getNextSibling()
    }
    return result
}
export default bindEvent
